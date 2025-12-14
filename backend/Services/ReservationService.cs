using backend.Data;
using backend.DTOs;
using backend.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

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
            .Include(r => r.Trip)
            .Select(r => new ReservationDto
        {
            Id = r.Id,
            Date = r.Date,
            UserId = r.UserId,
            ReservationTrip = new ReservationTripDto
            {
                Id = r.Trip.Id,
                Title = r.Trip.Title,
                Description = r.Trip.Description,
                StartDate = r.Trip.StartDate,
                EndDate = r.Trip.EndDate,
                Price = r.Trip.Price,
            },
            Payment = new PaymentDto
            {
                Id = r.Payment.Id,
                Amount = r.Payment.Amount,
                Currency = r.Payment.Currency,
                Method = r.Payment.Method,
                Status = r.Payment.Status,
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
        
        
        return reservations;
    }

    public async Task<List<ReservationDto>> GetAllReservationsByUserIdAsync(int userId)
    {
        var reservations = await _context.Reservations
            .Where(r => r.UserId == userId)
            .Include(r => r.Payment)
            .Include(r => r.Travelers)
            .Include(r => r.Trip)
            .Select(r => new ReservationDto
            {
                Id = r.Id,
                Date = r.Date,
                UserId = r.UserId,
                ReservationTrip = new ReservationTripDto
                {
                    Id = r.Trip.Id,
                    Title = r.Trip.Title,
                    Description = r.Trip.Description,
                    StartDate = r.Trip.StartDate,
                    EndDate = r.Trip.EndDate,
                    Price = r.Trip.Price,
                },
                Payment = new PaymentDto
                {
                    Id = r.Payment.Id,
                    Amount = r.Payment.Amount,
                    Currency = r.Payment.Currency,
                    Method = r.Payment.Method,
                    Status = r.Payment.Status,
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

            }).ToListAsync();

        return reservations;
    }

    public async Task<ReservationDto> GetReservationById(int reservationId , CancellationToken cancellationToken)
    {
        var reservations = await _context.Reservations
            .Where(r => r.Id == reservationId)
            .Include(r => r.Payment)
            .Include(r => r.Travelers)
            .Include(r => r.Trip)
            .Select(r => new ReservationDto
            {
                Id = r.Id,
                Date = r.Date,
                UserId = r.UserId,
                ReservationTrip = new ReservationTripDto
                {
                    Id = r.Trip.Id,
                    Title = r.Trip.Title,
                    Description = r.Trip.Description,
                    StartDate = r.Trip.StartDate,
                    EndDate = r.Trip.EndDate,
                    Price = r.Trip.Price,
                },
                Payment = new PaymentDto
                {
                    Id = r.Payment.Id,
                    Amount = r.Payment.Amount,
                    Currency = r.Payment.Currency,
                    Method = r.Payment.Method,
                    Status = r.Payment.Status,
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

            }).FirstAsync(cancellationToken);

        return reservations;
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
        var tripPrice = await _context.Trips
            .Where(t => t.Id == reservationDetails.TripId)
            .Select(t => t.Price)
            .FirstAsync(cancellationToken);
        
        if (tripPrice == default)
        {
            throw new Exception($"Trip with id {reservationDetails.TripId} does not exist.");
        }

        var travelerCount = reservationDetails.Travelers.Count;
        var totalAmount = tripPrice * travelerCount;
        
        var reservation = new Reservation
        {
            Date = DateTime.Now,
            TotalAmount = totalAmount,
            Status = ReservationStatus.Created,
            UserId = userId, 
            TripId = reservationDetails.TripId,
            Payment = new Payment
            {
                Amount = totalAmount,
                Currency = "eur",
                Method = "card",
                Status = PaymentStatus.Pending,
            },
            Travelers = travelers,
        };
        
        
        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateReservation(UpdateReservationDto updateReservation, CancellationToken cancellationToken)
    {
        var reservation = await _context.Reservations.Include(r => r.Travelers)
            .Include(r => r.Payment)
            .Include(r => r.Trip)
            .FirstOrDefaultAsync(r => r.Id == updateReservation.Id, cancellationToken);

        if (reservation is null)
        {
            throw new Exception($"Reservation with id {updateReservation.Id} does not exist.");
        }
        
        reservation.Status = updateReservation.Status;
        reservation.Payment.Status = updateReservation.Payment.Status;
         
        await _context.SaveChangesAsync(cancellationToken);
        
    }

    public async Task AddTraveler(CreateTravelerDto traveler, CancellationToken cancellationToken)
    {
        var reservationExists = await _context.Reservations
            .AnyAsync(r => r.Id == traveler.ReservationId, cancellationToken);

        if (!reservationExists)
            throw new KeyNotFoundException("Reservation not found.");

        var newTraveler = new Traveler
        {
            FirstName = traveler.FirstName,
            LastName = traveler.LastName,
            BirthDate = traveler.BirthDate,
            DocumentNumber = traveler.DocumentNumber,
            ReservationId = traveler.ReservationId,
        };

        _context.Travelers.Add(newTraveler);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveTraveler(int travelerId, CancellationToken cancellationToken)
    {
        var traveler = await _context.Travelers.FirstOrDefaultAsync(tr => tr.Id == travelerId, cancellationToken);

        if (traveler is null)
        {
            throw new Exception($"Traveler with id {travelerId} does not exist.");
        }
        _context.Travelers.Remove(traveler);
        await _context.SaveChangesAsync(cancellationToken);
    }
}