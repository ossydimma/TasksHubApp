
namespace TasksHubServer.Repositories;

public interface IDocumentRepo
{
    Task<List<UserDocument>> GetDocumentByTitleAsync(string userIdStr, string queryText);
}