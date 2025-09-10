
namespace TasksHubServer.Controllers;

[Authorize]
[Route("api/document/")]
[ApiController]

public class DocumentController(IDocumentRepo repo, IUserRepo userRepo) : ControllerBase
{
    private readonly IDocumentRepo _repo = repo;
    private readonly IUserRepo _userRepo = userRepo;

    [HttpPost("create")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> CreateDocument(CreateDocumentDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        string? userIdStr = User.FindFirst("id")?.Value;

        if (userIdStr == null)
            return BadRequest("unauthenticated user");

        if (!await _repo.CreateDocumentAsync(model, userIdStr))
            return BadRequest("Failed to create document.");

        List<UserDocument> docs = await _repo.GetAllDocumentsAsync(userIdStr);

        return Ok(new { allDocuments = docs });
    }

    [HttpPut("update")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> UpdateDocument(UpdateDocumentDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        string? userIdStr = User.FindFirst("id")?.Value;

        if (userIdStr == null)
            return BadRequest("unauthenticated user");

        if (string.IsNullOrWhiteSpace(model.DocumentIdStr))
            return BadRequest("Document id is missing.");

        ApplicationUser? user = await _userRepo.GetUserByIdAsync(userIdStr!);
        if (user == null) return BadRequest("User not found.");

        UserDocument doc = await _repo.GetDocumentByIdAsync(model.DocumentIdStr);
        if (doc == null)
            return BadRequest("Document not found.");

        if (user.Id != doc.UserId)
            return BadRequest("unauthenticated user");

        doc.Title = model.Title!;
        doc.Content = model.Body!;

        if (!await _repo.UpdateDocumentAsync(doc))
            return BadRequest("Failed to update document.");

        List<UserDocument> docs = await _repo.GetAllDocumentsAsync(userIdStr);

        return Ok(new { allDocuments = docs });
    }

    [HttpGet("get-documents")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetAllDocuments()
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        string? userIdStr = User.FindFirst("id")?.Value;   

        if (string.IsNullOrWhiteSpace(userIdStr)) return BadRequest("unauthenticated user");

        List<UserDocument> docs = await _repo.GetAllDocumentsAsync(userIdStr);

        return Ok(new { allDocuments = docs });
    }

    [HttpPost("Filter-documents")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> FilterDocs(FilterDocsDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        string? userIdStr = User.FindFirst("id")?.Value;

        if (string.IsNullOrWhiteSpace(userIdStr))
            return Unauthorized("unauthenticated user");

        Console.WriteLine("Model" + model);

        if (!string.IsNullOrWhiteSpace(model.Title) && !string.IsNullOrWhiteSpace(model.Date))
        {
            return Ok(new { docs = await _repo.FilterByDateAndTitleAsync(userIdStr, model.Date, model.Title) });
        }
        else if (!string.IsNullOrWhiteSpace(model.Title) && string.IsNullOrWhiteSpace(model.Date))
        {
            return Ok(new { docs = await _repo.GetDocumentByTitleAsync(userIdStr, model.Title) });
        }
        else if (string.IsNullOrWhiteSpace(model.Title) && !string.IsNullOrWhiteSpace(model.Date))
        {
            return Ok(new { docs = await _repo.FilterByDateAsync(userIdStr, model.Date) });
        }
        else
        {
            return BadRequest("Both title and date can't be empty.");
        } 

    }

    [HttpPost("get-documents-by-title")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetDocumentByTitle(GetDocusByTitleDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        string? userIdStr = User.FindFirst("id")?.Value;   

        if (string.IsNullOrWhiteSpace(userIdStr)) return BadRequest("unauthenticated user");

        List<UserDocument> docus = await _repo.GetDocumentByTitleAsync(userIdStr, model.QueryText!);

        return Ok(new { docs = docus });
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> DeleteDocument(string documentIdStr)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (string.IsNullOrWhiteSpace(documentIdStr))
            return BadRequest("Document Id is missing.");

        string? userIdStr = User.FindFirst("id")?.Value;   
        if (string.IsNullOrWhiteSpace(userIdStr)) 
            return Unauthorized("unauthenticated user");

        bool deleted = await _repo.DeleteDocumentAsync(userIdStr, documentIdStr);

        if (!deleted)
            return BadRequest("Server failed to delete document");

        List<UserDocument> docs = await _repo.GetAllDocumentsAsync(userIdStr);

        return Ok(new { allDocuments = docs });


    }

}


