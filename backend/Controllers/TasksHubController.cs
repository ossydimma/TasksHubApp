using Microsoft.AspNetCore.Mvc;
using TasksHubServer.DTOs;
using TasksHubServer.Models;
using TasksHubServer.Repositories;
using TasksHubServer.Services;
using TasksHubServer.TokenGenerator;

namespace TasksHubServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksHubController(ITasksHubRepository  repo) : ControllerBase
    {
        private readonly ITasksHubRepository _repo = repo;

        [HttpPost("Signup")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateUser(SignupDto model)
        {
            if (model is null) return BadRequest();

            ApplicationUser? existing = await _repo.GetUserByEmailAsync(model.Email);
            if (existing != null)
                return BadRequest($"{model.Email} is already in use.");

            Hasher.HashPassword(model.Password, out byte[] passwordHash, out byte[] passwordSalt);

            ApplicationUser user = new()
            {
              
                FullName = model.Email,
                Email = model.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,

            };

            if (await _repo.CreateUserAsync(user) is null) 
                return BadRequest("Repository failed to create user");

            return Ok("Registered Successfuly");


        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDto model)
        {
            ApplicationUser? user = await _repo.GetUserByEmailAsync(model.Email);

            if (user is null || !Hasher.VerifyPassword(model.Password, user.PasswordHash, user.PasswordSalt))
                return Unauthorized("Invalid email or password");

            string accessToken = JwtTokenGenerator.GenerateToken(user, HttpContext.RequestServices.GetRequiredService<IConfiguration>());
        
            string refreshToken = JwtTokenGenerator.GenerateRefreshToken();

            return Ok (new { AccessToken = accessToken, RefreshToken = refreshToken });
        }

        [HttpPost("RefreshToken")]
        public async Task<IActionResult> RefreshToken(string refreshToken)
        {
            ApplicationUser? user = await _repo.GetUserByRefreshTokenAsync(refreshToken);
            if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime < DateTime.UtcNow)
                return Unauthorized("Invalid or expired refresh token");

            string accessToken = JwtTokenGenerator.GenerateToken(user, HttpContext.RequestServices.GetRequiredService<IConfiguration>());
            string newRefreshToken = JwtTokenGenerator.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            if (!await _repo.UpdateUserAsync(user) )
                return BadRequest("Failed to update user refresh token");

            return Ok(new { AccessToken = accessToken, RefreshToken = newRefreshToken });
        }
        // [HttpGet]
        // public async Task<IEnumerable<UserTasks>> GetUserTasks(Guid userId)
        // {

        // }
        
    }
}