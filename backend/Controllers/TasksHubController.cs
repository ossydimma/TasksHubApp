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
              
                FullName = model.Fullname,
                Email = model.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,

            };

            if (await _repo.CreateUserAsync(user) is null) 
                return BadRequest("Repository failed to create user");

            // Send a welcome email
            await EmailSender.SendEmail(user.Email, "Welcome to TasksHub", "Thank you for registering!");

            return Ok("Registered Successfuly");


        }

        [HttpGet("GetAllUsers")]
        public async Task<IEnumerable<ApplicationUser>> GetAllUsers()
        {
            IEnumerable<ApplicationUser> users = await _repo.GetAllUsersAsync();
            return users;
        }

        [HttpPost("Login")]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
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
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
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

        [HttpPost("SendOTP")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> SendOTP(string email)
        {
            // ApplicationUser? user = await _repo.GetUserByEmailAsync(email);
            // if (user == null) return BadRequest();

            OTPService otpService = new ();
            string otp = otpService.GenerateAndStoreOtp(email);
            string subject = "Confirm it's you";
            string body = $"Hi {email},\n" +
                $"We're sending a security code to comfirm that it's really you." +
                $"\n\nCode:{otp}\n\n" +
                $"This code will expire in 5 minutes.\n\n" +
                $"Didn't request this?\n" +
                $"If you got this email but didn't request for it, it's poosible someone is trying to access your TasksHub account.\n" +
                $"As long as you don't share this code with anyone, you don't need to take any further step.\n\n" +
                $"Thanks,\n TasksHub";


            await EmailSender.SendEmail(email, subject, body);

            return Ok("OTP sent successfully.");
        }

        [HttpPost("VerifyOtp")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public IActionResult VerifyOTP(string email, string submittedOtp)
        {
            OTPService otpService = new();
            if (!otpService.VerifyOtp(email, submittedOtp))
            {
                return BadRequest("Invalid or expired OTP.");

            }

             return Ok("OTP verified successfully.");
        }

    }
}