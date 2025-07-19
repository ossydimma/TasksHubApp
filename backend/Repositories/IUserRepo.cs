
using TasksHubServer.Models;

namespace TasksHubServer.Repositories
{
    public interface IUserRepo
    {
        Task<ApplicationUser?> CreateUserAsync(ApplicationUser user);
        Task<IEnumerable<ApplicationUser>> GetAllUsersAsync();
        Task<ApplicationUser?> GetUserByIdAsync(string userId);
        Task<ApplicationUser?> GetUserByEmailAsync(string email);
        Task<ApplicationUser?> GetUserByGoogleSubAsync(string googleSub);
        Task<ApplicationUser?> GetUserByRefreshTokenAsync(string refreshToken);
        Task<bool> UpdateUserAsync(ApplicationUser user);
        Task<bool> DeleteUserAsync(Guid id);
    }
}