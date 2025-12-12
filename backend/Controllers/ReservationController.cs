using System.Security.Claims;
using backend.DTOs;
using backend.Entities;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationController : ControllerBase
{
    private readonly IReservationService _reservationService;

    public ReservationController(IReservationService reservationService)
    {
        _reservationService = reservationService;
    }

    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAllReservations(CancellationToken cancellationToken)
    {
        var reservations = await _reservationService.GetAllReservationsAsync(cancellationToken);
        return Ok(reservations);
    }
    // [Authorize(Roles = "Client")]
    [HttpPost("Create")]
    public async Task<IActionResult> CreateReservation(CreateReservationDto reservationDetails, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID claim missing."); 
        }
        
        await _reservationService.CreateReservation(reservationDetails, int.Parse(userId),  cancellationToken);
        return Ok();
    }

    [HttpGet("GetById/{id}")]
    public async Task<IActionResult> GetReservationById(int id, CancellationToken cancellationToken)
    {
        var result = await _reservationService.GetReservationById(id, cancellationToken);
        return Ok(result);
    }

    [HttpPut("Update")]
    public async Task<IActionResult> UpdateReservation(UpdateReservationDto reservationDetails,
        CancellationToken cancellationToken)
    {
        _reservationService.UpdateReservation(reservationDetails, cancellationToken);
        return Ok();
    }

    [HttpDelete("DeleteTraveler/{id}")]
    public async Task<IActionResult> DeleteTraveler(int id, CancellationToken cancellationToken)
    {
        await _reservationService.RemoveTraveler(id, cancellationToken);
        return Ok();
    }
    [HttpPost("AddTraveler")]
    public async Task<IActionResult> AddTraveler(CreateTravelerDto traveler, CancellationToken cancellationToken)
    {
        await _reservationService.AddTraveler(traveler, cancellationToken);
        return Ok();
    }
}