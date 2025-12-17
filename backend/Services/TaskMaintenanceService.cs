
using Microsoft.EntityFrameworkCore;
using TasksHubServer.Data;
using StackExchange.Redis; 
using TasksHubServer.Models; 

namespace TasksHubServer.Services;

public class TaskMaintenanceService(ApplicationDbContext Db, IConnectionMultiplexer redisCache)
{
    private readonly ApplicationDbContext _db = Db;
    private readonly IDatabase _cache  = redisCache.GetDatabase();

    public async Task UpdateOverdueTasksAsync()
    {
        // Keep Redis Alive
        await _cache.StringSetAsync("keep_alive", DateTime.UtcNow.ToString());

        DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);

        List<UserTask>? tasksToMarkOverdue = await _db.UserTasks
            .Where(t => t.Status == "Pending" && t.Deadline < today)
            .ToListAsync();

        if (tasksToMarkOverdue.Count > 0)
        {
            foreach (UserTask task in tasksToMarkOverdue)
            {
                task.Status = "Overdue";
            }
            await _db.SaveChangesAsync();
            Console.WriteLine($"[Hangfire] Marked {tasksToMarkOverdue.Count} tasks as Overdue.");
        }
        else 
        {
            Console.WriteLine("[Hangfire] Maintenance check completed. No overdue tasks found.");
        }
    }

}