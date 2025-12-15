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
    [AllowAnonymous] // Change to [Authorize] in production
    [ApiController]
    [Route("api/recommendations")]
    public class RecommendationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<RecommendationsController> _logger;

        public RecommendationsController(AppDbContext context, ILogger<RecommendationsController> logger)
        {
            _context = context;
            _logger = logger;
        }

      
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecommendationDto>>> GetRecommendations(
            [FromQuery] int userId,
            [FromQuery] int count = 6
        )
        {
            try
            {
                _logger.LogInformation($"📥 Getting recommendations for user {userId}");

                // 1. Get user preferences
                var preferences = await _context.UserPreferences
                    .FirstOrDefaultAsync(p => p.UserId == userId);

                if (preferences == null)
                {
                    return BadRequest(new { 
                        message = "Preferencijos nerastos. Pirmiausia nustatykite savo preferencijas.",
                        redirectTo = "/preferences"
                    });
                }

                // 2. Get all available trips with routes
                var trips = await _context.Trips
                    .Include(t => t.Route)
                    .Where(t => t.AvailableSpots > 0)
                    .ToListAsync();

                if (!trips.Any())
                {
                    _logger.LogWarning("No available trips found");
                    return Ok(new List<RecommendationDto>());
                }

                _logger.LogInformation($"Found {trips.Count} available trips");

                // 3. Filter trips by hard constraints (optional pre-filtering)
                var filteredTrips = trips.Where(trip => {
                    // Must have available spots
                    if (trip.AvailableSpots <= 0) return false;
                    
                    // Budget - allow 50% over max budget
                    if (trip.Price > preferences.BudgetMax * 1.5m) return false;
                    
                    return true;
                }).ToList();

                _logger.LogInformation($"After filtering: {filteredTrips.Count} trips");

                // 4. Score each trip using multi-factor algorithm
                var scoredTrips = filteredTrips.Select(trip => 
                {
                    var score = CalculateRecommendationScore(trip, preferences);
                    var reasons = GenerateReasons(trip, preferences);
                    
                    return new
                    {
                        Trip = trip,
                        Score = score,
                        Reasons = reasons
                    };
                }).ToList();

                // 5. Sort by score (highest first) and take top N
                var topTrips = scoredTrips
                    .OrderByDescending(x => x.Score)
                    .Take(count)
                    .ToList();

                _logger.LogInformation($"Top {topTrips.Count} trips selected");

                // 6. Map to DTOs
                var recommendations = topTrips.Select(x => new RecommendationDto
                {
                    TripId = x.Trip.Id,
                    Title = x.Trip.Title,
                    Description = x.Trip.Description,
                    StartDate = x.Trip.StartDate,
                    EndDate = x.Trip.EndDate,
                    Price = x.Trip.Price,
                    Duration = (x.Trip.EndDate - x.Trip.StartDate).Days,
                    RouteId = x.Trip.RouteId,
                    RouteName = x.Trip.Route?.Name,
                    AvailableSpots = x.Trip.AvailableSpots,
                    TotalSpots = x.Trip.TotalSpots,
                    Score = x.Score,
                    MatchPercentage = Math.Round(x.Score, 0),
                    Reasons = x.Reasons
                }).ToList();

                _logger.LogInformation($"✅ Returning {recommendations.Count} recommendations");
                
                return Ok(recommendations);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error generating recommendations: {ex.Message}");
                return StatusCode(500, new { 
                    message = "Klaida generuojant rekomendacijas",
                    error = ex.Message 
                });
            }
        }

      
        
        [HttpPost("preferences")]
        public async Task<IActionResult> SavePreferences([FromBody] UserPreferencesDto dto)
        {
            try
            {
                _logger.LogInformation($"📥 Saving preferences for user {dto.UserId}");

                // Validate
                if (dto.BudgetMin < 0 || dto.BudgetMax < dto.BudgetMin)
                {
                    return BadRequest(new { message = "Neteisingas biudžeto diapazonas" });
                }

                if (dto.MinDuration < 1 || dto.MaxDuration < dto.MinDuration)
                {
                    return BadRequest(new { message = "Neteisingas trukmės diapazonas" });
                }

                var existing = await _context.UserPreferences
                    .FirstOrDefaultAsync(p => p.UserId == dto.UserId);

                if (existing != null)
                {
                    // Update existing
                    existing.BudgetMin = dto.BudgetMin;
                    existing.BudgetMax = dto.BudgetMax;
                    existing.MinDuration = dto.MinDuration;
                    existing.MaxDuration = dto.MaxDuration;
                    existing.TravelDateStart = dto.TravelDateStart;
                    existing.TravelDateEnd = dto.TravelDateEnd;
                    existing.PreferredDestinations = dto.PreferredDestinations != null 
                        ? string.Join(",", dto.PreferredDestinations) 
                        : string.Empty;
                    existing.TravelStyle = dto.TravelStyle != null 
                        ? string.Join(",", dto.TravelStyle) 
                        : string.Empty;
                    existing.ActivityLevel = dto.ActivityLevel;
                    existing.GroupSize = dto.GroupSize ?? "any";
                    existing.UpdatedAt = DateTime.UtcNow;

                    _context.Entry(existing).State = EntityState.Modified;
                    
                    _logger.LogInformation("Updating existing preferences");
                }
                else
                {
                    // Create new
                    var preferences = new UserPreferences
                    {
                        UserId = dto.UserId,
                        BudgetMin = dto.BudgetMin,
                        BudgetMax = dto.BudgetMax,
                        MinDuration = dto.MinDuration,
                        MaxDuration = dto.MaxDuration,
                        TravelDateStart = dto.TravelDateStart,
                        TravelDateEnd = dto.TravelDateEnd,
                        PreferredDestinations = dto.PreferredDestinations != null 
                            ? string.Join(",", dto.PreferredDestinations) 
                            : string.Empty,
                        TravelStyle = dto.TravelStyle != null 
                            ? string.Join(",", dto.TravelStyle) 
                            : string.Empty,
                        ActivityLevel = dto.ActivityLevel,
                        GroupSize = dto.GroupSize ?? "any"
                    };
                    
                    _context.UserPreferences.Add(preferences);
                    
                    _logger.LogInformation("Creating new preferences");
                }

                await _context.SaveChangesAsync();
                
                _logger.LogInformation("✅ Preferences saved successfully");
                
                return Ok(new { message = "Preferencijos sėkmingai išsaugotos" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error saving preferences: {ex.Message}");
                return StatusCode(500, new { 
                    message = "Klaida išsaugant preferencijas",
                    error = ex.Message 
                });
            }
        }
        
    
        // GET PREFERENCES
       
        
        [HttpGet("preferences/{userId}")]
        public async Task<ActionResult<UserPreferencesDto>> GetPreferences(int userId)
        {
            try
            {
                var preferences = await _context.UserPreferences
                    .FirstOrDefaultAsync(p => p.UserId == userId);

                if (preferences == null)
                {
                    return NotFound(new { message = "Preferencijos nerastos" });
                }

                var dto = new UserPreferencesDto
                {
                    UserId = preferences.UserId,
                    BudgetMin = preferences.BudgetMin,
                    BudgetMax = preferences.BudgetMax,
                    MinDuration = preferences.MinDuration,
                    MaxDuration = preferences.MaxDuration,
                    TravelDateStart = preferences.TravelDateStart,
                    TravelDateEnd = preferences.TravelDateEnd,
                    PreferredDestinations = !string.IsNullOrEmpty(preferences.PreferredDestinations)
                        ? preferences.PreferredDestinations.Split(',').ToList() 
                        : new List<string>(),
                    TravelStyle = !string.IsNullOrEmpty(preferences.TravelStyle)
                        ? preferences.TravelStyle.Split(',').ToList() 
                        : new List<string>(),
                    ActivityLevel = preferences.ActivityLevel,
                    GroupSize = preferences.GroupSize
                };

                return Ok(dto);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting preferences: {ex.Message}");
                return StatusCode(500, new { 
                    message = "Klaida gaunant preferencijas",
                    error = ex.Message 
                });
            }
        }

       
        // SCORING ALGORITHM - MULTI-FACTOR 
       
        
        private double CalculateRecommendationScore(Trip trip, UserPreferences prefs)
        {
            double totalScore = 0;

            // Factor 1: Budget Match (23 points)
            totalScore += CalculateBudgetScore(trip.Price, prefs.BudgetMin, prefs.BudgetMax) * 23;

            // Factor 2: Duration Match (18 points)
            int tripDuration = (trip.EndDate - trip.StartDate).Days;
            totalScore += CalculateDurationScore(tripDuration, prefs.MinDuration, prefs.MaxDuration) * 18;

            // Factor 3: Date Match (14 points)
            totalScore += CalculateDateScore(trip.StartDate, trip.EndDate, prefs.TravelDateStart, prefs.TravelDateEnd) * 14;

            // Factor 4: Destination Match (15 points) - WITH SYNONYMS
            totalScore += CalculateDestinationScore(trip, prefs.PreferredDestinations) * 15;

            // Factor 5: Travel Style Match (15 points) - WITH SYNONYMS
            totalScore += CalculateTravelStyleScore(trip, prefs.TravelStyle) * 15;

            // Factor 6: Activity Level Match (7 points)
            totalScore += CalculateActivityLevelScore(trip, prefs.ActivityLevel) * 7;

            // Factor 7: Group Size Match (5 points) - NEW!
            totalScore += CalculateGroupSizeScore(trip, prefs.GroupSize) * 5;

            // Factor 8: Availability Bonus (3 points)
            totalScore += CalculateAvailabilityScore(trip.AvailableSpots, trip.TotalSpots) * 3;

            // Cap score at 100
            return Math.Min(Math.Round(totalScore, 2), 100);
        }

        // Budget matching: returns 0-1 score
        private double CalculateBudgetScore(decimal price, decimal min, decimal max)
        {
            // Perfect match - within range
            if (price >= min && price <= max)
            {
                return 1.0;
            }

            // Too cheap
            if (price < min)
            {
                double diff = (double)(min - price) / (double)min;
                return Math.Max(0, 1 - diff);
            }

            // Too expensive
            double excessRatio = (double)(price - max) / (double)max;
            return Math.Max(0, 1 - excessRatio);
        }

        // Duration matching: returns 0-1 score
        private double CalculateDurationScore(int duration, int min, int max)
        {
            // Perfect match
            if (duration >= min && duration <= max)
            {
                return 1.0;
            }

            // Too short
            if (duration < min)
            {
                double diff = (double)(min - duration) / min;
                return Math.Max(0, 1 - diff);
            }

            // Too long
            double excessRatio = (double)(duration - max) / max;
            return Math.Max(0, 1 - excessRatio);
        }

        // Date matching: returns 0-1 score
        private double CalculateDateScore(DateTime tripStart, DateTime tripEnd, DateTime? userStart, DateTime? userEnd)
        {
            // No date preference = neutral score
            if (!userStart.HasValue || !userEnd.HasValue)
            {
                return 0.5;
            }

            // Perfect overlap - trip falls within user's window
            if (tripStart >= userStart.Value && tripEnd <= userEnd.Value)
            {
                return 1.0;
            }

            // Partial overlap
            if (tripStart <= userEnd.Value && tripEnd >= userStart.Value)
            {
                return 0.7; // Partial match
            }

            // Close to window - within 30 days
            TimeSpan beforeGap = userStart.Value - tripEnd;
            TimeSpan afterGap = tripStart - userEnd.Value;

            if (beforeGap.TotalDays > 0 && beforeGap.TotalDays <= 30)
            {
                return Math.Max(0, 0.5 - (beforeGap.TotalDays / 60)); // Decay over 30 days
            }

            if (afterGap.TotalDays > 0 && afterGap.TotalDays <= 30)
            {
                return Math.Max(0, 0.5 - (afterGap.TotalDays / 60));
            }

            return 0; // Too far away
        }

        // Destination matching WITH SYNONYMS: returns 0-1 score
        private double CalculateDestinationScore(Trip trip, string preferredDestinations)
        {
            if (string.IsNullOrEmpty(preferredDestinations))
            {
                return 0.5; // No preference = neutral
            }

            var preferred = preferredDestinations.ToLower().Split(',')
                .Select(d => d.Trim())
                .Where(d => !string.IsNullOrEmpty(d))
                .ToList();

            if (!preferred.Any())
            {
                return 0.5;
            }

            var tripTitle = trip.Title?.ToLower() ?? "";
            var tripDescription = trip.Description?.ToLower() ?? "";
            var routeName = trip.Route?.Name?.ToLower() ?? "";

            // Destination synonyms dictionary
            var destinationSynonyms = new Dictionary<string, List<string>>
            {
                { "graikija", new List<string> { "graikija", "greece", "atėnai", "athens", "graikų", "santorini" } },
                { "italija", new List<string> { "italija", "italy", "roma", "rome", "venecija", "venice", "florencija", "milano", "italų" } },
                { "ispanija", new List<string> { "ispanija", "spain", "barselona", "barcelona", "madridas", "madrid", "ispanų", "valensija" } },
                { "prancūzija", new List<string> { "prancūzija", "france", "paryžius", "paris", "prancūzų", "nicė", "lionas" } },
                { "portugalija", new List<string> { "portugalija", "portugal", "lisabona", "lisbon", "porto", "portugalų" } },
                { "kroatija", new List<string> { "kroatija", "croatia", "dubrovnikas", "dubrovnik", "splitas", "split", "kroatų", "zagreb" } },
                { "lietuva", new List<string> { "lietuva", "lithuania", "vilnius", "kaunas", "klaipėda", "lietuvos", "lietuviškas" } },
                { "latvija", new List<string> { "latvija", "latvia", "ryga", "riga", "latvijos", "latviškas" } },
                { "estija", new List<string> { "estija", "estonia", "talinas", "tallinn", "estijos", "estiškas" } },
                { "vokietija", new List<string> { "vokietija", "germany", "berlynas", "berlin", "miunchenas", "munich", "vokiečių", "hamburgas" } },
                { "lenkija", new List<string> { "lenkija", "poland", "varšuva", "warsaw", "krokuva", "krakow", "lenkų", "gdanskas" } },
                { "čekija", new List<string> { "čekija", "czech", "praha", "prague", "čekų", "brno" } },
                { "austrija", new List<string> { "austrija", "austria", "viena", "vienna", "austrijų", "zalcburgas" } },
                { "vengrija", new List<string> { "vengrija", "hungary", "budapeštas", "budapest", "vengrų", "vengrijos" } },
                { "baltijos", new List<string> { "baltijos", "baltic", "baltija", "baltics" } }
            };

            int matchCount = 0;
            foreach (var destination in preferred)
            {
                var destLower = destination.ToLower();
                
                // Try to find synonyms
                var synonyms = new List<string> { destLower };
                foreach (var kvp in destinationSynonyms)
                {
                    if (kvp.Value.Contains(destLower) || kvp.Key == destLower)
                    {
                        synonyms.AddRange(kvp.Value);
                        break;
                    }
                }

                // Check all synonyms
                foreach (var synonym in synonyms.Distinct())
                {
                    if (tripTitle.Contains(synonym) || 
                        tripDescription.Contains(synonym) || 
                        routeName.Contains(synonym))
                    {
                        matchCount++;
                        break; // Found match for this destination
                    }
                }
            }

            // Return ratio of matched destinations
            if (matchCount > 0)
            {
                return Math.Min(1.0, (double)matchCount / preferred.Count);
            }

            return 0; // No match
        }

        private double CalculateTravelStyleScore(Trip trip, string travelStyle)
        {
            if (string.IsNullOrEmpty(travelStyle))
            {
                return 0.5; 
            }

            var userStyles = travelStyle.ToLower().Split(',')
                .Select(s => s.Trim())
                .Where(s => !string.IsNullOrEmpty(s))
                .ToList();

            if (!userStyles.Any())
            {
                return 0.5;
            }

            var tripTitle = trip.Title?.ToLower() ?? "";
            var tripDescription = trip.Description?.ToLower() ?? "";
            var routeName = trip.Route?.Name?.ToLower() ?? "";

            // Enhanced style keywords with synonyms
            var styleKeywords = new Dictionary<string, List<string>>
            {
                { "nuotykiai", new List<string> { 
                    "nuotykis", "nuotyki", "adventure", "ekstremalus", "aktyvus", 
                    "žygis", "kelionė", "tyrinėjimas", "expedition", "exploration"
                }},
                { "gamta", new List<string> { 
                    "gamta", "parkas", "nacionalinis", "kraštovaizdis", "nature", 
                    "miškas", "kalnas", "kalnynas", "ežeras", "upė", "jūra", "paplūdimys",
                    "kalnai", "gamtos", "aplinka", "ekologija", "wildlife", "outdoor"
                }},
                { "kultūra", new List<string> { 
                    "kultūra", "muziejus", "istorija", "menas", "architektūra", 
                    "senamiestis", "paminklas", "galerija", "teatras", "opera",
                    "istorinis", "kultūrinis", "heritage", "culture", "art", "museum",
                    "traditional", "paveldas"
                }},
                { "atsipalaidavimas", new List<string> { 
                    "atsipalaidavimas", "spa", "poilsis", "ramybė", "relaxation", 
                    "wellness", "sveikata", "masažas", "atsipalaidavimo", "comfort",
                    "komfortas", "prabanga", "luxury"
                }},
                { "miestas", new List<string> { 
                    "miestas", "sostinė", "city", "metropolis", "urbanistinis",
                    "miesto", "didmiestis", "urban", "centras", "downtown"
                }}
            };

            int matchCount = 0;
            foreach (var userStyle in userStyles)
            {
                if (styleKeywords.TryGetValue(userStyle, out var keywords))
                {
                    foreach (var keyword in keywords)
                    {
                        if (tripTitle.Contains(keyword) || 
                            tripDescription.Contains(keyword) || 
                            routeName.Contains(keyword))
                        {
                            matchCount++;
                            break; // Found match for this style, move to next
                        }
                    }
                }
                else
                {
                    // Direct match attempt for unknown styles
                    if (tripTitle.Contains(userStyle) || 
                        tripDescription.Contains(userStyle) || 
                        routeName.Contains(userStyle))
                    {
                        matchCount++;
                    }
                }
            }

            // Return ratio of matched styles
            if (matchCount > 0)
            {
                return Math.Min(1.0, (double)matchCount / userStyles.Count);
            }

            return 0.3; // Small bonus for no explicit anti-match
        }

        // Activity Level matching: returns 0-1 score
        private double CalculateActivityLevelScore(Trip trip, int userActivityLevel)
        {
            // If user has no preference (level 0 or invalid), return neutral
            if (userActivityLevel <= 0 || userActivityLevel > 5)
            {
                return 0.5;
            }

            // Estimate trip activity level based on duration and description
            int tripActivityLevel = EstimateTripActivityLevel(trip);

            // Calculate difference
            int diff = Math.Abs(tripActivityLevel - userActivityLevel);

            // Score based on how close they are
            // 0 diff = 1.0, 1 diff = 0.8, 2 diff = 0.6, 3 diff = 0.4, 4 diff = 0.2
            double score = Math.Max(0, 1.0 - (diff * 0.2));

            return score;
        }

        private double CalculateGroupSizeScore(Trip trip, string groupSize)
        {
            if (string.IsNullOrEmpty(groupSize) || groupSize.ToLower() == "any" || groupSize.ToLower() == "bet koks")
            {
                return 0.5; 
            }

            var tripTitle = trip.Title?.ToLower() ?? "";
            var tripDescription = trip.Description?.ToLower() ?? "";
            
            // Estimate trip suitability for different group sizes
            var userGroupLower = groupSize.ToLower().Trim();

            // Keywords for different group sizes
            var soloKeywords = new[] { "solo", "vienas", "individualus", "asmeninis", "single" };
            var coupleKeywords = new[] { "pora", "dviese", "romantiškas", "romantic", "couple", "honeymoon" };
            var familyKeywords = new[] { "šeima", "šeimos", "vaikai", "family", "kids", "children", "vaikams" };
            var groupKeywords = new[] { "grupė", "grupės", "draugai", "kompanija", "group", "team", "įmonės", "corporate" };

            bool matchFound = false;

            switch (userGroupLower)
            {
                case "solo":
                case "vienas":
                    matchFound = soloKeywords.Any(k => tripTitle.Contains(k) || tripDescription.Contains(k));
                    // Solo travelers are flexible - if no specific mention, give medium score
                    return matchFound ? 1.0 : 0.6;

                case "pora":
                case "couple":
                    matchFound = coupleKeywords.Any(k => tripTitle.Contains(k) || tripDescription.Contains(k));
                    // Couples are also flexible
                    return matchFound ? 1.0 : 0.6;

                case "šeima":
                case "family":
                    matchFound = familyKeywords.Any(k => tripTitle.Contains(k) || tripDescription.Contains(k));
                    // Family trips need to be suitable
                    return matchFound ? 1.0 : 0.4;

                case "grupė":
                case "group":
                    matchFound = groupKeywords.Any(k => tripTitle.Contains(k) || tripDescription.Contains(k));
                    // Group trips need group-friendly activities
                    return matchFound ? 1.0 : 0.5;

                default:
                    return 0.5; // Unknown preference
            }
        }

        // Estimate activity level of trip - HELPER
        private int EstimateTripActivityLevel(Trip trip)
        {
            int duration = (trip.EndDate - trip.StartDate).Days;
            var title = trip.Title?.ToLower() ?? "";
            var description = trip.Description?.ToLower() ?? "";

            int level = 3; // Default: Vidutinis

            // Keywords for high activity
            var highActivityKeywords = new[] { "nuotykis", "aktyvus", "žygis", "kalnas", "ekstremalus", "adventure", "hiking", "trekking", "sports" };
            // Keywords for low activity
            var lowActivityKeywords = new[] { "atsipalaidavimas", "spa", "poilsis", "ramybė", "kultūra", "muziejus", "relaxation", "leisure", "cultural" };

            if (highActivityKeywords.Any(k => title.Contains(k) || description.Contains(k)))
            {
                level = 5; // Aktyvus
            }
            else if (lowActivityKeywords.Any(k => title.Contains(k) || description.Contains(k)))
            {
                level = 2; // Ramus
            }
            else if (duration <= 3)
            {
                level = 4; 
            }
            else if (duration >= 7)
            {
                level = 2; 
            }

            return level;
        }

        // Availability score: returns 0-1
        private double CalculateAvailabilityScore(int available, int total)
        {
            if (total <= 0) return 0;
            
            double ratio = (double)available / total;
            return ratio; // More available spots = higher score
        }

      
        // REASONS
        
        
        private List<string> GenerateReasons(Trip trip, UserPreferences prefs)
        {
            var reasons = new List<string>();

            // Budget
            if (trip.Price >= prefs.BudgetMin && trip.Price <= prefs.BudgetMax)
            {
                reasons.Add("Atitinka jūsų biudžetą");
            }
            else if (trip.Price < prefs.BudgetMin)
            {
                reasons.Add("Ekonomiška kelionė");
            }

            // Duration
            int duration = (trip.EndDate - trip.StartDate).Days;
            if (duration >= prefs.MinDuration && duration <= prefs.MaxDuration)
            {
                reasons.Add($"Puiki trukmė - {duration} dienų");
            }

            // Dates
            if (prefs.TravelDateStart.HasValue && prefs.TravelDateEnd.HasValue)
            {
                if (trip.StartDate >= prefs.TravelDateStart.Value && 
                    trip.EndDate <= prefs.TravelDateEnd.Value)
                {
                    reasons.Add("Atitinka jūsų kelionės datas");
                }
            }

            // Destination
            if (!string.IsNullOrEmpty(prefs.PreferredDestinations))
            {
                var preferred = prefs.PreferredDestinations.ToLower().Split(',');
                var tripTitle = trip.Title?.ToLower() ?? "";
                var routeName = trip.Route?.Name?.ToLower() ?? "";

                if (preferred.Any(d => tripTitle.Contains(d.Trim()) || routeName.Contains(d.Trim())))
                {
                    reasons.Add("Jūsų pageidaujama kryptis");
                }
            }

            // Travel Style
            if (!string.IsNullOrEmpty(prefs.TravelStyle))
            {
                var userStyles = prefs.TravelStyle.ToLower().Split(',').Select(s => s.Trim()).ToList();
                var tripTitle = trip.Title?.ToLower() ?? "";
                var tripDescription = trip.Description?.ToLower() ?? "";

                foreach (var style in userStyles)
                {
                    if (tripTitle.Contains(style) || tripDescription.Contains(style))
                    {
                        var styleDisplay = char.ToUpper(style[0]) + style.Substring(1);
                        reasons.Add($"Stilius: {styleDisplay}");
                        break;
                    }
                }
            }

            // Activity Level
            int tripActivity = EstimateTripActivityLevel(trip);
            int diff = Math.Abs(tripActivity - prefs.ActivityLevel);
            if (diff <= 1)
            {
                var activityLabels = new[] { "", "Labai ramus", "Ramus", "Vidutinis", "Aktyvus", "Labai aktyvus" };
                if (tripActivity >= 1 && tripActivity <= 5)
                {
                    reasons.Add($"Aktyvumas: {activityLabels[tripActivity]}");
                }
            }

            // Group Size
            if (!string.IsNullOrEmpty(prefs.GroupSize) && prefs.GroupSize.ToLower() != "any")
            {
                var tripTitle = trip.Title?.ToLower() ?? "";
                var tripDescription = trip.Description?.ToLower() ?? "";
                var groupLower = prefs.GroupSize.ToLower();

                bool isMatch = false;
                if (groupLower == "pora" && (tripTitle.Contains("pora") || tripDescription.Contains("romantiškas")))
                {
                    isMatch = true;
                }
                else if (groupLower == "šeima" && (tripTitle.Contains("šeima") || tripDescription.Contains("vaikams")))
                {
                    isMatch = true;
                }
                else if (groupLower == "grupė" && (tripTitle.Contains("grupė") || tripDescription.Contains("kompanija")))
                {
                    isMatch = true;
                }

                if (isMatch)
                {
                    reasons.Add($"Tinka {prefs.GroupSize}");
                }
            }

            // Availability
            if (trip.AvailableSpots > 5)
            {
                reasons.Add("Daug laisvų vietų");
            }
            else if (trip.AvailableSpots > 0 && trip.AvailableSpots <= 3)
            {
                reasons.Add("Tik kelios vietos liko!");
            }

            // Default
            if (reasons.Count == 0)
            {
                reasons.Add("Populiarus pasirinkimas");
            }

            return reasons.Take(4).ToList(); // Max 4 reasons
        }
    }

   
    // DTOs
    

    public class RecommendationDto
    {
        public int TripId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Price { get; set; }
        public int Duration { get; set; }
        public int RouteId { get; set; }
        public string RouteName { get; set; }
        public int AvailableSpots { get; set; }
        public int TotalSpots { get; set; }
        public double Score { get; set; }
        public double MatchPercentage { get; set; }
        public List<string> Reasons { get; set; }
    }

    public class UserPreferencesDto
    {
        public int UserId { get; set; }
        public decimal BudgetMin { get; set; }
        public decimal BudgetMax { get; set; }
        public int MinDuration { get; set; }
        public int MaxDuration { get; set; }
        public DateTime? TravelDateStart { get; set; }
        public DateTime? TravelDateEnd { get; set; }
        public List<string> PreferredDestinations { get; set; }
        public List<string> TravelStyle { get; set; }
        public int ActivityLevel { get; set; }
        public string GroupSize { get; set; }
    }
}