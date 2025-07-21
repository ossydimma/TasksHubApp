
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
    [ProducesResponseType(404)]
    public async Task<IActionResult> CreateTask(CreateTaskDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);


        string? userIdStr = User.FindFirst("id")?.Value;

        if (userIdStr == null)
            return BadRequest("unauthenticated user");

        ApplicationUser? user = await _userRepo.GetUserByIdAsync(userIdStr);
        if (user == null)
            return Unauthorized("Unauthenticated user.");

        if (!DateOnly.TryParse(model.Deadline, out DateOnly parsedDeadline))
            return BadRequest("Invalid date format. Use yyyy-MM-dd.");

        var task = new UserTask
        {
            Title = model.Title!,
            Description = model.Description!,
            Category = model.Category!,
            Deadline = parsedDeadline,
            UserId = user.Id
        };

        bool created = await _repo.CreateTaskAsync(task);
        if (!created)
            return StatusCode(500, "Failed to create task.");


        return Ok("Task Created Successfully.");
    }

    [HttpGet("get-tasks")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> GetAllUserTasks()
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);


        string? userIdStr = User.FindFirst("id")?.Value;

        if (string.IsNullOrWhiteSpace(userIdStr) || !Guid.TryParse(userIdStr, out Guid userId))
            return Unauthorized("Invalid or missing user ID in token.");

        List<UserTask> ListOfTasks = await _repo.GetAllTasksAsync(userId);

        return Ok(new { tasks = ListOfTasks });
    }
}