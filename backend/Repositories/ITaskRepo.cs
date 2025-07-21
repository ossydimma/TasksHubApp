
namespace TasksHubServer.Repositories;

public interface ITaskRepo
{
    Task<bool> CreateTaskAsync(UserTask newTask);
    Task<List<TaskDto>> GetAllTasksAsync(Guid userId);
    Task<TaskDto?> GetTaskByIdAsync(Guid taskId, Guid? userId);
}
