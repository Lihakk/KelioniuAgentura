namespace backend.DTOs;

public class MarkPaidDto
{
    public int ReservationId { get; set; }
    public string? PaymentIntentId { get; set; }
}