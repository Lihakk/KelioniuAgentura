using System.Text.Json.Nodes;
using backend.Services.Interfaces;
using backend.Services.Results;

namespace backend.Services
{
    public class GoogleMapsService : IGoogleMapsService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public GoogleMapsService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["GoogleMaps:ApiKey"];
        }

        public async Task<CoordinatesResult?> GetCoordinatesAsync(string cityName)
        {
            var url = $"https://maps.googleapis.com/maps/api/geocode/json?address={cityName}&key={_apiKey}";
            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode) return null;

            var json = JsonNode.Parse(await response.Content.ReadAsStringAsync());
            if (json?["status"]?.ToString() != "OK") return null;

            var loc = json["results"]?[0]?["geometry"]?["location"];
            return new CoordinatesResult { Latitude = (double)loc["lat"]!, Longitude = (double)loc["lng"]! };
        }

        public async Task<GeneratedTripPlan?> GenerateComplexTripAsync(string from, string to, int stopIntervalKm)
        {
            //  Get Coordinates
            var origin = await GetCoordinatesAsync(from);
            var destination = await GetCoordinatesAsync(to);
            if (origin == null || destination == null) return null;

            //  Get Path
            var url = $"https://maps.googleapis.com/maps/api/directions/json?origin={origin.Latitude},{origin.Longitude}&destination={destination.Latitude},{destination.Longitude}&key={_apiKey}";
            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode) return null;

            var json = JsonNode.Parse(await response.Content.ReadAsStringAsync());
            var route = json?["routes"]?[0];
            if (route == null) return null;

            var encodedPolyline = route["overview_polyline"]?["points"]?.ToString();
            var leg = route["legs"]?[0];

            var plan = new GeneratedTripPlan
            {
                EncodedPolyline = encodedPolyline,
                TotalDistance = leg?["distance"]?["text"]?.ToString(),
                TotalDuration = leg?["duration"]?["text"]?.ToString()
            };

            //  Find Stops along the path
            var pathPoints = DecodePolyline(encodedPolyline);
            double currentSegmentDistance = 0;

            // Start loop from index 0
            for (int i = 0; i < pathPoints.Count - 1; i++)
            {
                var p1 = pathPoints[i];
                var p2 = pathPoints[i+1];
                
                // Add distance of this tiny step
                currentSegmentDistance += CalculateHaversineDistance(p1, p2);

                // If we exceeded the interval (e.g. 300km), mark a stop
                if (currentSegmentDistance >= stopIntervalKm)
                {
                    // Find city name
                    var cityName = await GetCityNameFromCoords(p2) ?? "Stopover Point";
                    
                    // Find attractions
                    var attractions = await GetTopAttractions(p2);

                    plan.SuggestedStops.Add(new TripStop
                    {
                        CityName = cityName,
                        Location = p2,
                        DistanceFromStartKm = stopIntervalKm, // Approximation
                        SuggestedAttractions = attractions
                    });

                    currentSegmentDistance = 0; // Reset counter
                }
            }

            return plan;
        }

        // --- Helper Methods ---

        private async Task<List<PlaceResult>> GetTopAttractions(CoordinatesResult location)
        {
            var places = new List<PlaceResult>();
            // Search for Tourist Attractions within 5km of the point
            var url = $"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location.Latitude},{location.Longitude}&radius=5000&type=tourist_attraction&key={_apiKey}";
            
            try 
            {
                var response = await _httpClient.GetAsync(url);
                if (response.IsSuccessStatusCode)
                {
                    var json = JsonNode.Parse(await response.Content.ReadAsStringAsync());
                    var results = json?["results"]?.AsArray();

                    if (results != null)
                    {
                        // Take top 3 results
                        foreach (var place in results.Take(3))
                        {
                            places.Add(new PlaceResult
                            {
                                Name = place["name"]?.ToString(),
                                Rating = (double?)place["rating"] ?? 0,
                                Address = place["vicinity"]?.ToString(),
                                Latitude = (double)place["geometry"]?["location"]?["lat"]!,
                                Longitude = (double)place["geometry"]?["location"]?["lng"]!
                            });
                        }
                    }
                }
            }
            catch 
            {
                // If Google fails, just return empty list so app doesn't crash
            }
            return places;
        }

    private async Task<string?> GetCityNameFromCoords(CoordinatesResult coords)
    {
        var url = $"https://maps.googleapis.com/maps/api/geocode/json?latlng={coords.Latitude},{coords.Longitude}&result_type=locality&key={_apiKey}";
        var response = await _httpClient.GetAsync(url);
        
        if (!response.IsSuccessStatusCode) return "Unknown Location";

        var json = JsonNode.Parse(await response.Content.ReadAsStringAsync());
        
        // SAFE CHECK: Check if "results" exists and has at least one item
        var results = json?["results"]?.AsArray();
        if (results == null || results.Count == 0)
        {
            return "Wilderness Stop"; // Return a default name instead of crashing
        }

        // Now it is safe to access [0]
        return results[0]?["address_components"]?[0]?["long_name"]?.ToString() ?? "Unknown City";
    }

        private double CalculateHaversineDistance(CoordinatesResult p1, CoordinatesResult p2)
        {
            var R = 6371; // Earth radius in km
            var dLat = (p2.Latitude - p1.Latitude) * (Math.PI / 180);
            var dLon = (p2.Longitude - p1.Longitude) * (Math.PI / 180);
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(p1.Latitude * (Math.PI / 180)) * Math.Cos(p2.Latitude * (Math.PI / 180)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        private List<CoordinatesResult> DecodePolyline(string encodedPoints)
        {
            if (string.IsNullOrEmpty(encodedPoints)) return new List<CoordinatesResult>();
            var poly = new List<CoordinatesResult>();
            char[] polylinechars = encodedPoints.ToCharArray();
            int index = 0, currentLat = 0, currentLng = 0;

            while (index < polylinechars.Length)
            {
                int sum = 0, shifter = 0, next5bits;
                do {
                    next5bits = polylinechars[index++] - 63;
                    sum |= (next5bits & 31) << shifter;
                    shifter += 5;
                } while (next5bits >= 32);
                currentLat += (sum & 1) == 1 ? ~(sum >> 1) : (sum >> 1);

                sum = 0; shifter = 0;
                do {
                    next5bits = polylinechars[index++] - 63;
                    sum |= (next5bits & 31) << shifter;
                    shifter += 5;
                } while (next5bits >= 32);
                currentLng += (sum & 1) == 1 ? ~(sum >> 1) : (sum >> 1);

                poly.Add(new CoordinatesResult
                {
                    Latitude = (double)currentLat / 100000.0,
                    Longitude = (double)currentLng / 100000.0
                });
            }
            return poly;
        }
    }
}