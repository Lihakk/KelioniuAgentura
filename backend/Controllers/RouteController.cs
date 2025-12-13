using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Entities;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteController : ControllerBase
    {
        private readonly IGoogleMapsService _googleMapsService;
        private readonly AppDbContext _context;

        public RouteController(IGoogleMapsService googleMapsService, AppDbContext context)
        {
            _googleMapsService = googleMapsService;
            _context = context;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateRoute([FromQuery] string from, [FromQuery] string to, [FromQuery] int interval = 300)
        {
            var plan = await _googleMapsService.GenerateComplexTripAsync(from, to, interval);
            if (plan == null) return BadRequest("Could not calculate route.");

            double distKm = double.TryParse(plan.TotalDistance?.Replace(" km", "").Replace(",", ""), out var d) ? d : 0;
            int estimatedDays = (int)Math.Ceiling(distKm / 500); 
            if (estimatedDays < 1) estimatedDays = 1;

            var newRoute = new backend.Entities.Route
            {
                Name = $"{from} - {to} Trip",
                StartCity = from,
                EndCity = to,
                DistanceKm = distKm,
                DurationDays = estimatedDays,
                EncodedPolyline = plan.EncodedPolyline,
                IsDraft = true, 
                Season = "Summer"
            };

            foreach (var stop in plan.SuggestedStops)
            {
                var cityEntity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == stop.CityName);
                
                if (cityEntity == null)
                {
                    cityEntity = new City 
                    { 
                        Name = stop.CityName, 
                        Country = stop.Country ?? "Unknown", 
                        Coordinates = $"{stop.Location.Latitude},{stop.Location.Longitude}" 
                    };
                    _context.Cities.Add(cityEntity);
                    await _context.SaveChangesAsync(); // Save to generate ID
                }

                int count = 0;
                foreach (var attr in stop.SuggestedAttractions)
                {
                    count++;
                    newRoute.Stops.Add(new backend.Entities.PointOfInterest
                    {
                        Name = attr.Name,
                        Type = "Tourist Attraction",
                        Address = attr.Address ?? $"Near {stop.CityName}",
                        Rating = attr.Rating,
                        Latitude = attr.Latitude,
                        Longitude = attr.Longitude,
                        IsPaidTicket = false,
                        OpeningHours = "9:00 - 18:00",
                        
                        CityId = cityEntity.Id,

                        IsSelected = count <= 3 
                    });
                }
            }

            _context.Routes.Add(newRoute);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Route generated and saved!", RouteId = newRoute.Id });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoute(int id)
        {
            var route = await _context.Routes
                .Include(r => r.Stops)
                .FirstOrDefaultAsync(r => r.Id == id);
            
            if (route == null) return NotFound();
            return Ok(route);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoute(int id, [FromBody] backend.Entities.Route updatedData)
        {
            var route = await _context.Routes.Include(r => r.Stops).FirstOrDefaultAsync(r => r.Id == id);
            if (route == null) return NotFound();

            route.Name = updatedData.Name;
            route.DurationDays = updatedData.DurationDays;
            route.Season = updatedData.Season;
            route.IsDraft = false; 

            _context.PointsOfInterest.RemoveRange(route.Stops);
            route.Stops = updatedData.Stops;

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Route saved successfully." });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRoutes()
        {
            return Ok(await _context.Routes.Include(r => r.Stops).ToListAsync());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoute(int id)
        {
            bool isUsed = await _context.Trips.AnyAsync(t => t.RouteId == id);

            if (isUsed)
            {
                return BadRequest(new { Message = "Negalima atšaukti: Maršrutas naudojamas suplanuotose kelionėse." });
            }

            var route = await _context.Routes.FindAsync(id);
            if (route == null) return NotFound("Maršrutas nerastas.");

            _context.Routes.Remove(route);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Maršrutas sėkmingai atšauktas." });
        }
        
        [HttpPost("{id}/recalculate")]
        public async Task<IActionResult> RecalculateRoute(int id)
        {
            var route = await _context.Routes
                .Include(r => r.Stops)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (route == null) return NotFound("Route not found");

            var origin = new backend.Services.Results.CoordinatesResult {};

            var startCoords = await _googleMapsService.GetCoordinatesAsync(route.StartCity);
            var endCoords = await _googleMapsService.GetCoordinatesAsync(route.EndCity);

            if (startCoords == null || endCoords == null) return BadRequest("Could not locate start/end cities.");

            var waypoints = route.Stops
                .Where(s => s.IsSelected)
                .Select(s => new backend.Services.Results.CoordinatesResult 
                { 
                    Latitude = s.Latitude, 
                    Longitude = s.Longitude 
                })
                .ToList();

            var newPlan = await _googleMapsService.RecalculatePathAsync(startCoords, endCoords, waypoints);
            
            if (newPlan == null) return BadRequest("Google failed to calculate path.");

            route.EncodedPolyline = newPlan.EncodedPolyline;
            
            // Update distance/duration if they changed significantly
            double newDist = double.TryParse(newPlan.TotalDistance?.Replace(" km", "").Replace(",", ""), out var d) ? d : route.DistanceKm;
            route.DistanceKm = newDist;
            
            await _context.SaveChangesAsync();

            return Ok(new { 
                Message = "Route recalculated!", 
                EncodedPolyline = route.EncodedPolyline,
                DistanceKm = route.DistanceKm,
                DurationText = newPlan.TotalDuration
            });
        }
        
        [HttpGet("estimate-info")]
        public async Task<IActionResult> EstimateInfo([FromQuery] string from, [FromQuery] string to)
        {
            var plan = await _googleMapsService.GetSimpleRouteAsync(from, to);
            
            if (plan == null) return BadRequest("Nepavyko rasti maršruto tarp šių miestų.");

            double distKm = double.TryParse(plan.TotalDistance?.Replace(" km", "").Replace(",", ""), out var d) ? d : 0;
            
            int estimatedDays = (int)Math.Max(1, Math.Ceiling(distKm / 400)); 

            return Ok(new 
            { 
                DistanceKm = distKm,
                DurationText = plan.TotalDuration, 
                EstimatedDays = estimatedDays,
                StartCity = from,
                EndCity = to
            });
        }
    }
}