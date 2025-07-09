
namespace TasksHubServer.Controllers;

[Route("api/document/")]
[ApiController]

public class DocumentController(IDocumentRepo repo) : ControllerBase
{
    private readonly IDocumentRepo _repo = repo;

    [HttpPost("get-documents-by-title")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetDocumentByTitle(GetDocusByTitleDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (string.IsNullOrWhiteSpace(model.UserIdStr) || string.IsNullOrWhiteSpace(model.QueryText))
            return BadRequest("payload can't be empty");

        List<UserDocument> docus = await _repo.GetDocumentByTitleAsync(model.UserIdStr, model.QueryText);

        return Ok(new { docs = docus });
    }
    
}
