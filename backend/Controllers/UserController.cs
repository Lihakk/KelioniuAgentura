using backend.DTOs;
using backend.Entities;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IAuthService _authService;

    public UserController(IAuthService authService)
    {
        _authService = authService;
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto, CancellationToken cancellationToken)
    {
        var success = await _authService.Register(dto, cancellationToken);
        if (!success.Success) return BadRequest(success.Message);
        return Ok("Confirmation code sent to your email");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthenticateUserDto dto, CancellationToken cancellationToken)
    {
        var success = await _authService.Authenticate(dto, cancellationToken);
        if (!success.Success) return BadRequest(success.Message);
        return Ok(success);
    }

    [HttpPost("ConfirmAccount")]
    public async Task<IActionResult> ConfirmAccount(ConfirmationDto dto, CancellationToken cancellationToken)
    {
        var success = await _authService.ConfirmEmail(dto.Code, cancellationToken);
        if (!success.Success) return BadRequest(success.Message);
        return Ok(success);
    }
}