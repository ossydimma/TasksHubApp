

namespace TasksHubServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksHubController(IUserRepo repo, OTPService otpService, EmailSender emailSender) : ControllerBase
    {
        private readonly IUserRepo _repo = repo;
        private readonly OTPService _otpService = otpService;
        private readonly EmailSender _emailSender = emailSender;

        [HttpGet("GetAllUsers")]
        public async Task<IEnumerable<ApplicationUser>> GetAllUsers()
        {
            IEnumerable<ApplicationUser> users = await _repo.GetAllUsersAsync();
            return users;
        }






        [HttpDelete("deleteUser")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            bool deleted = await _repo.DeleteUserAsync(id);

            if (deleted) return new NoContentResult();

            return BadRequest();
        }
    }
}