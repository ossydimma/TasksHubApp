
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using TasksHubServer.Data;

namespace TasksHubServer.Repositories;

public class DocumentRepo(IDistributedCache distributedCache, ApplicationDbContext Db) : IDocumentRepo
{
    private readonly IDistributedCache _distributedCache = distributedCache;
    private readonly ApplicationDbContext _db = Db;

    public async Task<List<UserDocument>> GetDocumentByTitleAsync(string userIdStr, string queryText)
    {
        if (!Guid.TryParse(userIdStr, out var userId))
            throw new ArgumentException("Invalid user ID format.", nameof(userIdStr));

        List<UserDocument> docus = await _db.UserDocuments
            .AsNoTracking()
            .Where(d => d.UserId == userId && d.Title.ToLower().Contains(queryText))
            .ToListAsync();

        return docus;
    }
}