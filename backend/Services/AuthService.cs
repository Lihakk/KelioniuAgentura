using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Configurations;
using backend.Data;
using backend.DTOs;
using backend.Entities;
using backend.Services.Interfaces.Results;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services.Interfaces;

public class AuthService : IAuthService
{
    private AppDbContext _context;
    private JwtSettings _jwtSettings;
    private IEmailService _emailService;
    private readonly IPasswordHasher<User> _passwordHasher;

    public AuthService(AppDbContext context, JwtSettings jwtSettings, IEmailService emailService, IPasswordHasher<User> passwordHasher)
    {
        _context = context;
        _jwtSettings = jwtSettings;
        _emailService = emailService;
        _passwordHasher = passwordHasher;
    }

    public async Task<AuthResult> Authenticate(AuthenticateUserDto dto, CancellationToken cancellationToken)
    {
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == dto.Username, cancellationToken);

        if (user == null)
        {
            return new AuthResult
            {
                Success = false,
                Message = "Username is not correct"
            };
        }
        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);

        if (result == PasswordVerificationResult.Failed)
        {
            return new AuthResult
            {
                Success = false,
                EmailConfirmed = false,
                Message = "Password is not correct"
            };
        }
        if (!user.IsConfirmed)
        {
            return new AuthResult
            {
                Success = true, 
                EmailConfirmed = false,
                Message = "Account not confirmed"
            };
        }

        var token = GenerateJwtToken(user);
        
        return new AuthResult
        {
            Success = true,
            EmailConfirmed = true,
            Token = token,
        };
    }

    public string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
            }),
            Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience,
            SigningCredentials =
                new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public async Task<AuthResult> Register(RegisterDto dto, CancellationToken cancellationToken)
    {
        if (await _context.Users.AnyAsync(u => u.Username == dto.Username, cancellationToken) && await _context.Users.AnyAsync(u => u.Email == dto.Email, cancellationToken))
        {
            return new AuthResult
            {
                Success = false,
                Message = "Username or Email already exists"
            };
        }
        var code = GenerateSixDigitCode();

        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Username = dto.Username,
            Email = dto.Email,
            Code = code,
            IsConfirmed = false,
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);
        
        await _context.Users.AddAsync(user, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        
        
        string message = $"your confirmation code is {code}";
        
        Console.WriteLine(code);
        
        await _emailService.SendEmailAsync(user.Email, "Confirm your email", message, cancellationToken);
        
        return new AuthResult
        {
            Success = true,
            Message = $"Please check email for account confirmation"
        };
    }
    private string GenerateSixDigitCode()
    {
        var random = new Random();
        return random.Next(100000, 1000000).ToString();
    }

    public async Task<AuthResult> ConfirmEmail(string code, CancellationToken cancellationToken)
    {
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Code == code, cancellationToken);

        if (user == null)
        {
            return new AuthResult
            {
                Success = false,
                Message = "Invalid code"
            };
        }

        user.IsConfirmed = true;
        await _context.SaveChangesAsync(cancellationToken);

        var token = GenerateJwtToken(user);

        return new AuthResult
        {
            Success = true,
            EmailConfirmed = true,
            Token = token
        };
    }
    public async Task<UserProfileDto> GetUserProfile(string userId, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .AsNoTracking() 
            .FirstOrDefaultAsync(u => u.Id.ToString() == userId, cancellationToken);

        if (user is null)
        {
            throw new Exception("This user doesn't exist");
        }
        
        var userInfo = new UserProfileDto
        {
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Username = user.Username,
            Role = user.Role,
        };
        
        return userInfo;
    }

    public async Task<Me> Me(string userId, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .AsNoTracking() 
            .FirstOrDefaultAsync(u => u.Id.ToString() == userId, cancellationToken);

        if (user is null)
        {
            throw new Exception("This user doesn't exist");
        }
        
        var userInfo = new Me
        {
            Id = user.Id,
            Role = user.Role,
            isEmailConfirmed = user.IsConfirmed,
        };
        
        return userInfo;
    }
    
}