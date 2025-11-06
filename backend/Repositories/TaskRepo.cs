
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using TasksHubServer.Data;
using StackExchange.Redis;

namespace TasksHubServer.Repositories;

public class TaskRepo(IConnectionMultiplexer redisCache, ApplicationDbContext Db) : ITaskRepo
{
    private readonly ApplicationDbContext _db = Db;
    private readonly IDatabase _cache = redisCache.GetDatabase();
    // private readonly DistributedCacheEntryOptions TimeSpan.FromMinutes(30) = new DistributedCacheEntryOptions()
    //     .SetSlidingExpiration(TimeSpan.FromMinutes(5))
    //     .SetAbsoluteExpiration(TimeSpan.FromMinutes(30));

    public async Task<bool> CreateTaskAsync(UserTask newTask)
    {
        string key = $"TasksHub_Task_{newTask.Id}";
        await _db.UserTasks.AddAsync(newTask);

        int affected = await _db.SaveChangesAsync();

        if (affected > 0)
        {
            try
            {
                await _cache.StringSetAsync(key, JsonConvert.SerializeObject(newTask), TimeSpan.FromMinutes(30));
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
            await _cache.StringSetAsync(key, JsonConvert.SerializeObject(task), TimeSpan.FromMinutes(30));
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
            string? fromCache = await _cache.StringGetAsync(key);


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
            await _cache.StringSetAsync(key, JsonConvert.SerializeObject(task), TimeSpan.FromMinutes(30));
        }
        catch (Exception ex)
        {
            Console.WriteLine("Data was not cached:" + ex.Message);
        }

        return task;
    }

    public async Task<UserTaskGroupsDto> GetUserTaskGroupsAsync(Guid? userId)
    {
        string key = $"TasksHub_TaskGroup_{userId}";

        try
        {
            string? cached = await _cache.StringGetAsync(key);
            if (cached is not null)
            {
                UserTaskGroupsDto? cachedData = JsonConvert.DeserializeObject<UserTaskGroupsDto>(cached);
                if (cachedData is not null)
                    return cachedData;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Redis unavailable: " + ex.Message);
        }

        DateOnly todayDate = DateOnly.FromDateTime(DateTime.Today);

        List<CarouselTaskDto> tasks = await _db.UserTasks
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.Created_at)
            .Select(t => new CarouselTaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Category = t.Category,
                Deadline = t.Deadline,
                Status = t.Status
            })
            .Take(2)
            .ToListAsync();

        List<CarouselTaskDto> overdueTasks = await _db.UserTasks
            .Where(t => t.UserId == userId && t.Status == "Overdue")
            .OrderByDescending(t => t.Created_at)
            .Select(t => new CarouselTaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Category = t.Category,
                Deadline = t.Deadline,
                Status = t.Status
            })
            .Take(2)
            .ToListAsync();

        List<CarouselTaskDto> todaysTasks = await _db.UserTasks
            .Where(t => t.UserId == userId && t.Deadline == todayDate)
            .OrderByDescending(t => t.Created_at)
            .Select(t => new CarouselTaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Category = t.Category,
                Deadline = t.Deadline,
                Status = t.Status
            })
            .Take(2)
            .ToListAsync();

        return new UserTaskGroupsDto
        {
            AllTasks = tasks,
            OverdueTasks = overdueTasks,
            TodaysTasks = todaysTasks

        };

    }
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
                _cache.KeyDelete(key);
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