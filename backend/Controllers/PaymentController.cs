using backend.Data;
using backend.DTOs;
using backend.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private AppDbContext _context;
    private readonly IConfiguration _config;

    public PaymentController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("create-intent")]
    public async Task<IActionResult> CreatePaymentIntent(CreatePaymentIntentDto dto)
    {
        var reservation = await _context.Reservations
            .Include(r => r.Payment)
            .FirstOrDefaultAsync(r => r.Id == dto.ReservationId);

        if (reservation == null)
            return NotFound();

        var intent = await new PaymentIntentService().CreateAsync(
            new PaymentIntentCreateOptions
            {
                Amount = (long)(reservation.Payment.Amount * 100),
                Currency = reservation.Payment.Currency,
                AutomaticPaymentMethods = new() { Enabled = true },
                Metadata = new Dictionary<string, string>
                {
                    { "reservationId", reservation.Id.ToString() }
                }
            });

        reservation.Payment.StripePaymentIntentId = intent.Id;
        await _context.SaveChangesAsync();

        return Ok(new { clientSecret = intent.ClientSecret });
    }
    [HttpPost("mark-paid")]
    public async Task<IActionResult> MarkPaid([FromBody] MarkPaidDto dto)
    {
        var reservation = await _context.Reservations
            .Include(r => r.Payment)
            .FirstOrDefaultAsync(r => r.Id == dto.ReservationId);

        if (reservation == null)
            return NotFound();

        reservation.Payment.Status = PaymentStatus.Paid;
        reservation.Payment.StripePaymentIntentId =
            dto.PaymentIntentId ?? reservation.Payment.StripePaymentIntentId;

        reservation.Status = ReservationStatus.Confirmed;

        await _context.SaveChangesAsync();
        return Ok();
    }
}