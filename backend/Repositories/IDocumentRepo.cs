
namespace TasksHubServer.Repositories;

public interface IDocumentRepo
{
    Task<bool> CreateDocumentAsync(CreateDocumentDto model, string userIdStr);
    Task<bool> UpdateDocumentAsync(UserDocument doc);
    Task<List<UserDocument>> GetAllDocumentsAsync(string userIdStr);
    Task<UserDocument> GetDocumentByIdAsync(string documentIdStr);
    Task<List<UserDocument>> GetDocumentByTitleAsync(string userIdStr, string queryText);
    Task<List<UserDocument>> FilterByDateAsync(string userIdStr, string dateStr);
    Task<List<UserDocument>> FilterByDateAndTitleAsync(string userIdStr, string dateStr, string title);
    Task<bool> DeleteDocumentAsync(string userIdStr, string documentIdStr);
}