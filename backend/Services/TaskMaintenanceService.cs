
using Microsoft.EntityFrameworkCore;
using TasksHubServer.Data;

namespace TasksHubServer.Services;

public class TaskMaintenanceService(ApplicationDbContext Db)
{
    private readonly ApplicationDbContext _db = Db;

    public async Task UpdateOverdueTasksAsync()
    {
        DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);

        List<UserTask>? tasksToMarkOverdue = await _db.UserTasks
            .Where(t => t.Status == "Pending" && t.Deadline < today)
            .ToListAsync();

        if (tasksToMarkOverdue.Any())
        {
            foreach (UserTask task in tasksToMarkOverdue)
            {
                task.Status = "Overdue";
            }
            await _db.SaveChangesAsync();
        }
    }

}