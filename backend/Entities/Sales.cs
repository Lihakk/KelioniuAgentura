using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public enum ReservationStatus { Created, Cancelled, Confirmed }
    public enum PaymentStatus { Paid, Pending, Unpaid, Refunded }

    public class Reservation
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public decimal TotalAmount { get; set; }
        public ReservationStatus Status { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int TripId { get; set; }
        public Trip Trip { get; set; }

        public Payment Payment { get; set; }
        public List<Traveler> Travelers { get; set; } = new List<Traveler>();
    }

    public class Traveler
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public string DocumentNumber { get; set; }

        public int ReservationId { get; set; }
        public Reservation Reservation { get; set; }
    }

    public class Payment
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime? Date { get; set; }
        public string Method { get; set; } 
        public string Currency { get; set; } 
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        
        public string? StripePaymentIntentId { get; set; } = null!;

        public int ReservationId { get; set; }
        public Reservation Reservation { get; set; }
    }
}