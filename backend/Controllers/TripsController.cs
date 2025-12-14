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
        private readonly IWebHostEnvironment _env;

        public TripsController(AppDbContext context, ILogger<TripsController> logger, IWebHostEnvironment env)
        {
            _context = context;
            _logger = logger;
            _env = env;
        }

        // GET: api/admin/trips
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TripDto>>> GetAllTrips()
        {
            try
            {
                _logger.LogInformation("📥 GetAllTrips called");

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
                    RouteName = null,
                    TotalSpots = t.TotalSpots,
                    AvailableSpots = t.AvailableSpots,       // ✅ COMMA!
                    MainImage = t.MainImage,                 // ✅ FIXED - use 't' not 'trip'
                    GalleryImages = t.GalleryImages          // ✅ FIXED - use 't' not 'trip'
                }).ToList();

                return Ok(tripDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error in GetAllTrips: {ex.Message}");
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
            var trip = await _context.Trips
                .Include(t => t.Route)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (trip == null) return NotFound();

            return new TripDto
            {
                Id = trip.Id,
                Name = trip.Title,
                Description = trip.Description,
                StartDate = trip.StartDate,
                EndDate = trip.EndDate,
                Price = trip.Price,
                Duration = (trip.EndDate - trip.StartDate).Days,
                RouteId = trip.RouteId,
                RouteName = trip.Route?.Name,
                TotalSpots = trip.TotalSpots,
                AvailableSpots = trip.AvailableSpots,
                MainImage = trip.MainImage,
                GalleryImages = trip.GalleryImages
            };
        }

        // POST: api/admin/trips
        [HttpPost]
        public async Task<ActionResult<TripDto>> CreateTrip(
            [FromForm] CreateTripDto dto,
            [FromForm] IFormFile? mainImage,
            [FromForm] List<IFormFile>? galleryImages)
        {
            try
            {
                _logger.LogInformation($"📥 CreateTrip called");
                _logger.LogInformation($"Main image: {mainImage?.FileName ?? "none"}");
                _logger.LogInformation($"Gallery images count: {galleryImages?.Count ?? 0}");

                var trip = new Trip
                {
                    Title = dto.Name,
                    Description = dto.Description,
                    StartDate = dto.StartDate,
                    EndDate = dto.EndDate,
                    Price = dto.Price,
                    RouteId = dto.RouteId,
                    TotalSpots = dto.TotalSpots,
                    AvailableSpots = dto.AvailableSpots
                };

                // ✅ HANDLE MAIN IMAGE
                if (mainImage != null && mainImage.Length > 0)
                {
                    var uploadsFolder = Path.Combine(_env.WebRootPath, "images", "trips");
                    
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(mainImage.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await mainImage.CopyToAsync(fileStream);
                    }

                    trip.MainImage = $"/images/trips/{uniqueFileName}";
                    _logger.LogInformation($"Main image saved: {trip.MainImage}");
                }

                // ✅ HANDLE GALLERY IMAGES
                if (galleryImages != null && galleryImages.Count > 0)
                {
                    _logger.LogInformation($"🖼️ Processing {galleryImages.Count} gallery images");
                    
                    var galleryFolder = Path.Combine(_env.WebRootPath, "images", "trips", "gallery");
                    
                    if (!Directory.Exists(galleryFolder))
                    {
                        Directory.CreateDirectory(galleryFolder);
                    }

                    var imageUrls = new List<string>();

                    foreach (var image in galleryImages)
                    {
                        if (image.Length > 0)
                        {
                            var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
                            var filePath = Path.Combine(galleryFolder, uniqueFileName);

                            using (var fileStream = new FileStream(filePath, FileMode.Create))
                            {
                                await image.CopyToAsync(fileStream);
                            }

                            imageUrls.Add($"/images/trips/gallery/{uniqueFileName}");
                            _logger.LogInformation($"✅ Saved gallery image: {uniqueFileName}");
                        }
                    }

                    if (imageUrls.Count > 0)
                    {
                        trip.GalleryImages = string.Join(",", imageUrls);
                        _logger.LogInformation($"📝 GalleryImages string: {trip.GalleryImages}");
                    }
                }
                else
                {
                    _logger.LogWarning($"⚠️ No gallery images received");
                }

                _context.Trips.Add(trip);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"✅ Trip created with ID: {trip.Id}");

                return CreatedAtAction(nameof(GetTrip), new { id = trip.Id }, new TripDto
                {
                    Id = trip.Id,
                    Name = trip.Title,
                    Description = trip.Description,
                    StartDate = trip.StartDate,
                    EndDate = trip.EndDate,
                    Price = trip.Price,
                    Duration = (trip.EndDate - trip.StartDate).Days,
                    RouteId = trip.RouteId,
                    TotalSpots = trip.TotalSpots,
                    AvailableSpots = trip.AvailableSpots,
                    MainImage = trip.MainImage,
                    GalleryImages = trip.GalleryImages
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error in CreateTrip: {ex.Message}");
                _logger.LogError($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Klaida kuriant kelionę", error = ex.Message });
            }
        }

        // PUT: api/admin/trips/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTrip(int id, [FromBody] UpdateTripDto dto)
        {
            try
            {
                _logger.LogInformation($"📥 UpdateTrip called for id: {id}");
                _logger.LogInformation($"TotalSpots: {dto.TotalSpots}, AvailableSpots: {dto.AvailableSpots}");

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
                trip.TotalSpots = dto.TotalSpots;
                trip.AvailableSpots = dto.AvailableSpots;

                _context.Entry(trip).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                _logger.LogInformation($"✅ Trip {id} updated successfully");

                return Ok(new { message = "Kelionė atnaujinta sėkmingai" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error in UpdateTrip: {ex.Message}");
                return StatusCode(500, new { message = "Klaida atnaujinant kelionę", error = ex.Message });
            }
        }

        // DELETE: api/admin/trips/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(int id)
        {
            try
            {
                _logger.LogInformation($"📥 DeleteTrip called for id: {id}");

                var trip = await _context.Trips.FindAsync(id);

                if (trip == null)
                {
                    return NotFound(new { message = "Kelionė nerasta" });
                }

                _context.Trips.Remove(trip);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"✅ Trip {id} deleted successfully");

                return Ok(new { message = "Kelionė ištrinta sėkmingai" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error in DeleteTrip: {ex.Message}");
                return StatusCode(500, new { message = "Klaida trinant kelionę", error = ex.Message });
            }
        }
    }

    // ============================================
    // DTOs
    // ============================================

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
        public int TotalSpots { get; set; }
        public int AvailableSpots { get; set; }
        public string? MainImage { get; set; }
        public string? GalleryImages { get; set; }
    }

    public class CreateTripDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Price { get; set; }
        public int RouteId { get; set; }
        public int TotalSpots { get; set; }
        public int AvailableSpots { get; set; }
    }

    public class UpdateTripDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Price { get; set; }
        public int RouteId { get; set; }
        public int TotalSpots { get; set; }
        public int AvailableSpots { get; set; }
    }
}