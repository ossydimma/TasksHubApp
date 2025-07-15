
namespace TasksHubServer.DTOs;

public class CreateDocumentDto 
{
    public string? Title { get; set; } = null;
    public string? Body { get; set; } = null;

}

public class UpdateDocumentDto
{
    public string? DocumentIdStr { get; set; } = null;
    public string? Title { get; set; } = null;
    public string? Body { get; set; } = null;
}

public class GetDocusByTitleDto
{
    public string? QueryText { get; set; } = null;

}

public class FilterDocsDto 
{
    public string? Title { get; set; } = null;
    public string? Date { get; set; } = null;
}
