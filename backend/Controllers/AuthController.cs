namespace TasksHubServer.Controllers;

[Route("api/")]
[ApiController]
public class AuthController(IUserRepo repo, OTPService otpService, EmailSender emailSender) : ControllerBase
{
    private readonly IUserRepo _repo = repo;
    private readonly OTPService _otpService = otpService;
    private readonly EmailSender _emailSender = emailSender;

    [HttpPost("auth/signup")]
    [ProducesResponseType(201)]
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
            UserName = model.Fullname.Split(" ")[0],
            Email = model.Email,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
            IsEmailVerified = false

        };

        if (await _repo.CreateUserAsync(user) is null)
            return BadRequest("Repository failed to create user");

        return Created("", "Registered successfully.");

    }

    [HttpPost("auth/google")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GoogleAuth([FromBody] GoogleAuthDto model)
    {
        try
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(model.Credential);
            var normalizedEmail = payload.Email.Trim().ToLower();

            ApplicationUser? user = await _repo.GetUserByGoogleSubAsync(payload.Subject);

            if (user == null)
            {
                // Fallback to email lookup for first-time linking
                user = await _repo.GetUserByEmailAsync(normalizedEmail);
                if (user != null)
                {
                    user.GoogleSub = payload.Subject;
                }
            }

            if (user == null)
            {
                // Create a new user if not found by Google sub or email
                user = new ApplicationUser
                {
                    GoogleSub = payload.Subject,
                    Email = payload.Email,
                    FullName = payload.Name,
                    UserName = payload.Name.Split(" ")[0],
                    ProfilePicture = payload.Picture ?? null,
                };

                // Add the new user to the context
                await _repo.CreateUserAsync(user);
            }
            else
            {
                // Update email if user changed it on Google
                if (user.Email != payload.Email)
                {
                    user.Email = payload.Email;
                }
            }

            // Add the refresh token to the user object
            UserRefreshToken refreshToken = JwtTokenGenerator.GenerateRefreshToken(user.Id);

            if (!await _repo.CreateRefreshToken(refreshToken))
            {
                return BadRequest("Failed to update user refresh token");
            }

            // Now, perform a single save operation for all changes
            bool updated = await _repo.UpdateUserAsync(user);
            if (!updated)
            {
                // Log the error and handle the failure gracefully
                return BadRequest("Failed to update ");
            }

            // ... rest of the code for generating tokens and cookies
            string accessToken = JwtTokenGenerator.GenerateToken(user, HttpContext.RequestServices.GetRequiredService<IConfiguration>());

            var cookieoptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieoptions);

            return Ok(new { AccessToken = accessToken });
        }
        catch (InvalidJwtException)
        {
            return Unauthorized("Invalid Google token.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost("auth/login")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        // 1. Find user by email
        ApplicationUser? user = await _repo.GetUserByEmailAsync(model.Email);
        if (user is null)
            return Unauthorized("Invalid email or password");

        if (user.IsEmailVerified == false)
            return BadRequest("Email not verified");

        if (user.PasswordHash == null || user.PasswordSalt == null)
            return BadRequest("Please login with Google");

        if (!Hasher.VerifyPassword(model.Password, user.PasswordHash, user.PasswordSalt))
            return BadRequest("Invalid email or password");

        // Generate new token
        string accessToken = JwtTokenGenerator.GenerateToken(user, HttpContext.RequestServices.GetRequiredService<IConfiguration>());
        UserRefreshToken refreshToken = JwtTokenGenerator.GenerateRefreshToken(user.Id);

        if (!await _repo.CreateRefreshToken(refreshToken))
        {
            return BadRequest("Failed to update user refresh token");
        }

        // Update user's refreshtokens
        // user.RefreshTokens.Add(refreshToken);

        // // Save updated user to the database
        // bool updated = await _repo.UpdateUserAsync(user);
        // if (!updated)
        //     return BadRequest("Failed to update user refresh token");

        // Set refresh token in HttpOnly cookie
        var cookieoptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7)
        };

        Response.Cookies.Append("refreshToken", refreshToken.Token, cookieoptions);

        // Return access token to the frontend
        return Ok(new { AccessToken = accessToken });
    }

    [HttpGet("auth/refresh-token")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> RefreshToken()
    {
        // Getting refresh token from HttpOnly cookie
        var cookie = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(cookie))
            return Unauthorized();

        var refreshToken = Uri.UnescapeDataString(cookie);

        ApplicationUser? user = await _repo.GetUserByRefreshTokenAsync(refreshToken);
        if (user == null)
        {
            Response.Cookies.Append("refreshToken", "", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(-1) // Expire immediately
            });
            return Unauthorized("Invalid user.");
        }

        UserRefreshToken? currentToken = user.RefreshTokens.First(t => t.Token == refreshToken);

        if (currentToken.TokenExpiryTime <= DateTime.UtcNow)
        {
            Response.Cookies.Append("refreshToken", "", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(-1) // Expire immediately
            });

            await _repo.RemoveRefreshTokenAsync(currentToken.Token);
            return Unauthorized("Refresh token has expired.");
        }

        // Generate new token
        string accessToken = JwtTokenGenerator.GenerateToken(user, HttpContext.RequestServices.GetRequiredService<IConfiguration>());
        UserRefreshToken newRefreshToken = JwtTokenGenerator.GenerateRefreshToken(user.Id);

        // Replace the old token with the new one
        if (!await _repo.UpdateRefreshToken(currentToken, newRefreshToken))
            return Unauthorized("database failed to updated token.");

        // Set new refresh token in HttpOnly cookie
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        Response.Cookies.Append("refreshToken", newRefreshToken.Token, cookieOptions);

        // 7. Return new acess token to the frontend
        return Ok(new { AccessToken = accessToken });

    }

    [HttpPost("auth/reset-password")]
    [ProducesResponseType(200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> ResetPassword(ResetPassword model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (string.IsNullOrWhiteSpace(model.Password) || string.IsNullOrWhiteSpace(model.Email))
            return BadRequest("credentials can't be empty.");

        ApplicationUser? user = await _repo.GetUserByEmailAsync(model.Email);
        if (user == null)
            return NotFound("user not found.");

        Hasher.HashPassword(model.Password, out byte[] passwordHash, out byte[] passwordSalt);

        user.PasswordHash = passwordHash;
        user.PasswordSalt = passwordSalt;

        bool updated = await _repo.UpdateUserAsync(user);
        if (!updated)
            return BadRequest("Failed to update username");

        await _emailSender.SendEmail(model.Email, "Forgot Password", "Your Password was reseted successfully.");

        return Ok("Password has been reseted");
    }

    [HttpPost("auth/logout")]
    [ProducesResponseType(200)]
    [ProducesResponseType(401)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Logout()
    {
        // Getting refresh token from HttpOnly cookie
        var cookie = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(cookie))
            return BadRequest("Logout failed cookies empty.");

        var refreshToken = Uri.UnescapeDataString(cookie);

        UserRefreshToken? token = await _repo.GetRefreshTokenAsync(refreshToken);
        if (token == null)
        {
            Response.Cookies.Append("refreshToken", "", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(-1) // Expire immediately
            });

            return NotFound("token not found on the database");
        }

        bool updated = await _repo.RemoveRefreshTokenAsync(refreshToken);
        if (!updated)
            return BadRequest("Failed to update user refresh token");

        Response.Cookies.Append("refreshToken", "", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddDays(-1) // Expire immediately
        });
        return Ok("Logout successful.");


    }

    [HttpPost("sendOTP")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> SendOTP(string email)
    {
        if (string.IsNullOrWhiteSpace(email) || !email.Contains("@"))
            return BadRequest("Invalid email address");

        ApplicationUser? user = await _repo.GetUserByEmailAsync(email);
        if (user == null) return BadRequest($"{email} invalid user.");

        string otp = await _otpService.GenerateAndStoreOtp(email);

        string subject = "Confirm it's you";
        string body = $@"
            <div style='font-size:18px;'>
                <h1 style='font-size:20px;'>Hi {email},</h1>yh
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
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString());
            return BadRequest();
        }

        return Ok("OTP sent successfully.");
    }

    [HttpPost("verifyOtp")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> VerifyOTP([FromBody] VerifyOtpDto model)
    {
        if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.SubmittedOtp))
            return BadRequest("Email and code are Required.");

        bool isValid = await _otpService.VerifyOtp(model.Email, model.SubmittedOtp);

        if (!isValid)
            return BadRequest("Invalid or expired code.");

        // Send a welcome email
        if (model.Aim == "signup" || model.Aim == "login")
        {
            ApplicationUser? user = await _repo.GetUserByEmailAsync(model.Email);

            if (user == null)
                return Unauthorized("User is not found");

            user.IsEmailVerified = true;

            // Save updated user to the database
            bool updated = await _repo.UpdateUserAsync(user);
            if (!updated)
                return BadRequest("Failed to update user refresh token");

            if (model.Aim == "signup")
            {
                await _emailSender.SendEmail(model.Email, "Welcome to TasksHub", "Thank you for registering!");
            }
            else
            {
                await _emailSender.SendEmail(model.Email, "Welcome to TasksHub", "Your Email has successfully been verified.");
            }

        }
        else if (model.Aim == "change password")
        {
            await _emailSender.SendEmail(model.Email, "Change Password", "Your Password has been successfully changed.");
        }
        // else if (model.Aim == "forgot password")
        // {
        //     await _emailSender.SendEmail(model.Email, "Forgot Password", "Your Password was reseted successfully.");
        // }


        return Ok("Code verified successfully.");
    }



}