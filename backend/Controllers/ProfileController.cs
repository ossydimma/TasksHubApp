namespace TasksHubServer.Controller;

[Route("api/")]
[ApiController]
// []
public class ProfileController(ITasksHubRepository repo) : ControllerBase
{
    private readonly ITasksHubRepository _repo = repo;

    [HttpPost("update-user-image")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> UpdateImage(UpdateImageDto model)
    {
        // check if model state is valid.
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (string.IsNullOrWhiteSpace(model.Image))
            return BadRequest("Image cannot be empty.");

        // Get user and update profile picture.
        ApplicationUser? user = await _repo.GetUserByEmailAsync(model.Email);
        if (user is null)
            return BadRequest("User not found.");

        user.ProfilePicture = model.Image;

        bool update = await _repo.UpdateUserAsync(user);
        if (!update)
            return BadRequest("Server failed to update user.");

        return Ok("Image updated Successfully.");
    }
}