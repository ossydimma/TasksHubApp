using Microsoft.Extensions.Caching.Distributed;
using Microsoft.EntityFrameworkCore;
using TasksHubServer.Data;
using TasksHubServer.Models;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace TasksHubServer.Repositories;

public class UserRepo(IConnectionMultiplexer redisCache, ApplicationDbContext Db) : IUserRepo
{
    private readonly ApplicationDbContext _db = Db;
    private readonly IDatabase _cache  = redisCache.GetDatabase();
    // private readonly IDistributedCache _cache = distributedCache;
    // private readonly DistributedCacheEntryOptions TimeSpan.FromMinutes(30) = new DistributedCacheEntryOptions()
    //     .SetSlidingExpiration(TimeSpan.FromMinutes(5))
    //     .SetAbsoluteExpiration(TimeSpan.FromMinutes(30));

    public async Task<ApplicationUser?> CreateUserAsync(ApplicationUser user)
    {
        string key = $"UserEmail_{user.Email}";

        await _db.AddAsync(user);
        int affect = await _db.SaveChangesAsync();

        if (affect == 1)
        {
            await _cache.StringSetAsync(key, JsonConvert.SerializeObject(user), TimeSpan.FromMinutes(30));
            return user;
        }



        return null;


    }

    public async Task<bool> CreateRefreshToken(UserRefreshToken token)
    {
        await _db.UserRefreshTokens.AddAsync(token);
        int affect = await _db.SaveChangesAsync();

        if (affect == 1)
        {
            return true;
        }
        return false;
    }

    public async Task<IEnumerable<ApplicationUser>> GetAllUsersAsync()
    {
        string key = "TasksHUB_Users";
        string? cachedUsers = await _cache.StringGetAsync(key);

        if (cachedUsers != null)
        {
            return JsonConvert.DeserializeObject<IEnumerable<ApplicationUser>>(cachedUsers) ?? Enumerable.Empty<ApplicationUser>();
        }

        IEnumerable<ApplicationUser> users = await _db.ApplicationUsers
            .Include(u => u.RefreshTokens)
            .ToListAsync();

        await _cache.StringSetAsync(key, JsonConvert.SerializeObject(users), TimeSpan.FromMinutes(30));

        return users;
    }

    public async Task<ApplicationUser?> GetUserByIdAsync(string userIdStr)
    {
        Guid userId = Guid.Parse(userIdStr);
        string key = $"TasksHub_User_{userId}";
        try
        {
            string? cachedUser = await _cache.StringGetAsync(key);

            if (cachedUser != null)
            {
                return JsonConvert.DeserializeObject<ApplicationUser>(cachedUser);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Redis is not avaliable:" + ex.Message);
        }

        ApplicationUser? user = await _db.ApplicationUsers
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null) return user;

        try
        {
            await _cache.StringSetAsync(key, JsonConvert.SerializeObject(user), TimeSpan.FromMinutes(30));

        }
        catch (Exception ex)
        {
            Console.WriteLine("Data was not cached:" + ex.Message);
        }

        return user;

    }

    public async Task<ApplicationUser?> GetUserByEmailAsync(string email)
    {
        
        string normalizedEmail = email.ToLower();

        ApplicationUser? user = await _db.ApplicationUsers
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

        if (user is null) return user;

        return user;
    }

    public async Task<ApplicationUser?> GetUserByGoogleSubAsync(string googleSub)
    {
        if (string.IsNullOrWhiteSpace(googleSub))
            return null;

        string key = $"TasksHUB_UserGoogleSub_{googleSub}";
        try
        {
            string? cachedUser = await _cache.StringGetAsync(key);
            if (cachedUser is not null)
                return JsonConvert.DeserializeObject<ApplicationUser>(cachedUser);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Redis is not avaliable:" + ex.Message);
        }

        ApplicationUser? user = await _db.ApplicationUsers
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(s => s.GoogleSub == googleSub);

        if (user is null) return user;

        try
        {
            await _cache.StringSetAsync(key, JsonConvert.SerializeObject(user), TimeSpan.FromMinutes(30));
        }
        catch (Exception ex)
        {
            Console.WriteLine("Data was not cached:" + ex.Message);
        }

        return user;
    }

    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }

    // public async Task<bool> UpdateUserAsync(ApplicationUser user)
    // {
    //     string key = $"TasksHUB_User_{user.Id}";

    //     _db.Entry(user).State = EntityState.Modified;

    //     int affect = await _db.SaveChangesAsync();

    //     if (affect > 0)
    //     {
    //         await _cache.StringSetAsync(key, JsonConvert.SerializeObject(user), TimeSpan.FromMinutes(30));
    //         return true;
    //     }

    //     return false;
    // }

    public async Task<bool> UpdateUserAsync(ApplicationUser user)
    {
        // The DbContext can automatically track changes if the entity is from its own context.
        // If the entity is detached, you can re-attach it.
        _db.ApplicationUsers.Update(user);

        try
        {
            int affected = await _db.SaveChangesAsync();
            if (affected > 0)
            {
                // Now that the save is successful, update the cache.
                // You should also update your cached object here with the newly saved user
                // to ensure it has the latest concurrency token.
                await _cache.StringSetAsync($"TasksHUB_User_{user.Id}", JsonConvert.SerializeObject(user), TimeSpan.FromMinutes(30));
                return true;
            }
        }
        catch (DbUpdateConcurrencyException ex)
        {
            // Log the exception for debugging
            Console.WriteLine($"Concurrency exception: {ex.Message}");
            return false;
        }
        catch (DbUpdateException ex)
        {
            // Log other database exceptions
            Console.WriteLine($"Database update exception: {ex.Message}");
            return false;
        }

        return false;
    }

    public async Task<ApplicationUser?> GetUserByRefreshTokenAsync(string refreshToken)
    {
        string key = $"TasksHUB_UserRefreshToken_{refreshToken}";

        string? cachedUser = await _cache.StringGetAsync(key);
        if (cachedUser is not null)
        {
            return JsonConvert.DeserializeObject<ApplicationUser>(cachedUser);
        }

        ApplicationUser? user = await _db.ApplicationUsers
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == refreshToken));

        if (user is null) return user;

        await _cache.StringSetAsync(key, JsonConvert.SerializeObject(user), TimeSpan.FromMinutes(30));

        return user;
    }

    public async Task<UserRefreshToken?> GetRefreshTokenAsync(string refreshToken)
    {
        UserRefreshToken? token = await _db.UserRefreshTokens
            .FirstOrDefaultAsync(t => t.Token == refreshToken);

        return token;
    }

    
    public async Task<DataCountDto> UserDataCountsAsync(string userIdStr)
    {
        Guid userId = Guid.Parse(userIdStr);
        string key = $"TasksHub_DataCounts_{userId}";

        try 
        {
            string? dataCounts = await _cache.StringGetAsync(key);
            if (dataCounts is not null) {
                var cachedData = JsonConvert.DeserializeObject<DataCountDto>(dataCounts);
            if (cachedData is not null)
                return cachedData;
            }
        } 
        catch (Exception ex)
        {
            Console.WriteLine("Redis is not avaliable:" + ex.Message);
        }

        DateOnly todayDate = DateOnly.FromDateTime(DateTime.Today);

        var tasksCount = await _db.UserTasks
            .Where(t => t.UserId == userId)
            .CountAsync();

        var overdueTasksCount =  await _db.UserTasks
            .Where(t => t.UserId == userId && t.Status == "overdue")
            .CountAsync();

        var todaysTasksCount =  await _db.UserTasks
            .Where(t => t.UserId == userId && t.Deadline == todayDate)
            .CountAsync();

        var documentCount =  await _db.UserDocuments
            .Where(d => d.UserId == userId)
            .CountAsync();


        DataCountDto result = new DataCountDto
        {
            TotalTasks = tasksCount,
            Documents =  documentCount,
            OverdueTasks = overdueTasksCount,
            TodaysTasks = todaysTasksCount
        };

        try 
        {
            await _cache.StringSetAsync(key, JsonConvert.SerializeObject(result), TimeSpan.FromMinutes(30));
        }
        catch (Exception ex)
        {
            Console.WriteLine("Data was not cached:" + ex.Message);
        }

        return result;
        
    }

    public async Task<bool> UpdateRefreshToken(UserRefreshToken currentToken, UserRefreshToken newToken)
    {
        _db.UserRefreshTokens.Remove(currentToken);
        await _db.UserRefreshTokens.AddAsync(newToken);
        int affected = await _db.SaveChangesAsync();
        if (affected > 0)
            return true;

        return false;
    }


    public async Task<bool> RemoveRefreshTokenAsync(string refreshToken)
    {
        UserRefreshToken? token = await _db.UserRefreshTokens
            .FirstOrDefaultAsync(t => t.Token == refreshToken);

        if (token == null)
            return false;

        _db.UserRefreshTokens.Remove(token);
        await _db.SaveChangesAsync();

        return true;
    }


    // public async Task<IEnumerable<UserTask>> GetAllUserTasksAsync(Guid userId)
    // {
    //     var cacheKey = $"UserTasks_{userId}";
    //     var cachedTasks = await _cache.StringGetAsync(cacheKey);

    //     if (cachedTasks != null)
    //     {
    //         return JsonConvert.DeserializeObject<IEnumerable<UserTask>>(cachedTasks) ?? Enumerable.Empty<UserTasks>();
    //     }

    //     var tasks = await _db.UserTasks
    //         .Where(t => t.UserId == userId)
    //         .ToListAsync();

    //     await _cache.StringSetAsync(cacheKey, JsonConvert.SerializeObject(tasks), TimeSpan.FromMinutes(30));

    //     return tasks;
    // }

    public async Task<bool> DeleteUserAsync(Guid id)
    {
        string key = $"TasksHUB_User_{id}";

        // Get user by Id
        ApplicationUser? user = await _db.ApplicationUsers.FindAsync(id);
        if (user is null) return false;

        // Remove user and save changes
        _db.ApplicationUsers.Remove(user);
        int affect = await _db.SaveChangesAsync();

        // Valid save chnges and remove user from cache
        if (affect == 1)
        {
            _cache.KeyDelete(key);
            return true;
        }

        //  Return false if save wasn't successful
        return false;
    }



}