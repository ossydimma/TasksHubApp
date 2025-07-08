namespace TasksHubServer.Controllers;

[Route("api/")]
[ApiController]
public class AuthController(ITasksHubRepository repo, OTPService otpService, EmailSender emailSender) : ControllerBase
{
    private readonly ITasksHubRepository _repo = repo;
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

            // Fallback to email lookup for first-time linking
            if (user == null)
            {
                user = await _repo.GetUserByEmailAsync(normalizedEmail);
                if (user != null)
                {
                    user.GoogleSub = payload.Subject;
                    await _repo.UpdateUserAsync(user);
                }
            }

            if (user == null)
            {
                user = new ApplicationUser
                {
                    GoogleSub = payload.Subject,
                    Email = payload.Email,
                    FullName = payload.Name,
                    UserName = payload.Name.Split(" ")[0],
                    ProfilePicture = payload.Picture ?? null,
                };

                await _repo.CreateUserAsync(user);
            }
            else
            {
                // Update email if user changed it on Google
                if (user.Email != payload.Email)
                {
                    user.Email = payload.Email;
                    await _repo.UpdateUserAsync(user);
                }
            }

            string accessToken = JwtTokenGenerator.GenerateToken(user, HttpContext.RequestServices.GetRequiredService<IConfiguration>());
            string refreshToken = JwtTokenGenerator.GenerateRefreshToken();

            // Update user's refresh token and expiry
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            // Save updated user to the database
            bool updated = await _repo.UpdateUserAsync(user);
            if (!updated)
                return BadRequest("Failed to update user refresh token");

            // Set refresh token in HttpOnly cookie
            var cookieoptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken, cookieoptions);

            // Return access token to the frontend
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

        // Checking user auth provider
        if (user.PasswordHash == null || user.PasswordSalt == null)
            return BadRequest("Please login with Google");

        if (!Hasher.VerifyPassword(model.Password, user.PasswordHash, user.PasswordSalt))
            return BadRequest("Invalid email or password");

        // 2. Generate new token
        string accessToken = JwtTokenGenerator.GenerateToken(user, HttpContext.RequestServices.GetRequiredService<IConfiguration>());
        string refreshToken = JwtTokenGenerator.GenerateRefreshToken();

        // 3. Update user's refresh token and expiry
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        // 4. Save updated user to the database
        bool updated = await _repo.UpdateUserAsync(user);
        if (!updated)
            return BadRequest("Failed to update user refresh token");

        // 5. Set refresh token in HttpOnly cookie
        var cookieoptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7)
        };

        Response.Cookies.Append("refreshToken", refreshToken, cookieoptions);

        // 6. Return access token to the frontend
        return Ok(new { AccessToken = accessToken });
    }

    [HttpGet("auth/refresh-token")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> RefreshToken()
    {
        // 1. Getting refresh token from HttpOnly cookie
        var cookie = Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(cookie))
            return Unauthorized();

        var refreshToken = Uri.UnescapeDataString(cookie);

        // 2. Find user by refresh token
        ApplicationUser? user = await _repo.GetUserByRefreshTokenAsync(refreshToken);
        if (user is null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            // Clear refresh token from cookie
            Response.Cookies.Append("refreshToken", "", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(-1) // Expire immediately
            });

            return Unauthorized("Refresh token is invalid or expired");
        }

        // 3. Generate new token
        string accessToken = JwtTokenGenerator.GenerateToken(user, HttpContext.RequestServices.GetRequiredService<IConfiguration>());
        string newRefreshToken = JwtTokenGenerator.GenerateRefreshToken();

        // 4. Update user's refresh token and expiry
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        // 5. Save updated user to the database
        bool updated = await _repo.UpdateUserAsync(user);
        if (!updated)
            return BadRequest("Failed to update user refresh token");

        // 6. Set new refresh token in HttpOnly cookie
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        Response.Cookies.Append("refreshToken", newRefreshToken, cookieOptions);

        // 7. Return new acess token to the frontend
        return Ok(new { AccessToken = accessToken });
    }

    // [HttpPost("auth/validate-refresh")]
    // [ProducesResponseType(200)]
    // [ProducesResponseType(401)]
    // public async Task<IActionResult> ValidateRefresh()
    // {
    //     var cookie = Request.Cookies["refreshToken"];

    //     if (string.IsNullOrEmpty(cookie))
    //         return Unauthorized("No refresh token found");
    //     ;
    //     var refreshToken = Uri.UnescapeDataString(cookie);

    //     ApplicationUser? user = await _repo.GetUserByRefreshTokenAsync(refreshToken);
    //     if (user == null)
    //         return Unauthorized("Invalid refresh token");

    //     if (user.RefreshTokenExpiryTime <= DateTime.UtcNow)
    //         return Unauthorized("Refresh token has expired");

    //     return Ok("Refresh token is valid");
    // }

    [HttpPost("auth/logout")]
    [ProducesResponseType(200)]
    [ProducesResponseType(401)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Logout()
    {
        // Get and validate resfresh token from cookie
        var cookie = Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(cookie))
            return Unauthorized("Refresh token Not found.");

        // Decode and get user with the refresh token
        var refreshToken = Uri.UnescapeDataString(cookie);

        ApplicationUser? user = await _repo.GetUserByRefreshTokenAsync(refreshToken);
        if (user == null)
            return Unauthorized("Invalid refresh token");

        // Set refresh token to and empty string
        Response.Cookies.Append("refreshToken", "", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(-1) // Expire immediately
        });

        // modify user and update the database
        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = null;

        bool updated = await _repo.UpdateUserAsync(user);
        if (!updated)
            return BadRequest("Failed to update user refresh token");


        return Ok();

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
            return BadRequest("Email ans OTP are Required.");

        bool isValid = await _otpService.VerifyOtp(model.Email, model.SubmittedOtp);

        if (!isValid)
            return BadRequest("Invalid or expired OTP.");

        // Send a welcome email
        if (model.Aim == "signup")
        {
            await _emailSender.SendEmail(model.Email, "Welcome to TasksHub", "Thank you for registering!");
        }
        else if (model.Aim == "change password")
        {
            await _emailSender.SendEmail(model.Email, "Change Password", "Your Password has been successfully changed.");
        }
        else if (model.Aim == "forgot password")
        {
            await _emailSender.SendEmail(model.Email, "Forgot Password", "Your Password was resetted successfully.");
        }


        return Ok("OTP verified successfully.");
    }

   

}