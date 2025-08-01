
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

    public async Task<bool> UpdateTaskAsync(UserTask task)
    {
        string key = $"TasksHub_Task_{task.Id}";

        _db.Entry(task).State = EntityState.Modified;

        int affected = await _db.SaveChangesAsync();

        if (affected < 1)
        {
            return false;
        }

        try
        {
            await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(task), _cacheOptions);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Data was not cached:" + ex.Message);
        }
        return true;
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
                CreationDate = t.Created_at,
                Deadline = t.Deadline
            })
            .OrderByDescending(t => t.CreationDate)
            .ToListAsync();

        return tasks;
    }

    public async Task<UserTask?> GetTaskByIdAsync(Guid taskId, Guid? userId)
    {
        string key = $"TasksHub_Task_{taskId}";
        UserTask? task = null;

        try
        {
            string? fromCache = await _distributedCache.GetStringAsync(key);


            if (!string.IsNullOrEmpty(fromCache))
            {
                task = JsonConvert.DeserializeObject<UserTask>(fromCache);
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

    // public async Task<List<TaskDto>> FilterTaskByCreationDateAsync(DateOnly creationDate, Guid? userId)
    // {
    //     DateTime startDay = creationDate.ToDateTime(TimeOnly.MinValue);
    //     DateTime nextDayStart = creationDate.AddDays(1).ToDateTime(TimeOnly.MinValue);

    //     List<TaskDto> tasks = await _db.UserTasks
    //         .Where(t =>
    //             t.UserId == userId &&
    //             t.Created_at >= startDay &&
    //             t.Created_at < nextDayStart
    //         )
    //         .Select(t => new TaskDto
    //         {
    //             Id = t.Id,
    //             Title = t.Title,
    //             Description = t.Description,
    //             Category = t.Category,
    //             Status = t.Status,
    //             CreationDate = t.Created_at,
    //             Deadline = t.Deadline
    //         })
    //         .OrderByDescending(t => t.CreationDate)
    //         .ToListAsync();

    //     return tasks;
    // }

    // public async Task<List<TaskDto>> FilterTaskByDeadlineAsync(DateOnly deadline, Guid? userId)
    // {
    //     List<TaskDto> tasks = await _db.UserTasks
    //         .Where(t =>
    //             t.UserId == userId &&
    //             t.Deadline == deadline
    //         )
    //         .Select(t => new TaskDto
    //         {
    //             Id = t.Id,
    //             Title = t.Title,
    //             Description = t.Description,
    //             Category = t.Category,
    //             Status = t.Status,
    //             CreationDate = t.Created_at,
    //             Deadline = t.Deadline
    //         })
    //         .OrderByDescending(t => t.CreationDate)
    //         .ToListAsync();

    //     return tasks;
    // }

    // public async Task<List<TaskDto>> FilterTaskByStatusAsync(string status, Guid? userId)
    // {
    //     List<TaskDto> tasks = await _db.UserTasks
    //         .Where(t =>
    //             t.UserId == userId &&
    //             t.Status == status
    //         )
    //         .Select(t => new TaskDto
    //         {
    //             Id = t.Id,
    //             Title = t.Title,
    //             Description = t.Description,
    //             Category = t.Category,
    //             Status = t.Status,
    //             CreationDate = t.Created_at,
    //             Deadline = t.Deadline
    //         })
    //         .OrderByDescending(t => t.CreationDate)
    //         .ToListAsync();

    //     return tasks;
    // }

    // public async Task<List<TaskDto>> FilterTaskByCategoryAsync(string category, Guid? userId)
    // {
    //     List<TaskDto> tasks = await _db.UserTasks
    //         .Where(t =>
    //             t.UserId == userId &&
    //             t.Category == category
    //         )
    //         .Select(t => new TaskDto
    //         {
    //             Id = t.Id,
    //             Title = t.Title,
    //             Description = t.Description,
    //             Category = t.Category,
    //             Status = t.Status,
    //             CreationDate = t.Created_at,
    //             Deadline = t.Deadline
    //         })
    //         .OrderByDescending(t => t.CreationDate)
    //         .ToListAsync();

    //     return tasks;
    // }

    public async Task<List<TaskDto>> FilterTasksAsync(FilterTaskDto filter, Guid? userId)
    {

        IQueryable<UserTask> tasks = _db.UserTasks.AsQueryable()
            .Where(t => t.UserId == userId);

        if (!string.IsNullOrEmpty(filter.Category))
        {
            tasks = tasks.Where(t => t.Category == filter.Category);
        }

        if (!string.IsNullOrEmpty(filter.Status))
        {
            tasks = tasks.Where(t => t.Status == filter.Status);
        }

        if (filter.Deadline.HasValue)
        { 
            tasks = tasks.Where(t => t.Deadline == filter.Deadline);
        }

        if (filter.Created.HasValue)
        {
            DateTime startDay = filter.Created.Value.ToDateTime(TimeOnly.MinValue);
            DateTime nextDayStart = filter.Created.Value.AddDays(1).ToDateTime(TimeOnly.MinValue);

            tasks = tasks.Where(t => t.Created_at >= startDay && t.Created_at < nextDayStart);
        }

        tasks = tasks.OrderByDescending(t => t.Created_at);

        IQueryable<TaskDto> dtoQuery = tasks.Select(t => new TaskDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            Category = t.Category,
            Status = t.Status,
            CreationDate = t.Created_at,
            Deadline = t.Deadline
        });

        return await dtoQuery.ToListAsync();
    }
    public async Task<bool> DeleteTaskByIdAsync(Guid taskId, Guid? userId)
    {
        string key = $"TasksHub_Task_{taskId}";

        UserTask? task = await _db.UserTasks
            .FirstOrDefaultAsync(t => t.UserId == userId && t.Id == taskId);
        if (task == null)
            return false;

        _db.UserTasks.Remove(task);

        int affected = await _db.SaveChangesAsync();
        if (affected > 0)
        {
            try
            {
                _distributedCache.Remove(key);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to delete from Redis cache: " + ex.Message);
            }
            return true;
        }
        return false;
    }


}