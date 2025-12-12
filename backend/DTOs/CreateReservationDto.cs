using backend.Entities;

namespace backend.DTOs;

public class CreateReservationDto
{
    public int TripId { get; set; }
    public List<CreateTravelerDto> Travelers { get; set; } = new List<CreateTravelerDto>();
}