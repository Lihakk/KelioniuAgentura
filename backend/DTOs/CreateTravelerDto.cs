namespace backend.DTOs;

public class CreateTravelerDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime BirthDate { get; set; }
    public string DocumentNumber { get; set; }
    
    public int ReservationId { get; set; }
}