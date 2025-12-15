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

    public async Task<List<ReservationDto>> GetAllReservationsByUserIdAsync(int userId, CancellationToken cancellationToken)
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

            }).ToListAsync(cancellationToken);

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
        var trip = await _context.Trips
            .FirstOrDefaultAsync(t => t.Id == reservationDetails.TripId, cancellationToken);

        if (trip == null)
            throw new Exception("Kelionė nerasta");

        var travelerCount = reservationDetails.Travelers.Count;

        if (trip.AvailableSpots < travelerCount)
            throw new Exception("Nepakanka laisvų vietų šiai kelionei");

        var travelers = reservationDetails.Travelers.Select(t => new Traveler
        {
            FirstName = t.FirstName,
            LastName = t.LastName,
            DocumentNumber = t.DocumentNumber,
            BirthDate = t.BirthDate,
        }).ToList();

        var totalAmount = trip.Price * travelerCount;

        var reservation = new Reservation
        {
            Date = DateTime.Now,
            TotalAmount = totalAmount,
            Status = ReservationStatus.Created,
            UserId = userId,
            TripId = trip.Id,
            Payment = new Payment
            {
                Amount = totalAmount,
                Currency = "eur",
                Method = "card",
                Status = PaymentStatus.Pending,
            },
            Travelers = travelers,
        };

        trip.AvailableSpots -= travelerCount;

        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateReservation(UpdateReservationDto updateReservation, CancellationToken cancellationToken)
    {
        var reservation = await _context.Reservations
            .Include(r => r.Travelers)
            .Include(r => r.Payment)
            .Include(r => r.Trip)
            .FirstOrDefaultAsync(r => r.Id == updateReservation.Id, cancellationToken);

        if (reservation == null)
            throw new Exception("Rezervacija nerasta");

        var travelerCount = reservation.Travelers.Count;

        reservation.TotalAmount = reservation.Trip.Price * travelerCount;
        reservation.Payment.Amount = reservation.TotalAmount;

        reservation.Status = updateReservation.Status;
        reservation.Payment.Status = updateReservation.Payment.Status;

        await _context.SaveChangesAsync(cancellationToken);
    }


    public async Task AddTraveler(CreateTravelerDto traveler, CancellationToken cancellationToken)
    {
        var reservation = await _context.Reservations
            .Include(r => r.Travelers)
            .Include(r => r.Trip)
            .Include(r => r.Payment)
            .FirstOrDefaultAsync(r => r.Id == traveler.ReservationId, cancellationToken);

        if (reservation == null)
            throw new Exception("Rezervacija nerasta");

        if (reservation.Trip.AvailableSpots < 1)
            throw new Exception("Nepakanka laisvų vietų");

        reservation.Trip.AvailableSpots -= 1;

        reservation.Travelers.Add(new Traveler
        {
            FirstName = traveler.FirstName,
            LastName = traveler.LastName,
            BirthDate = traveler.BirthDate,
            DocumentNumber = traveler.DocumentNumber
        });

        reservation.TotalAmount = reservation.Trip.Price * reservation.Travelers.Count;
        reservation.Payment.Amount = reservation.TotalAmount;

        await _context.SaveChangesAsync(cancellationToken);
    }


    public async Task RemoveTraveler(int travelerId, CancellationToken cancellationToken)
    {
        var traveler = await _context.Travelers
            .Include(t => t.Reservation)
            .ThenInclude(r => r.Trip)
            .Include(t => t.Reservation)
            .ThenInclude(r => r.Payment)
            .FirstOrDefaultAsync(t => t.Id == travelerId, cancellationToken);

        if (traveler == null)
            throw new Exception("Keliautojas nerastas");

        traveler.Reservation.Trip.AvailableSpots += 1;

        _context.Travelers.Remove(traveler);

        var reservation = traveler.Reservation;
        reservation.TotalAmount = reservation.Trip.Price * (reservation.Travelers.Count - 1);
        reservation.Payment.Amount = reservation.TotalAmount;

        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task RecalculateReservationPrice(int reservationId, CancellationToken cancellationToken)
    {
        var reservation = await _context.Reservations
            .Include(r => r.Travelers)
            .Include(r => r.Payment)
            .Include(r => r.Trip)
            .FirstAsync(r => r.Id == reservationId, cancellationToken);

        var travelerCount = reservation.Travelers.Count;
        var tripPrice = reservation.Trip.Price;

        var newTotal = travelerCount * tripPrice;

        reservation.TotalAmount = newTotal;
        reservation.Payment.Amount = newTotal;

        await _context.SaveChangesAsync(cancellationToken);
    }
    public async Task DeleteReservation(int reservationId, CancellationToken cancellationToken)
    {
        var reservation = await _context.Reservations
            .Include(r => r.Travelers)
            .Include(r => r.Trip)
            .FirstOrDefaultAsync(r => r.Id == reservationId, cancellationToken);

        if (reservation == null)
            throw new Exception("Rezervacija nerasta");

        var travelerCount = reservation.Travelers.Count;
        reservation.Trip.AvailableSpots += travelerCount;

        _context.Reservations.Remove(reservation);

        await _context.SaveChangesAsync(cancellationToken);
    }



}