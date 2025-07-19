
using Microsoft.Extensions.Caching.Distributed;
using TasksHubServer.Data;

namespace TasksHubServer.Repositories;

public class TaskRepo (IDistributedCache distributedCache, ApplicationDbContext Db): ITaskRepo
{
    private readonly ApplicationDbContext _db = Db;
    private readonly IDistributedCache _distributedCache = distributedCache;
    private readonly DistributedCacheEntryOptions _cacheOptions = new DistributedCacheEntryOptions()
        .SetSlidingExpiration(TimeSpan.FromMinutes(5))
        .SetAbsoluteExpiration(TimeSpan.FromMinutes(30));
}