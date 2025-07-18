using Microsoft.Extensions.Caching.Distributed;
using Microsoft.EntityFrameworkCore;
using TasksHubServer.Data;
using TasksHubServer.Models;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace TasksHubServer.Repositories;

public class UserRepo(IDistributedCache distributedCache, ApplicationDbContext Db) : IUserRepo
{
    private readonly ApplicationDbContext _db = Db;
    private readonly IDistributedCache _distributedCache = distributedCache;
    private readonly DistributedCacheEntryOptions _cacheOptions = new DistributedCacheEntryOptions()
        .SetSlidingExpiration(TimeSpan.FromMinutes(5))
        .SetAbsoluteExpiration(TimeSpan.FromMinutes(30));

    public async Task<ApplicationUser?> CreateUserAsync(ApplicationUser user)
    {
        string key = $"UserEmail_{user.Email}";

        await _db.AddAsync(user);
        int affect = await _db.SaveChangesAsync();

        if (affect == 1)
        {
            await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(user), _cacheOptions);
            return user;
        }



        return null;


    }

    public async Task<IEnumerable<ApplicationUser>> GetAllUsersAsync()
    {
        string key = "TasksHUB_Users";
        string? cachedUsers = await _distributedCache.GetStringAsync(key);

        if (cachedUsers != null)
        {
            return JsonConvert.DeserializeObject<IEnumerable<ApplicationUser>>(cachedUsers) ?? Enumerable.Empty<ApplicationUser>();
        }

        IEnumerable<ApplicationUser> users = await _db.ApplicationUsers.ToListAsync();

        await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(users), _cacheOptions);

        return users;
    }

    public async Task<ApplicationUser?> GetUserByIdAsync(string userIdStr)
    {
        Guid userId = Guid.Parse(userIdStr);
        string key = $"TasksHub_User_{userId}";
        try
        {
            string? cachedUser = await _distributedCache.GetStringAsync(key);

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
            await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(user), _cacheOptions);

        }
        catch (Exception ex)
        {
            Console.WriteLine("Data was not cached:" + ex.Message);
        }

        return user;

    }

    public async Task<ApplicationUser?> GetUserByEmailAsync(string email)
    {
        string key = $"TasksHUB_UserEmail_{email}";
        string? cachedUser = await _distributedCache.GetStringAsync(key);
        string normalizedEmail = email.ToLower();

        if (cachedUser is not null)
        {
            return JsonConvert.DeserializeObject<ApplicationUser>(cachedUser);
        }

        ApplicationUser? user = await _db.ApplicationUsers
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

        if (user is null) return user;

        await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(user), _cacheOptions);

        return user;
    }

    public async Task<ApplicationUser?> GetUserByGoogleSubAsync(string googleSub)
    {
         if (string.IsNullOrWhiteSpace(googleSub))
        return null;

        string key = $"TasksHUB_UserGoogleSub_{googleSub}";
        try
        {
            string? cachedUser = await _distributedCache.GetStringAsync(key);
            if (cachedUser is not null)
                return JsonConvert.DeserializeObject<ApplicationUser>(cachedUser);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Redis is not avaliable:" + ex.Message);
        }

        ApplicationUser? user = await _db.ApplicationUsers
            .FirstOrDefaultAsync(s => s.GoogleSub == googleSub);

        if (user is null) return user;

        try
        {
            await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(user), _cacheOptions);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Data was not cached:" + ex.Message);
        }

        return user;
    }

    public async Task<bool> UpdateUserAsync(ApplicationUser user)
    {
        string key = $"TasksHUB_User_{user.Id}";

        _db.Entry(user).State = EntityState.Modified;

        int affect = await _db.SaveChangesAsync();

        if (affect > 0)
        {
            await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(user), _cacheOptions);
            return true;
        }

        return false;
    }

    public async Task<ApplicationUser?> GetUserByRefreshTokenAsync(string refreshToken)
    {
        string key = $"TasksHUB_UserRefreshToken_{refreshToken}";
        string? cachedUser = await _distributedCache.GetStringAsync(key);

        if (cachedUser is not null)
        {
            return JsonConvert.DeserializeObject<ApplicationUser>(cachedUser);
        }

        ApplicationUser? user = await _db.ApplicationUsers
            .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

        if (user is null) return user;

        await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(user), _cacheOptions);

        return user;
    }


    // public async Task<IEnumerable<UserTask>> GetAllUserTasksAsync(Guid userId)
    // {
    //     var cacheKey = $"UserTasks_{userId}";
    //     var cachedTasks = await _distributedCache.GetStringAsync(cacheKey);

    //     if (cachedTasks != null)
    //     {
    //         return JsonConvert.DeserializeObject<IEnumerable<UserTask>>(cachedTasks) ?? Enumerable.Empty<UserTasks>();
    //     }

    //     var tasks = await _db.UserTasks
    //         .Where(t => t.UserId == userId)
    //         .ToListAsync();

    //     await _distributedCache.SetStringAsync(cacheKey, JsonConvert.SerializeObject(tasks), _cacheOptions);

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
            _distributedCache.Remove(key);
            return true;
        }

        //  Return false if save wasn't successful
        return false;
    }



}