using System.Collections.Generic;

namespace backend.Entities
{
    public enum UserRole
    {
        Administrator,
        Client,
        Employee
    }

    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public UserRole Role { get; set; }
        
        public string? Code {get; set;}
        
        public bool IsConfirmed {get; set;} = false;

        public List<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}