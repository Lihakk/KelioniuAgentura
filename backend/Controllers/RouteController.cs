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

        // --- 1. GENERATE & SAVE (The Money Maker) ---
        [HttpPost("generate")]
        public async Task<IActionResult> GenerateRoute([FromQuery] string from, [FromQuery] string to, [FromQuery] int interval = 300)
        {
            // USE THE NEW METHOD HERE
            var plan = await _googleMapsService.GenerateComplexTripAsync(from, to, interval);
            
            if (plan == null) return BadRequest("Could not calculate route.");

            // Calculate simple values
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
                Season = "Summer", 

                Stops = plan.SuggestedStops.SelectMany(s => s.SuggestedAttractions.Select(a => new PointOfInterest
                {
                    Name = a.Name,
                    Type = "Tourist Attraction",
                    Address = a.Address ?? $"Near {s.CityName}",
                    Rating = a.Rating,
                    Latitude = a.Latitude,
                    Longitude = a.Longitude,
                    IsPaidTicket = false, 
                    OpeningHours = "9:00 - 18:00"
                })).ToList()
            };

            _context.Routes.Add(newRoute);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Route generated and saved!", RouteId = newRoute.Id });
        }

        // --- 2. GET ONE ROUTE ---
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoute(int id)
        {
            var route = await _context.Routes
                .Include(r => r.Stops)
                .FirstOrDefaultAsync(r => r.Id == id);
            
            if (route == null) return NotFound();
            return Ok(route);
        }

        // --- 3. UPDATE ROUTE ---
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

        // --- 4. LIST ALL ROUTES ---
        [HttpGet]
        public async Task<IActionResult> GetAllRoutes()
        {
            return Ok(await _context.Routes.Include(r => r.Stops).ToListAsync());
        }

        // --- 5. DELETE ROUTE ---
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoute(int id)
        {
            var route = await _context.Routes.FindAsync(id);
            if (route == null) return NotFound();
            _context.Routes.Remove(route);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Deleted." });
        }
    }
}