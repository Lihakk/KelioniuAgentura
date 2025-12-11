using backend.Entities;

namespace backend.DTOs;

public class PaymentDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string Method { get; set; }
    public string Currency { get; set; }
    public PaymentStatus Status { get; set; }

    public int ReservationId { get; set; }
}