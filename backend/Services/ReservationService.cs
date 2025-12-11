using backend.Data;
using backend.DTOs;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Interfaces.Results;

public class ReservationService : IReservationService
{
    AppDbContext _context;

    public ReservationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ReservationDto>> GetAllReservationsAsync(CancellationToken cancellationToken)
    {
        var reservations = await _context.Reservations
            .Include(r => r.Payment)
            .Include(r => r.Travelers)
            .Select(r => new ReservationDto
        {
            Id = r.Id,
            Date = r.Date,
            UserId = r.UserId,
            TripId = r.TripId,
            Payment = new PaymentDto
            {
                Id = r.Payment.Id,
                Amount = r.Payment.Amount,
                Currency = r.Payment.Currency,
                Method = r.Payment.Method,
                Status = r.Payment.Status,
                Date = r.Payment.Date,
                ReservationId = r.Payment.ReservationId,
            },
            Status = r.Status,
            TotalAmount = r.TotalAmount,
            Travelers = r.Travelers.Select(t => new TravelerDto
            {
                Id = t.Id,
                FirstName = t.FirstName,
                LastName = t.LastName,
                DocumentNumber = t.DocumentNumber,
                BirthDate = t.BirthDate,
                ReservationId = t.ReservationId,
            }).ToList(),
            
        }).ToListAsync(cancellationToken);

        if (reservations == null)
        {
            throw new Exception("cannot find any reservations");
        }
        
        return reservations;
    }

    public async Task<List<ReservationDto>> GetAllReservationsByUserIdAsync(int userId)
    {
        return null;
    }

    public async Task<List<ReservationDto>> GetAllReservationsByReservationId(int reservationId)
    {
        return null;
    }

    public async Task CreateReservation(CreateReservationDto reservationDetails, int userId, CancellationToken cancellationToken)
    {
        var travelers = new List<Traveler>();

        foreach (var traveler in reservationDetails.Travelers)
        {
            travelers.Add(new Traveler
            {
                FirstName = traveler.FirstName,
                LastName = traveler.LastName,
                DocumentNumber = traveler.DocumentNumber,
                BirthDate = traveler.BirthDate,
            });
        }
        
        var reservation = new Reservation
        {
            Date = DateTime.Now,
            TotalAmount = reservationDetails.TotalAmount,
            Status = ReservationStatus.Created,
            UserId = userId, 
            TripId = reservationDetails.TripId,
            Payment = new Payment
            {
                Amount = reservationDetails.TotalAmount,
                Currency = "$",
                Date = reservationDetails.Date,
                Method = "",
                Status = PaymentStatus.Unpaid,
            },
            Travelers = travelers,
        };

        if (reservation is null)
        {
            throw new Exception("cannot create reservation");
        }
        
        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<ReservationDto>> UpdateReservation(ReservationDto reservation)
    {
        return null;
    }

    public async Task DeleteReservation(int reservationId)
    {
        
    }
    
}