
namespace TasksHubServer.Repositories;

public interface ITaskRepo
{
    Task<bool> CreateTaskAsync(UserTask newTask);
    Task<bool> UpdateTaskAsync(UserTask task);
    Task<List<TaskDto>> GetAllTasksAsync(Guid userId);
    Task<UserTask?> GetTaskByIdAsync(Guid taskId, Guid? userId);
    // Task<List<TaskDto>> FilterTaskByCategoryAsync(string category, Guid? userId);
    // Task<List<TaskDto>> FilterTaskByStatusAsync(string status, Guid? userId);
    // Task<List<TaskDto>> FilterTaskByDeadlineAsync(DateOnly deadline, Guid? userId);
    // Task<List<TaskDto>> FilterTaskByCreationDateAsync(DateOnly creationDate, Guid? userId);
    Task<List<TaskDto>> FilterTasksAsync(FilterTaskDto model, Guid? userId);
    Task<bool> DeleteTaskByIdAsync(Guid taskId, Guid? userId);
}
