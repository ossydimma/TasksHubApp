
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
namespace TasksHubServer.Controller;

[Route("api/")]
[ApiController]
// []
public class ProfileController(ITasksHubRepository repo, IConfiguration config) : ControllerBase
{
    private readonly ITasksHubRepository _repo = repo;
    private readonly IConfiguration _config = config;

    
    [HttpPost("update-username")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> UpdateUsername([FromBody] UpdateUsernameDto model )
    {
        if (string.IsNullOrWhiteSpace(model.Email) && string.IsNullOrWhiteSpace(model.Username))
            return BadRequest("Values can't be empty");

        ApplicationUser? user = await _repo.GetUserByEmailAsync(model.Email);
        if (user == null) return NotFound("User not found");

        user.UserName = model.Username;

        bool updated = await _repo.UpdateUserAsync(user);
        if (!updated)
            return BadRequest("Failed to update username");

        return Ok(new {newUserName = user.UserName});


    }
    
    [HttpPost("change-password")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
    {
        if (string.IsNullOrWhiteSpace(model.Email) && string.IsNullOrWhiteSpace(model.OldPassword) && string.IsNullOrWhiteSpace(model.NewPassword))
            return BadRequest("Values can't be empty");

        ApplicationUser? user = await _repo.GetUserByEmailAsync(model.Email);
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
    public async Task<IActionResult> UpdateImage([FromForm] UpdateImageDto model )
    {
        if (string.IsNullOrWhiteSpace(model.Email))
            return BadRequest("Invalid email.");

        ApplicationUser? user = await _repo.GetUserByEmailAsync(model.Email);
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
                return BadRequest("Failed to update user refresh token");

            return Ok(new {imageUrl = user.ProfilePicture});
        }
        return BadRequest("Empty file");
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