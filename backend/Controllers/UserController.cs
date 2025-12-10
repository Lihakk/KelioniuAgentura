using System.Security.Claims;
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
    
    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto, CancellationToken cancellationToken)
    {
        var success = await _authService.Register(dto, cancellationToken);
        if (!success.Success) return BadRequest(success.Message);
        return Ok("Confirmation code sent to your email");
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] AuthenticateUserDto dto, CancellationToken cancellationToken)
    {
        var success = await _authService.Authenticate(dto, cancellationToken);
        if (!success.Success)
            return BadRequest(success.Message);

        if (!success.EmailConfirmed)
        {
            return Ok(success);
        }

        Response.Cookies.Append("jwt", success.Token!, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,       
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddMinutes(60)
        });
        return Ok(success);
    }

    [HttpPost("ConfirmEmail")]
    public async Task<IActionResult> ConfirmEmail(ConfirmationDto dto, CancellationToken cancellationToken)
    {
        var result = await _authService.ConfirmEmail(dto.Code, cancellationToken);

        if (!result.Success)
            return BadRequest(result.Message);

        Response.Cookies.Append("jwt", result.Token!, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddMinutes(60)
        });

        return Ok(result);
    }

    [HttpGet("Profile")]
    public async Task<IActionResult> GetUserProfile(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID claim missing."); 
        }
        
        var user = await _authService.GetUserProfile(userId, cancellationToken);
        return Ok(user);
    }
    [HttpGet("Me")]
    public async Task<IActionResult> Me(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID claim missing."); 
        }
        
        var user = await _authService.Me(userId, cancellationToken);
        return Ok(user);
    }
    [HttpPost("Logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("jwt");

        return Ok(new { message = "Logged out" });
    }

    [HttpPut("UpdateProfile")]
    public async Task<IActionResult> EditUserProfile(UserProfileDto userInfo,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID claim missing."); 
        }
        
        var updatedUser = await _authService.EditUserProfile(userId, userInfo, cancellationToken);
        
        return Ok(updatedUser);
    }
}