
using TasksHubServer.Models;

namespace TasksHubServer.Repositories
{
    public interface ITasksHubRepository
    {
        Task<ApplicationUser?> CreateUserAsync(ApplicationUser user);
        Task<IEnumerable<ApplicationUser>> GetAllUsersAsync();
        Task<ApplicationUser?> GetUserByIdAsync(Guid userId);
        Task<ApplicationUser?> GetUserByEmailAsync(string email);
        Task<ApplicationUser?> GetUserByRefreshTokenAsync(string refreshToken);
        Task<bool> UpdateUserAsync(ApplicationUser user);
        Task<IEnumerable<UserTasks>> GetAllUserTasksAsync(Guid userId);
        // Task<UserTasks?> GetUserTaskByIdAsync(Guid taskId, Guid userId);
        // Task<UserTasks> CreateUserTaskAsync(UserTasks task);
        // Task<bool> UpdateUserTaskAsync(UserTasks task);
        // Task<bool> DeleteUserTaskAsync(Guid taskId, Guid userId);
    }
}