
using TasksHubServer.Models;

namespace TasksHubServer.Repositories
{
    public interface IUserRepo
    {
        Task<ApplicationUser?> CreateUserAsync(ApplicationUser user);
        Task<bool> CreateRefreshToken(UserRefreshToken token);
        Task<bool> UpdateRefreshToken(UserRefreshToken currentToken, UserRefreshToken newToken);
        Task<IEnumerable<ApplicationUser>> GetAllUsersAsync();
        Task<ApplicationUser?> GetUserByIdAsync(string userId);
        Task<ApplicationUser?> GetUserByEmailAsync(string email);
        Task<ApplicationUser?> GetUserByGoogleSubAsync(string googleSub);
        Task<ApplicationUser?> GetUserByRefreshTokenAsync(string refreshToken);
        Task<UserRefreshToken?> GetRefreshTokenAsync(string refreshToken);
        Task<bool> RemoveRefreshTokenAsync(string refreshToken);
        Task SaveChangesAsync();
        Task<bool> UpdateUserAsync(ApplicationUser user);
        Task<bool> DeleteUserAsync(Guid id);
    }
}