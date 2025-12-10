using backend.DTOs;
using backend.Services.Interfaces.Results;

namespace backend.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResult> Authenticate(AuthenticateUserDto dto, CancellationToken cancellationToken);
    Task<AuthResult> Register(RegisterDto dto, CancellationToken cancellationToken);
    Task<AuthResult> ConfirmEmail(string code, CancellationToken cancellationToken);
    Task<UserProfileDto> GetUserProfile(string userId, CancellationToken cancellationToken);
    Task<Me> Me(string userId, CancellationToken cancellationToken);

    Task<UserProfileDto> EditUserProfile(string userId, UserProfileDto userInfo,
        CancellationToken cancellationToken);
}