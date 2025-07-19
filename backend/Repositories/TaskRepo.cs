
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
        string key = $"TasksHub_Document_{newTask.Id}";
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
                Console.WriteLine("Data was not cached:" + ex);
            }
            return true;
        }


        return false;
    }
}