using backend.Entities;

namespace backend.DTOs;

public class CreateReservationDto
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public decimal TotalAmount { get; set; }
    public ReservationStatus Status { get; set; }
    
    // this part should use tripDto object
    public int TripId { get; set; }
    public List<TravelerDto> Travelers { get; set; } = new List<TravelerDto>();
}