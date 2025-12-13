using backend.Services.Results;

namespace backend.Services.Interfaces
{
    public interface IGoogleMapsService
    {
        Task<CoordinatesResult?> GetCoordinatesAsync(string cityName);

        Task<GeneratedTripPlan?> GenerateComplexTripAsync(string from, string to, int stopIntervalKm);

        Task<GeneratedTripPlan?> RecalculatePathAsync(CoordinatesResult origin, CoordinatesResult destination, List<CoordinatesResult> waypoints);
    
        Task<GeneratedTripPlan?> GetSimpleRouteAsync(string from, string to);
    }
}