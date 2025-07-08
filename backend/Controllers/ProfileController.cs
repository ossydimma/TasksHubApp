
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
namespace TasksHubServer.Controller;

[Route("api/settings/")]
[ApiController]
// []
public class ProfileController(ITasksHubRepository repo, IConfiguration config, OTPService otpService, EmailSender emailSender) : ControllerBase
{
    private readonly ITasksHubRepository _repo = repo;
    private readonly IConfiguration _config = config;
    private readonly OTPService _otpService = otpService;
    private readonly EmailSender _emailSender = emailSender;


    [HttpPost("update-username")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> UpdateUsername([FromBody] UpdateUsernameDto model)
    {
        if (string.IsNullOrEmpty(model.Id)) return Unauthorized();

        if (string.IsNullOrWhiteSpace(model.Username))
            return BadRequest("Value can't be empty");

        ApplicationUser? user = await _repo.GetUserByIdAsync(model.Id);
        if (user == null) return NotFound("User not found");

        user.UserName = model.Username;

        bool updated = await _repo.UpdateUserAsync(user);
        if (!updated)
            return BadRequest("Failed to update username");

        return Ok(new { newUserName = user.UserName });


    }

    [HttpPost("change-password")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        ApplicationUser? user = await _repo.GetUserByIdAsync(model.Id);
        if (user == null) return NotFound("User not found");

        // Checking user auth provider
        if (user.PasswordHash == null || user.PasswordSalt == null)
            return BadRequest("You can't change password becuase you signed up with google");

        if (!Hasher.VerifyPassword(model.OldPassword, user.PasswordHash, user.PasswordSalt))
            return Unauthorized("Invalid password.");

        Hasher.HashPassword(model.NewPassword, out byte[] passwordHash, out byte[] passwordSalt);

        user.PasswordHash = passwordHash;
        user.PasswordSalt = passwordSalt;

        bool updated = await _repo.UpdateUserAsync(user);
        if (!updated)
            return BadRequest("Failed to change user's password, try again later.");

        return Ok("Password changed succesfully.");
    }

    [HttpPost("update-user-image")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> UpdateImage([FromForm] UpdateImageDto model)
    {
        if (string.IsNullOrWhiteSpace(model.Id))
            return Unauthorized();

        ApplicationUser? user = await _repo.GetUserByIdAsync(model.Id);
        if (user == null) return NotFound("User not found");

        //  Delete previous image if exists
        if (!string.IsNullOrEmpty(user.ProfileImagePublicId))
        {
            Cloudinary? cloudinary = GetCloudinaryInstance();
            DeletionParams deletionParams = new(user.ProfileImagePublicId);
            var deletionResult = await cloudinary.DestroyAsync(deletionParams);
        }

        //  Upload new image
        if (model.File != null && model.File.Length > 0)
        {
            Cloudinary? cloudinary = GetCloudinaryInstance();

            ImageUploadParams uploadParams = new()
            {
                File = new FileDescription(model.File.FileName, model.File.OpenReadStream()),
                Folder = "taskshub/profile_images",
                Transformation = new Transformation().Quality("auto:best")
            };

            var uploadResult = await cloudinary.UploadAsync(uploadParams);

            // Save new image data to user
            user.ProfilePicture = uploadResult.SecureUrl.ToString();
            user.ProfileImagePublicId = uploadResult.PublicId;

            bool updated = await _repo.UpdateUserAsync(user);
            if (!updated)
                return BadRequest("Failed to update user profile picture");

            return Ok(new { imageUrl = user.ProfilePicture });
        }
        return BadRequest("Empty file");
    }

    [HttpPost("change-google-account")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> ChangeGoogleAccount([FromBody] ChangeGoogleAccountDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);


        // try
        // {
        //     // Validate the new Google ID token
        //     var payload = await GoogleJsonWebSignature.ValidateAsync(model.Token);

        //     ApplicationUser? user = await _repo.GetUserByIdAsync(model.Id);
        //     if (user is null) return NotFound("User not found.");

        //     // Check if this Google account is already linked to another user
        //     ApplicationUser? existing = await _repo.GetUserByGoogleSubAsync(payload.Subject);
        //     if (existing != null && existing.Id != user.Id)
        //     {
        //         return BadRequest("This Google account is already in use.");
        //     }

        //     ApplicationUser? emailExists = await _repo.GetUserByEmailAsync(payload.Email);
        //     if (emailExists != null && emailExists.Id != user.Id)
        //     {
        //         return BadRequest("This email is already in use by another account.");
        //     }

        //     string oldEmail = user.Email;

        //     user.GoogleSub = payload.Subject;
        //     user.Email = payload.Email;

        //     bool updated = await _repo.UpdateUserAsync(user);
        //     if (!updated)
        //         return BadRequest("Failed to change user email.");

        //     string oldEmailSubject = "Your TasksHub email has been changed";
        //     string oldEmailBody = $@"
        //         <div style='font-size:16px;'>
        //             <p>Hi {user.UserName},</p>
        //             <p>We wanted to let you know that the email address associated with your <strong>TasksHub</strong> account was successfully changed.</p>
        //             <p>If you made this change, no further action is needed.</p>
        //             <p>If you didn’t request this change, please contact our support team immediately — your account may be at risk.</p>
        //             <p style='margin-top: 20px;'>Thanks,<br/><strong>TasksHub Team</strong></p>
        //         </div>

        //     ";

        //     string newEmailSubject = "You've successfully updated your email on TasksHub";
        //     string newEmailBody = $@"
        //         <div style='font-size:16px;'>
        //             <p>Hi {user.UserName},</p>
        //             <p>Your email address on <strong>TasksHub</strong> has been successfully updated to this address.</p>
        //             <p>You're now all set to log in using your new email.</p>
        //             <p>If you didn't request this change, please contact support immediately.</p>
        //             <p style='margin-top: 20px;'>Thanks,<br/><strong>TasksHub Team</strong></p>
        //         </div>

        //     ";
        //     try
        //     {
        //         await _emailSender.SendEmail(user.Email, newEmailSubject, newEmailBody);
        //         await _emailSender.SendEmail(oldEmail, oldEmailSubject, oldEmailBody);

        //     }
        //     catch (Exception ex)
        //     {
        //         Console.WriteLine(ex.Message);
        //     }

        //     return Ok( new { newEmail = user.Email } );

        // }
        GoogleJsonWebSignature.Payload? payload = null;
        try
        {
            // Validate the new Google ID token
            payload = await GoogleJsonWebSignature.ValidateAsync(model.Token);
        }
        catch (InvalidJwtException)
        {
            return Unauthorized("Invalid Google token.");
        }

        if (payload != null)
        {
            // Check if user exist
            ApplicationUser? existingUser = await _repo.GetUserByGoogleSubAsync(payload.Subject);
            Guid id = Guid.Parse(model.Id);
            if (existingUser != null )
            {
                if (existingUser.Id != id)
                {
                    return BadRequest("Your account is current linked to this Google account.");
                }

                return BadRequest("This Google account is already linked to another user.");
            }
            Console.WriteLine(model.Id);
            ApplicationUser? user = await _repo.GetUserByIdAsync(model.Id);
            if (user == null) return BadRequest("User not found");

            // Generate tokens
            string accessToken = JwtTokenGenerator.GenerateToken(user, HttpContext.RequestServices.GetRequiredService<IConfiguration>());
            string refreshToken = JwtTokenGenerator.GenerateRefreshToken();

            // Update user
            user.Email = payload.Email;
            user.GoogleSub = payload.Subject;
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


        return Unauthorized("Invalid Google token.");
    
    }

    [HttpPost("verify-email-change")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> VerifyEmailChange([FromBody] VerifyEmailChangeDto model)
    {
        if (string.IsNullOrWhiteSpace(model.Email))
            return BadRequest("Invalid email.");

        ApplicationUser? user = await _repo.GetUserByEmailAsync(model.Email);
        if (user is null) return NotFound("User not found.");

        string otp = await _otpService.GenerateAndStoreOtp(model.Email);

        string subject = "Confirm your email change request";
        string body = $@"
            <div style='font-size:18px;'>
                <h1 style='font-size:20px;'>Hi {model.Email},</h1>
                <p>We received a request to change the email address associated with your TasksHub account.</p>
                <p>To confirm this request, please use the following verification code:</p>
                <p><strong style='font-size:20px;'> Code : <strong style='font-size:25px; word-spacing: 20px;'> {otp}</strong> </p>
                <p>This code will expire in 5 minutes.</p>
                <p>
                    <span style='font-size:18px; font-weight: 700;'>Didn't request this?</span>
                    If you did not request to change your email address, please ignore this message. Your account will remain unchanged.
                </p>
                <p style='font-size:18px;'>Thanks,<br/> <span style='font-weight: 800;'>TasksHub</span></p>
            </div>
        ";

        try
        {
            await _emailSender.SendEmail(model.Email, subject, body);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString());
            return BadRequest();
        }

        return Ok("OTP sent successfully.");

    }

    [HttpPost("verify-old-email")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> VerifyOldEmail(VerifyEmailDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        bool isValid = await _otpService.VerifyOtp(model.OldEmail, model.Otp);

        if (!isValid)
            return BadRequest("Invalid or expired OTP.");

        ApplicationUser? user = await _repo.GetUserByEmailAsync(model.NewEmail);
        if (user != null) return BadRequest($"{model.NewEmail} already in use.");

        string otp = await _otpService.GenerateAndStoreOtp(model.NewEmail);

        string subject = "Confirm it's you";
        string body = $@"
            <div style='font-size:18px;'>
                <h1 style='font-size:20px;'>Hi {model.NewEmail},</h1>
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
            await _emailSender.SendEmail(model.NewEmail, subject, body);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString());
            return BadRequest();
        }

        return Ok("Old email verified successfully.");
    }

    [HttpPost("verify-new-email")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> VerifyNewEmail(VerifyEmailDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        bool isValid = await _otpService.VerifyOtp(model.NewEmail, model.Otp);

        if (!isValid)
            return BadRequest("Invalid or expired OTP.");

        ApplicationUser? user = await _repo.GetUserByEmailAsync(model.OldEmail);
        if (user is null) return NotFound("User not found.");

        user.Email = model.NewEmail.ToLower();

        bool updated = await _repo.UpdateUserAsync(user);
        if (!updated)
            return BadRequest("Failed to change user email.");

        string oldEmailSubject = "Your TasksHub email has been changed";
        string oldEmailBody = $@"
            <div style='font-size:16px;'>
                <p>Hi {user.UserName},</p>
                <p>We wanted to let you know that the email address associated with your <strong>TasksHub</strong> account was successfully changed.</p>
                <p>If you made this change, no further action is needed.</p>
                <p>If you didn’t request this change, please contact our support team immediately — your account may be at risk.</p>
                <p style='margin-top: 20px;'>Thanks,<br/><strong>TasksHub Team</strong></p>
            </div>

        ";

        string newEmailSubject = "You've successfully updated your email on TasksHub";
        string newEmailBody = $@"
            <div style='font-size:16px;'>
                <p>Hi {user.UserName},</p>
                <p>Your email address on <strong>TasksHub</strong> has been successfully updated to this address.</p>
                <p>You're now all set to log in using your new email.</p>
                <p>If you didn't request this change, please contact support immediately.</p>
                <p style='margin-top: 20px;'>Thanks,<br/><strong>TasksHub Team</strong></p>
            </div>

        ";

        try
        {
            await _emailSender.SendEmail(model.OldEmail, oldEmailSubject, oldEmailBody);
            await _emailSender.SendEmail(model.NewEmail, newEmailSubject, newEmailBody);

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString());
        }

        return Ok("Email Changed successfully.");


    }



    private Cloudinary GetCloudinaryInstance()
    {
        var account = new Account(
            _config["CloudinaryCloudName"],
            _config["CloudinaryApiKey"],
            _config["CloudinaryApiSecret"]
        );
        return new Cloudinary(account);
    }


}