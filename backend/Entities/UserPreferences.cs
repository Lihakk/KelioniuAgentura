using System;

namespace backend.Entities
{
    public class UserPreferences
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        
        // Budget
        public decimal BudgetMin { get; set; }
        public decimal BudgetMax { get; set; }
        
        // Duration preferences (days)
        public int MinDuration { get; set; } = 1;
        public int MaxDuration { get; set; } = 30;
        
        // Travel dates
        public DateTime? TravelDateStart { get; set; }
        public DateTime? TravelDateEnd { get; set; }
        
        // Preferred destinations (comma-separated)
        public string PreferredDestinations { get; set; } = string.Empty; // "greece,italy,spain"
        
        // Travel style (comma-separated)
        public string TravelStyle { get; set; } = string.Empty; // "adventure,relaxation,cultural"
        
        // Group size preference
        public string GroupSize { get; set; } = "any"; // "solo", "couple", "family", "group", "any"
        
        // Activity level (1-5)
        public int ActivityLevel { get; set; } = 3;
        
        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation
        public User User { get; set; }
    }
}