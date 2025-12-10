using backend.Entities;

namespace backend.DTOs;

public class Me
{
    public int Id { get; set; }
    public UserRole Role { get; set; }
    public bool isEmailConfirmed { get; set; } =  false;
}