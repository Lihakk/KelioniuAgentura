using backend.DTOs;

namespace backend.Services.Interfaces;

public interface IReservationService
{
    Task<List<ReservationDto>> GetAllReservationsAsync(CancellationToken cancellationToken);
    Task CreateReservation(CreateReservationDto reservationDetails, int userId, CancellationToken cancellationToken);
    Task<ReservationDto> GetReservationById(int reservationId, CancellationToken cancellationToken);

    Task UpdateReservation(UpdateReservationDto updateReservation,
        CancellationToken cancellationToken);
    Task AddTraveler(CreateTravelerDto traveler, CancellationToken cancellationToken);
    Task RemoveTraveler(int travelerId, CancellationToken cancellationToken);
    Task DeleteReservation(int reservationId, CancellationToken cancellationToken);
    Task<List<ReservationDto>> GetAllReservationsByUserIdAsync(int userId, CancellationToken cancellationToken);

}