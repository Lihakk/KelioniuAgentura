using backend.DTOs;

namespace backend.Services.Interfaces;

public interface IReservationService
{
    Task<List<ReservationDto>> GetAllReservationsAsync(CancellationToken cancellationToken);
    Task CreateReservation(CreateReservationDto reservationDetails, int userId, CancellationToken cancellationToken);
}