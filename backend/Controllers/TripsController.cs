using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/admin/trips")]
    public class TripsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<TripsController> _logger;

        public TripsController(AppDbContext context, ILogger<TripsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/admin/trips
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TripDto>>> GetAllTrips()
        {
            try
            {
                _logger.LogInformation("📥 GetAllTrips called");

                // Simple query first - no includes
                var trips = await _context.Trips.ToListAsync();
                
                _logger.LogInformation($"✅ Found {trips.Count} trips");

                var tripDtos = trips.Select(t => new TripDto
                {
                    Id = t.Id,
                    Name = t.Title,
                    Description = t.Description,
                    StartDate = t.StartDate,
                    EndDate = t.EndDate,
                    Price = t.Price,
                    Duration = (t.EndDate - t.StartDate).Days,
                    RouteId = t.RouteId,
                    RouteName = null // Temporarily null
                }).ToList();

                return Ok(tripDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetAllTrips: {ex.Message}");
                _logger.LogError($"Stack trace: {ex.StackTrace}");
                
                return StatusCode(500, new { 
                    message = "Klaida gaunant keliones", 
                    error = ex.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }

        // GET: api/admin/trips/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TripDto>> GetTrip(int id)
        {
            try
            {
                _logger.LogInformation($" GetTrip called for id: {id}");

                var trip = await _context.Trips.FindAsync(id);

                if (trip == null)
                {
                    return NotFound(new { message = "Kelionė nerasta" });
                }

                var tripDto = new TripDto
                {
                    Id = trip.Id,
                    Name = trip.Title,
                    Description = trip.Description,
                    StartDate = trip.StartDate,
                    EndDate = trip.EndDate,
                    Price = trip.Price,
                    Duration = (trip.EndDate - trip.StartDate).Days,
                    RouteId = trip.RouteId,
                    RouteName = null
                };

                return Ok(tripDto);
            }
            catch (Exception ex)
            {
                _logger.LogError($" Error in GetTrip: {ex.Message}");
                return StatusCode(500, new { message = "Klaida gaunant kelionę", error = ex.Message });
            }
        }

        // POST: api/admin/trips
        [HttpPost]
        public async Task<ActionResult<TripDto>> CreateTrip([FromBody] CreateTripDto dto)
        {
            try
            {
                _logger.LogInformation($" CreateTrip called");

                var trip = new Trip
                {
                    Title = dto.Name,
                    Description = dto.Description,
                    StartDate = dto.StartDate,
                    EndDate = dto.EndDate,
                    Price = dto.Price,
                    RouteId = dto.RouteId
                };

                _context.Trips.Add(trip);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTrip), new { id = trip.Id }, new TripDto
                {
                    Id = trip.Id,
                    Name = trip.Title,
                    Description = trip.Description,
                    StartDate = trip.StartDate,
                    EndDate = trip.EndDate,
                    Price = trip.Price,
                    Duration = (trip.EndDate - trip.StartDate).Days,
                    RouteId = trip.RouteId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in CreateTrip: {ex.Message}");
                return StatusCode(500, new { message = "Klaida kuriant kelionę", error = ex.Message });
            }
        }

        // PUT: api/admin/trips/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTrip(int id, [FromBody] UpdateTripDto dto)
        {
            try
            {
                _logger.LogInformation($"UpdateTrip called for id: {id}");

                var trip = await _context.Trips.FindAsync(id);

                if (trip == null)
                {
                    return NotFound(new { message = "Kelionė nerasta" });
                }

                trip.Title = dto.Name;
                trip.Description = dto.Description;
                trip.StartDate = dto.StartDate;
                trip.EndDate = dto.EndDate;
                trip.Price = dto.Price;
                trip.RouteId = dto.RouteId;

                _context.Entry(trip).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Kelionė atnaujinta sėkmingai" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in UpdateTrip: {ex.Message}");
                return StatusCode(500, new { message = "Klaida atnaujinant kelionę", error = ex.Message });
            }
        }

        // DELETE: api/admin/trips/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(int id)
        {
            try
            {
                _logger.LogInformation($" DeleteTrip called for id: {id}");

                var trip = await _context.Trips.FindAsync(id);

                if (trip == null)
                {
                    return NotFound(new { message = "Kelionė nerasta" });
                }

                _context.Trips.Remove(trip);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Kelionė ištrinta sėkmingai" });
            }
            catch (Exception ex)
            {
                _logger.LogError($" Error in DeleteTrip: {ex.Message}");
                return StatusCode(500, new { message = "Klaida trinant kelionę", error = ex.Message });
            }
        }
    }

    // DTOs
    public class TripDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Price { get; set; }
        public int Duration { get; set; }
        public int RouteId { get; set; }
        public string? RouteName { get; set; }
    }

    public class CreateTripDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Price { get; set; }
        public int RouteId { get; set; }
    }

    public class UpdateTripDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Price { get; set; }
        public int RouteId { get; set; }
    }
}