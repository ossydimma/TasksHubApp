
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
namespace TasksHubServer.Controllers;

[Authorize]
[Route("api/settings/")]
[ApiController]
// []
public class ProfileController(IUserRepo repo, IConfiguration config, OTPService otpService, EmailSender emailSender) : ControllerBase
{
    private readonly IUserRepo _repo = repo;
    private readonly IConfiguration _config = config;
    private readonly OTPService _otpService = otpService;
    private readonly EmailSender _emailSender = emailSender;


    [HttpPost("update-username")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> UpdateUsername([FromBody] UpdateUsernameDto model)
    {
        string? userIdStr = User.FindFirst("id")?.Value;

        if (userIdStr == null)  
            return BadRequest("unauthenticated user");

        if (string.IsNullOrWhiteSpace(model.Username))
            return BadRequest("Value can't be empty");

        ApplicationUser? user = await _repo.GetUserByIdAsync(userIdStr);
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

        string? userIdStr = User.FindFirst("id")?.Value;

        if (userIdStr == null)
            return BadRequest("unauthenticated user");

        ApplicationUser? user = await _repo.GetUserByIdAsync(userIdStr);
        if (user == null) return NotFound("User not found");

        // Checking user auth provider
        if (user.PasswordHash == null || user.PasswordSalt == null)
            return BadRequest("You can't change password becuase you signed up with google");

        if (!Hasher.VerifyPassword(model.OldPassword, user.PasswordHash, user.PasswordSalt))
            return Unauthorized("Old password is invalid.");

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
        string? userIdStr = User.FindFirst("id")?.Value;

        if (userIdStr == null)
            return BadRequest("unauthenticated user");

        ApplicationUser? user = await _repo.GetUserByIdAsync(userIdStr);
        if (user == null) return NotFound("User not found");

        //  Delete previous image if exists
        if (!string.IsNullOrEmpty(user.ProfileImagePublicId))
        {
            Cloudinary? cloudinary = GetCloudinaryInstance();
            DeletionParams deletionParams = new(user.ProfileImagePublicId);
            await cloudinary.DestroyAsync(deletionParams);
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
            string? userIdStr = User.FindFirst("id")?.Value;

            if (userIdStr == null)
                return BadRequest("unauthenticated user");

            if (!Guid.TryParse(userIdStr, out var userId))
                throw new ArgumentException("Invalid user ID format.", nameof(userIdStr));
            
            if (existingUser != null)
            {
                if (existingUser.Id != userId)
                {
                    return BadRequest("Your account is current linked to this Google account.");
                }

                return BadRequest("This Google account is already linked to another user.");
            }
            Console.WriteLine(userId);
            ApplicationUser? user = await _repo.GetUserByIdAsync(userIdStr);
            if (user == null) return BadRequest("User not found");

            // Generate tokens
            string accessToken = JwtTokenGenerator.GenerateToken(user, HttpContext.RequestServices.GetRequiredService<IConfiguration>());
            UserRefreshToken refreshToken = JwtTokenGenerator.GenerateRefreshToken(user.Id);

            // Update user
            user.RefreshTokens.Add(refreshToken);
            user.Email = payload.Email;
            user.GoogleSub = payload.Subject;
            
            // user.RefreshToken = refreshToken;
            // user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

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

            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieoptions);

            // Return access token to the frontend
            return Ok(new { AccessToken = accessToken });

        }


        return Unauthorized("Invalid Google token.");
    
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