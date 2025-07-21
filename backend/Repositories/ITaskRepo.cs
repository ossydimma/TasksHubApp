
namespace TasksHubServer.Repositories;

public interface ITaskRepo
{
    Task<bool> CreateTaskAsync(UserTask newTask);
    Task<List<UserTask>> GetAllTasksAsync(Guid userId);
}
