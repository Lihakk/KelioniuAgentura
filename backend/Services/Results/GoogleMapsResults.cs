using System.Collections.Generic;

namespace backend.Services.Results
{
    public class CoordinatesResult
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public class PlaceResult
    {
        public string Name { get; set; }
        public double Rating { get; set; }
        public string Address { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public class GeneratedTripPlan
    {
        public string TotalDistance { get; set; }
        public string TotalDuration { get; set; }
        public string EncodedPolyline { get; set; }
        public List<TripStop> SuggestedStops { get; set; } = new List<TripStop>();
    }

    public class TripStop
    {
        public string CityName { get; set; }
        public CoordinatesResult Location { get; set; }
        public double DistanceFromStartKm { get; set; }
        public List<PlaceResult> SuggestedAttractions { get; set; } = new List<PlaceResult>();
    }
}