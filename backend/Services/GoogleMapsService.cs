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
            stopIntervalKm = 100;

            var origin = await GetCoordinatesAsync(from);
            var destination = await GetCoordinatesAsync(to);
            if (origin == null || destination == null) return null;

            var initialRoute = await GetRouteInternal(origin, destination, null);
            if (initialRoute == null) return null;

            var foundWaypoints = new List<TripStop>();
            var pathPoints = DecodePolyline(initialRoute.EncodedPolyline);
            double currentSegmentDistance = 0;

            for (int i = 0; i < pathPoints.Count - 1; i++)
            {
                currentSegmentDistance += CalculateHaversineDistance(pathPoints[i], pathPoints[i+1]);
                
                if (currentSegmentDistance >= stopIntervalKm)
                {
                    var scenicStop = await FindScenicStop(pathPoints[i+1]);
                    
                    if (scenicStop != null)
                    {
                        // Avoid adding the same place twice
                        if (!foundWaypoints.Any(w => w.CityName == scenicStop.CityName))
                        {
                            foundWaypoints.Add(scenicStop);
                        }
                    }
                    currentSegmentDistance = 0; // Reset counter
                }
            }

            var finalWaypoints = foundWaypoints.Select(w => w.Location).ToList();
            var finalRoute = await GetRouteInternal(origin, destination, finalWaypoints);
            
            foreach (var stop in foundWaypoints)
            {
                var nearby = await GetTopAttractions(stop.Location, 20);
                stop.SuggestedAttractions = nearby;
            }

            return new GeneratedTripPlan
            {
                EncodedPolyline = finalRoute?.EncodedPolyline ?? initialRoute.EncodedPolyline,
                TotalDistance = finalRoute?.TotalDistance ?? initialRoute.TotalDistance,
                TotalDuration = finalRoute?.TotalDuration ?? initialRoute.TotalDuration,
                SuggestedStops = foundWaypoints
            };
        }

        private async Task<TripStop?> FindScenicStop(CoordinatesResult location)
        {
            var attractionUrl = $"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location.Latitude},{location.Longitude}&radius=20000&type=tourist_attraction&rankby=prominence&key={_apiKey}";
            
            try 
            {
                var response = await _httpClient.GetAsync(attractionUrl);
                var json = JsonNode.Parse(await response.Content.ReadAsStringAsync());
                var results = json?["results"]?.AsArray();

                if (results != null && results.Count > 0)
                {
                    var best = results[0];
                    var lat = (double)best["geometry"]?["location"]?["lat"]!;
                    var lng = (double)best["geometry"]?["location"]?["lng"]!;
                    var name = best["name"]?.ToString();
                    
                    var vicinity = best["vicinity"]?.ToString() ?? best["plus_code"]?["compound_code"]?.ToString();
                    var dbCityName = string.IsNullOrEmpty(vicinity) ? name : vicinity.Split(',').Last().Trim(); 

                    return new TripStop
                    {
                        CityName = dbCityName ?? name,
                        Country = await GetCountryName(lat, lng) ?? "Unknown",
                        Location = new CoordinatesResult { Latitude = lat, Longitude = lng },
                        DistanceFromStartKm = 0
                    };
                }
            } catch {}

            // If no attraction, find the nearest Town/City (Radius 50km)
            // This ensures we don't have empty gaps in the route.
            return await FindProminentCityNearby(location);
        }

        private async Task<TripStop?> FindProminentCityNearby(CoordinatesResult location)
        {
            var url = $"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location.Latitude},{location.Longitude}&radius=50000&type=locality&key={_apiKey}";
            try 
            {
                var response = await _httpClient.GetAsync(url);
                var json = JsonNode.Parse(await response.Content.ReadAsStringAsync());
                var results = json?["results"]?.AsArray();

                if (results != null && results.Count > 0)
                {
                    var bestCity = results[0]; 
                    var lat = (double)bestCity["geometry"]?["location"]?["lat"]!;
                    var lng = (double)bestCity["geometry"]?["location"]?["lng"]!;
                    
                    return new TripStop
                    {
                        CityName = bestCity["name"]?.ToString(),
                        Country = await GetCountryName(lat, lng) ?? "Unknown",
                        Location = new CoordinatesResult { Latitude = lat, Longitude = lng },
                        DistanceFromStartKm = 0
                    };
                }
            } catch {}
            return null;
        }

        private async Task<string?> GetCountryName(double lat, double lng)
        {
             var url = $"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&result_type=country&key={_apiKey}";
             var response = await _httpClient.GetAsync(url);
             var json = JsonNode.Parse(await response.Content.ReadAsStringAsync());
             return json?["results"]?[0]?["address_components"]?[0]?["long_name"]?.ToString();
        }

        private async Task<List<PlaceResult>> GetTopAttractions(CoordinatesResult location, int limit)
        {
            var places = new List<PlaceResult>();
            var url = $"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location.Latitude},{location.Longitude}&radius=10000&type=tourist_attraction&key={_apiKey}"; // Increased radius to 10km for pool
            try {
                var response = await _httpClient.GetAsync(url);
                if (response.IsSuccessStatusCode) {
                    var json = JsonNode.Parse(await response.Content.ReadAsStringAsync());
                    var results = json?["results"]?.AsArray();
                    if (results != null) {
                        foreach (var place in results.Take(limit)) {
                            places.Add(new PlaceResult {
                                Name = place["name"]?.ToString(),
                                Rating = (double?)place["rating"] ?? 0,
                                Address = place["vicinity"]?.ToString(),
                                Latitude = (double)place["geometry"]?["location"]?["lat"]!,
                                Longitude = (double)place["geometry"]?["location"]?["lng"]!
                            });
                        }
                    }
                }
            } catch {}
            return places;
        }

        private async Task<GeneratedTripPlan?> GetRouteInternal(CoordinatesResult origin, CoordinatesResult destination, List<CoordinatesResult>? waypoints)
        {
            var originStr = $"{origin.Latitude},{origin.Longitude}";
            var destStr = $"{destination.Latitude},{destination.Longitude}";
            var waypointsStr = "";
            
            if (waypoints != null && waypoints.Any())
            {
                waypointsStr = "&waypoints=optimize:true|" + string.Join("|", waypoints.Select(w => $"{w.Latitude},{w.Longitude}"));
            }

            var url = $"https://maps.googleapis.com/maps/api/directions/json?origin={originStr}&destination={destStr}{waypointsStr}&key={_apiKey}";
            var response = await _httpClient.GetAsync(url);
            
            if (!response.IsSuccessStatusCode) return null;

            var jsonStr = await response.Content.ReadAsStringAsync();
            var json = JsonNode.Parse(jsonStr);

            var routesArray = json?["routes"]?.AsArray();
            if (routesArray == null || routesArray.Count == 0)
            {
                Console.WriteLine($"Google Maps Error: {json?["status"]}");
                return null; 
            }

            var route = routesArray[0];

            long totalSeconds = 0;
            long totalMeters = 0;
            var legs = route?["legs"]?.AsArray();
            
            if(legs != null) {
                foreach(var leg in legs) {
                    totalMeters += (long)(leg["distance"]?["value"] ?? 0);
                    totalSeconds += (long)(leg["duration"]?["value"] ?? 0);
                }
            }

            return new GeneratedTripPlan
            {
                EncodedPolyline = route?["overview_polyline"]?["points"]?.ToString(),
                TotalDistance = $"{totalMeters/1000} km",
                TotalDuration = $"{totalSeconds/3600}h {(totalSeconds%3600)/60}m",
                SuggestedStops = new List<TripStop>()
            };
        }

        private double CalculateHaversineDistance(CoordinatesResult p1, CoordinatesResult p2)
        {
            var R = 6371; 
            var dLat = (p2.Latitude - p1.Latitude) * (Math.PI / 180);
            var dLon = (p2.Longitude - p1.Longitude) * (Math.PI / 180);
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) + Math.Cos(p1.Latitude * (Math.PI / 180)) * Math.Cos(p2.Latitude * (Math.PI / 180)) * Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        private List<CoordinatesResult> DecodePolyline(string encodedPoints)
        {
            if (string.IsNullOrEmpty(encodedPoints)) return new List<CoordinatesResult>();
            var poly = new List<CoordinatesResult>();
            char[] polylinechars = encodedPoints.ToCharArray();
            int index = 0, currentLat = 0, currentLng = 0;
            while (index < polylinechars.Length) {
                int sum = 0, shifter = 0, next5bits;
                do { next5bits = polylinechars[index++] - 63; sum |= (next5bits & 31) << shifter; shifter += 5; } while (next5bits >= 32);
                currentLat += (sum & 1) == 1 ? ~(sum >> 1) : (sum >> 1);
                sum = 0; shifter = 0;
                do { next5bits = polylinechars[index++] - 63; sum |= (next5bits & 31) << shifter; shifter += 5; } while (next5bits >= 32);
                currentLng += (sum & 1) == 1 ? ~(sum >> 1) : (sum >> 1);
                poly.Add(new CoordinatesResult { Latitude = (double)currentLat / 100000.0, Longitude = (double)currentLng / 100000.0 });
            }
            return poly;
        }
        public async Task<GeneratedTripPlan?> RecalculatePathAsync(CoordinatesResult origin, CoordinatesResult destination, List<CoordinatesResult> waypoints)
        {
            // Reuse the internal logic 
            return await GetRouteInternal(origin, destination, waypoints);
        }

        public async Task<GeneratedTripPlan?> GetSimpleRouteAsync(string from, string to)
    {
        var origin = await GetCoordinatesAsync(from);
        var destination = await GetCoordinatesAsync(to);
        if (origin == null || destination == null) return null;

        return await GetRouteInternal(origin, destination, null);
    }
    }
}