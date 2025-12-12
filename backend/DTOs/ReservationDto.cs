using backend.Entities;

namespace backend.DTOs;

public class ReservationDto
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public decimal TotalAmount { get; set; }
    public ReservationStatus Status { get; set; }
    
    public int UserId { get; set; }
    // this part should use tripDto object
    public ReservationTripDto ReservationTrip { get; set; }

    public PaymentDto Payment { get; set; }
    public List<TravelerDto> Travelers { get; set; } = new List<TravelerDto>();
}