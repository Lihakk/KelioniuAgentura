using backend.Entities;

namespace backend.DTOs;

public class UpdateReservationDto
{
    public ReservationStatus Status { get; set; }
    public int Id { get; set; }
    public PaymentDto Payment { get; set; }
}