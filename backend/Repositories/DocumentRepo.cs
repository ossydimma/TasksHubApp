
using System;
using System.Globalization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using TasksHubServer.Data;

namespace TasksHubServer.Repositories;

public class DocumentRepo(IDistributedCache distributedCache, ApplicationDbContext Db) : IDocumentRepo
{
    private readonly ApplicationDbContext _db = Db;
    private readonly IDistributedCache _distributedCache = distributedCache;
    private readonly DistributedCacheEntryOptions _cacheOptions = new DistributedCacheEntryOptions()
        .SetSlidingExpiration(TimeSpan.FromMinutes(5))
        .SetAbsoluteExpiration(TimeSpan.FromMinutes(30));

    public async Task<bool> CreateDocumentAsync(UserDocument doc)
    {
        string key = $"TasksHub_Document_{doc.Id}";
        await _db.UserDocuments.AddAsync(doc);

        int affected = await _db.SaveChangesAsync();

        if (affected > 0)
        {
            try
            {
                await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(doc), _cacheOptions);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Data was not cached:" + ex);
            }
            return true;
        }


        return false;

    }

    public async Task<bool> UpdateDocumentAsync(UserDocument doc)
    {
        string key = $"TasksHub_Document_{doc.Id}";

        _db.Entry(doc).State = EntityState.Modified;

        int affected = await _db.SaveChangesAsync();

        if (affected > 0)
        {
            try
            {
                await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(doc), _cacheOptions);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Data was not cached:" + ex.Message);
            }
            return true;
        }


        return false;

    }

    public async Task<List<UserDocument>> GetAllDocumentsAsync(ApplicationUser user)
    {
        List<UserDocument> docs = await _db.UserDocuments
            .AsNoTracking()
            .Where(d => d.UserId == user.Id)
            .OrderByDescending(d => d.Date)
            .ToListAsync();

        return docs;
    }

    public async Task<UserDocument> GetDocumentByIdAsync(string documentIdStr)
    {
        Guid? documentId = ParseStringToGuid(documentIdStr)
            ?? throw new ArgumentException("Invalid Document ID format.", nameof(documentIdStr));
        
        string key = $"TasksHub_Document_{documentIdStr}";
        UserDocument? doc = null;

        try
        {
            string? fromCache = await _distributedCache.GetStringAsync(key);
            if (!string.IsNullOrEmpty(fromCache))
            {
                doc = JsonConvert.DeserializeObject<UserDocument>(fromCache);
                if (doc != null)
                    return doc;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Redis unavailable: " + ex.Message);
        }

        doc = await _db.UserDocuments.FirstOrDefaultAsync(d => d.Id == documentId);

        if (doc == null)
            return doc!;

        try
        {
            await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(doc), _cacheOptions);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Data was not cached:" + ex.Message);
        }

        return doc;
    }

    public async Task<List<UserDocument>> FilterByDateAndTitleAsync(string userIdStr, string dateStr, string title)
    {
        (DateTime start, DateTime end)? range = GetDateRangeForDay(dateStr)
            ?? throw new ArgumentException("Invalid Date format.", nameof(dateStr));

        var (start, end) = range.Value;

        Guid? userId = ParseStringToGuid(userIdStr)
            ?? throw new ArgumentException("Invalid user ID format.", nameof(userIdStr));

        List<UserDocument> docs = await _db.UserDocuments
            .Where(d =>
                d.UserId == userId &&
                d.Title.ToLower().Contains(title) &&
                d.Date >= start && d.Date < end
            )
            .OrderByDescending(d => d.Date)
            .ToListAsync();

        return docs;
    }

    public async Task<List<UserDocument>> GetDocumentByTitleAsync(string userIdStr, string queryText)
    {
       Guid? userId = ParseStringToGuid(userIdStr)
            ?? throw new ArgumentException("Invalid user ID format.", nameof(userIdStr));

        List<UserDocument> docus = await _db.UserDocuments
            .AsNoTracking()
            .Where(d => d.UserId == userId && d.Title.ToLower().Contains(queryText))
            .ToListAsync();

        return docus;
    }

    public async Task<List<UserDocument>> FilterByDateAsync(string userIdStr, string date)
    {
        (DateTime start, DateTime end)? range = GetDateRangeForDay(date)
            ?? throw new ArgumentException("Invalid Date format.", nameof(date));

        var (start, end) = range.Value;

        Guid? userId = ParseStringToGuid(userIdStr)
            ?? throw new ArgumentException("Invalid user ID format.", nameof(userIdStr));

        List<UserDocument> docs = await _db.UserDocuments
            .Where(d => d.UserId == userId && d.Date >= start && d.Date < end)
            .OrderByDescending(d => d.Date)
            .ToListAsync();



        return docs;
    }


    public async Task<bool> DeleteDocumentAsync(Guid userId, Guid documentId)
    {
        string key = $"TasksHub_Document_{documentId}";
        UserDocument? doc = await _db.UserDocuments
            .FirstOrDefaultAsync(d => d.Id == documentId && d.UserId == userId);

        if (doc == null)
            return false;

        _db.UserDocuments.Remove(doc);

        int affected = await _db.SaveChangesAsync();
        if (affected > 0)
        {
            try
            {
                _distributedCache.Remove(key);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to cache user in Redis: " + ex.Message);
            }
            return true;
        }

        return false;
    }

    private static (DateTime start, DateTime end)? GetDateRangeForDay(string dateStr)
    {
        Console.WriteLine($"[FilterByDateAsync] Raw date: {dateStr}");

        if (DateTime.TryParse(dateStr, null, DateTimeStyles.AdjustToUniversal, out DateTime parsedDate))
        {
            DateTime start = parsedDate.Date;
            DateTime end = start.AddDays(1);

            return (start, end);

        }

        return null;

    }

    private static Guid? ParseStringToGuid(string dataStr)
    {
        if (!Guid.TryParse(dataStr, out var parsedGuid))
            return null;

        return parsedGuid;
    }
}