
namespace TasksHubServer.Controllers;

[Authorize]
[Route("api/task/")]
[ApiController]
public class TaskController(ITaskRepo repo, IUserRepo userRepo) : ControllerBase
{
    private readonly ITaskRepo _repo = repo;
    private readonly IUserRepo _userRepo = userRepo;

    [HttpPost("create")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> CreateTask(CreateTaskDto model)
    {
        
    }
}