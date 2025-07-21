
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using TasksHubServer.Data;

namespace TasksHubServer.Repositories;

public class TaskRepo(IDistributedCache distributedCache, ApplicationDbContext Db) : ITaskRepo
{
    private readonly ApplicationDbContext _db = Db;
    private readonly IDistributedCache _distributedCache = distributedCache;
    private readonly DistributedCacheEntryOptions _cacheOptions = new DistributedCacheEntryOptions()
        .SetSlidingExpiration(TimeSpan.FromMinutes(5))
        .SetAbsoluteExpiration(TimeSpan.FromMinutes(30));

    public async Task<bool> CreateTaskAsync(UserTask newTask)
    {
        string key = $"TasksHub_Task_{newTask.Id}";
        await _db.UserTasks.AddAsync(newTask);

        int affected = await _db.SaveChangesAsync();

        if (affected > 0)
        {
            try
            {
                await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(newTask), _cacheOptions);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Cache Error] Task not cached: {ex.Message}");
            }
            return true;
        }


        return false;
    }

    public async Task<List<TaskDto>> GetAllTasksAsync(Guid userId)
    {
        List<TaskDto> tasks = await _db.UserTasks
            .AsNoTracking()
            .Where(t => t.UserId == userId)
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Category = t.Category,
                Status = t.Status,
                CreationDate = t.CreationDate,
                Deadline = t.Deadline.ToString()
            })
            .OrderByDescending(t => t.CreationDate)
            .ToListAsync();

        return tasks;
    }

    public async Task<TaskDto?> GetTaskByIdAsync(Guid taskId, Guid? userId)
    {
        string key = $"TasksHub_Task_{taskId}";
        TaskDto? task = null;

        try
        {
            string? fromCache = await _distributedCache.GetStringAsync(key);


            if (!string.IsNullOrEmpty(fromCache))
            {
                task = JsonConvert.DeserializeObject<TaskDto>(fromCache);
                if (task != null)
                    return task;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Redis unavailable: " + ex.Message);
        }

        task = await _db.UserTasks
            .Where(t => t.UserId == userId && t.Id == taskId)
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Category = t.Category,
                Status = t.Status,
                Deadline = t.Deadline.ToString()
            })
            .FirstOrDefaultAsync();

        if (task == null)
            return null;

        try
        {
            await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(task), _cacheOptions);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Data was not cached:" + ex.Message);
        }

        return task;
    }


}