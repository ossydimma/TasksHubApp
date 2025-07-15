
namespace TasksHubServer.Repositories;

public interface IDocumentRepo
{
    Task<bool> CreateDocumentAsync(UserDocument doc);
    Task<bool> UpdateDocumentAsync(UserDocument doc);
    Task<List<UserDocument>> GetAllDocumentsAsync(ApplicationUser user);
    Task<UserDocument> GetDocumentByIdAsync(string documentIdStr);
    Task<List<UserDocument>> GetDocumentByTitleAsync(string userIdStr, string queryText);
    Task<List<UserDocument>> FilterByDateAsync(string userIdStr, string dateStr);
    Task<List<UserDocument>> FilterByDateAndTitleAsync(string userIdStr, string dateStr, string title);
    Task<bool> DeleteDocumentAsync(Guid userId, Guid documentId);
}