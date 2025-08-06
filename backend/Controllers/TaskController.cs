
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

    [HttpPut("update")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> UpdateTask(TaskDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        Guid? userId = GetUserId();
        if (userId == null)
            return Unauthorized("Invalid or missing user ID");

        UserTask? task = await _repo.GetTaskByIdAsync(model.Id, userId);

        if (task == null)
            return NotFound("Task not Found.");

        task.Title = model.Title!;
        task.Category = model.Category;
        task.Status = model.Status!;
        task.Description = model.Description!;
        task.Deadline = model.Deadline;

        bool updated = await _repo.UpdateTaskAsync(task);

        if (!updated)
            return Conflict("Failed to update task.");

        return Ok();

    }

    [HttpGet("get-tasks")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> GetAllUserTasks()
    {

        string? userIdStr = User.FindFirst("id")?.Value;

        if (string.IsNullOrWhiteSpace(userIdStr) || !Guid.TryParse(userIdStr, out Guid userId))
            return Unauthorized("Invalid or missing user ID in token.");

        List<TaskDto> ListOfTasks = await _repo.GetAllTasksAsync(userId);

        return Ok(new { tasks = ListOfTasks });
    }

    [HttpGet("{taskId}")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetTaskById(Guid taskId)
    {
        Guid? userId = GetUserId();
        if (userId == null)
            return Unauthorized("Invalid or missing user ID");

        UserTask? task = await _repo.GetTaskByIdAsync(taskId, userId.Value);
        if (task == null)
            return NotFound("Task not found. ");

        return Ok(new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Category = task.Category,
            Status = task.Status,
            Description = task.Description,
            Deadline = task.Deadline,
            CreationDate = task.Created_at
        });
    }

    [HttpPost("filter-tasks")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> FilterTasks(FilterTaskDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        Guid? userId = GetUserId();
        if (userId == null)
            return Unauthorized("Invalid or missing user ID");

        List<TaskDto> FilteredTasks = await _repo.FilterTasksAsync(model, userId);

        return Ok(new { tasks = FilteredTasks });
    }

    [HttpDelete("{taskId}")]
    [ProducesResponseType(200)]
    [ProducesResponseType(401)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> DeleteTaskById(Guid taskId)
    {
        Guid? userId = GetUserId();
        if (userId == null)
            return Unauthorized("Invalid or missing user ID");

        bool deleted = await _repo.DeleteTaskByIdAsync(taskId, userId);

        if (!deleted)
            return StatusCode(500, "An internal server error occurred. Please try again later.");

        return Ok();
    }

    private Guid? GetUserId()
    {
        string? userIdStr = User.FindFirst("id")?.Value;

        if (!Guid.TryParse(userIdStr, out Guid userId))
            return null;

        return userId;
    }
}