
using TasksHubServer.Models;

namespace TasksHubServer.Repositories
{
    public interface ITasksHubRepository
    {
        Task<ApplicationUser?> CreateUserAsync(ApplicationUser user);
        Task<IEnumerable<ApplicationUser>> GetAllUsersAsync();
        Task<ApplicationUser?> GetUserByIdAsync(string userId);
        Task<ApplicationUser?> GetUserByEmailAsync(string email);
        Task<ApplicationUser?> GetUserByGoogleSubAsync(string googleSub);
        Task<ApplicationUser?> GetUserByRefreshTokenAsync(string refreshToken);
        Task<bool> UpdateUserAsync(ApplicationUser user);
        // Task<IEnumerable<UserTask>> GetAllUserTasksAsync(Guid userId);
        Task<bool> DeleteUserAsync(Guid id);
        // Task<UserTasks?> GetUserTaskByIdAsync(Guid taskId, Guid userId);
        // Task<UserTasks> CreateUserTaskAsync(UserTasks task);
        // Task<bool> UpdateUserTaskAsync(UserTasks task);
        // Task<bool> DeleteUserTaskAsync(Guid taskId, Guid userId);
    }
}