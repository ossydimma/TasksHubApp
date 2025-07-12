
namespace TasksHubServer.Controllers;

[Authorize]
[Route("api/document/")]
[ApiController]

public class DocumentController(IDocumentRepo repo, ITasksHubRepository userRepo) : ControllerBase
{
    private readonly IDocumentRepo _repo = repo;
    private readonly ITasksHubRepository _userRepo = userRepo;

    [HttpPost("create")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> CreateDocument(CreateDocumentDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        
        string? userIdStr = User.FindFirst("id")?.Value;

        if (userIdStr == null)
            return BadRequest("unauthenticated user");

        ApplicationUser? user = await _userRepo.GetUserByIdAsync(userIdStr);
        if (user == null)
            return NotFound("User not found.");

        var doc = new UserDocument
        {
            Title = model.Title!,
            Content = model.Body!,
            UserId = user.Id
        };

        if (!await _repo.CreateDocumentAsync(doc))
            return BadRequest("Failed to create document.");

        List<UserDocument> docs = await _repo.GetAllDocumentsAsync(user);

        return Ok(new { allDocuments = docs });
    }

    [HttpPost("update")]
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

        List<UserDocument> docs = await _repo.GetAllDocumentsAsync(user);

        return Ok(new { allDocuments = docs });
    }

    [HttpPost("get-documents")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetAllDocuments()
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        string? userIdStr = User.FindFirst("id")?.Value;   

        if (string.IsNullOrWhiteSpace(userIdStr)) return BadRequest("unauthenticated user");

        ApplicationUser? user = await _userRepo.GetUserByIdAsync(userIdStr);
        if (user == null) return BadRequest("User not found.");

        List<UserDocument> docs = await _repo.GetAllDocumentsAsync(user);

        return Ok(new { allDocuments = docs });
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

        if (string.IsNullOrWhiteSpace(userIdStr)) return BadRequest("unauthenticated user");

        if (!Guid.TryParse(userIdStr, out var userId))
            throw new ArgumentException("Invalid user ID format.", nameof(userIdStr));

        if (!Guid.TryParse(documentIdStr, out var documentId))
            throw new ArgumentException("Invalid document ID format.", nameof(documentIdStr));


        bool deleted = await _repo.DeleteDocumentAsync(userId, documentId);

        if (!deleted)
            return BadRequest("Server failed to delete document");

        ApplicationUser? user = await _userRepo.GetUserByIdAsync(userIdStr);
        if (user == null) return BadRequest("User not found.");

        List<UserDocument> docs = await _repo.GetAllDocumentsAsync(user);

        return Ok(new { allDocuments = docs });


    }

}


