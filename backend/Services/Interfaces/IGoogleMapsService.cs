using backend.Services.Results;

namespace backend.Services.Interfaces
{
    public interface IGoogleMapsService
    {
        Task<CoordinatesResult?> GetCoordinatesAsync(string cityName);

        Task<GeneratedTripPlan?> GenerateComplexTripAsync(string from, string to, int stopIntervalKm);
    }
}