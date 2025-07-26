
namespace TasksHubServer.Repositories;

public interface ITaskRepo
{
    Task<bool> CreateTaskAsync(UserTask newTask);
    Task<bool> UpdateTaskAsync(UserTask task);
    Task<List<TaskDto>> GetAllTasksAsync(Guid userId);
    Task<UserTask?> GetTaskByIdAsync(Guid taskId, Guid? userId);
}
