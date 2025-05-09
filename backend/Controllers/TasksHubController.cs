using Microsoft.AspNetCore.Mvc;
using TasksHubServer.DTOs;
using TasksHubServer.Models;
using TasksHubServer.Repositories;
using TasksHubServer.Services;
// using TasksHubServer.TokenGenerator;

namespace TasksHubServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksHubController(ITasksHubRepository  repo, OTPService otpService, EmailSender emailSender) : ControllerBase
    {
        private readonly ITasksHubRepository _repo = repo;
        private readonly OTPService _otpService = otpService;
        private readonly EmailSender _emailSender = emailSender;

        [HttpPost("Signup")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateUser([FromBody] SignupDto model)
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
            await _emailSender.SendEmail(user.Email, "Welcome to TasksHub", "Thank you for registering!");

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
        public async Task<IActionResult> Login([FromBody] LoginDto model)
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
        public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
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
        public async Task<IActionResult> SendOTP([FromQuery] string email)
        {
            // ApplicationUser? user = await _repo.GetUserByEmailAsync(email);
            // if (user == null) return BadRequest();

            string otp = _otpService.GenerateAndStoreOtp(email);

            string subject = "Confirm it's you";
            string body = $@"
                <div style='font-size:18px;'>
                    <h1 style='font-size:20px;'>Hi {email},</h1>
                    <p>We're sending a security code to confirm that it's really you.</p>
                    <p><strong style='font-size:20px;'> Code : <strong style='font-size:25px; word-spacing: 20px;'> {otp}</strong> </p>
                    <p>This code will expire in 5 minutes.</p>
                    <p>
                        <span style='font-size:18px; font-weight: 700;'>Didn't request this? </span>
                        If you got this email but didn't request for it, it's possible someone is trying to access your TasksHub account.
                        As long as you don't share this code with anyone, you don't need to take any further step.
                    </p>
                    <p style='font-size:18px;'>Thanks,<br/> <span style='font-weight: 800;'>TasksHub </span></p>
                </div>";

            try
            {
                await _emailSender.SendEmail(email, subject, body);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return BadRequest();
            }

            return Ok("OTP sent successfully.");
        }

        [HttpPost("VerifyOtp")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public IActionResult VerifyOTP( string email,string submittedOtp)
        {
            if (!_otpService.VerifyOtp(email, submittedOtp))
            {
                return BadRequest("Invalid or expired OTP.");

            }

             return Ok("OTP verified successfully.");
        }

    }
}