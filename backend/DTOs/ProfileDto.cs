using System.ComponentModel.DataAnnotations;

namespace TasksHubServer.DTOs;

public class UpdateImageDto
{
    [Required]
    public IFormFile File { get; set; } = null!;

}

public class UpdateUsernameDto 
{
    [Required]
    public string Username { get; set; } = null!;

}

public class ChangePasswordDto
{

    [Required]
    public string OldPassword { get; set; } = null!;

    [Required]
    [RegularExpression(@"^(?=.*[A-Z])(?=.*\d).{6,}$", ErrorMessage = "Password must be at least 6 characters, contain at least one uppercase letter and one number.")]
    public string NewPassword { get; set; } = null!;
}

public class ChangeGoogleAccountDto
{
    [Required]
    public string Token { get; set; } = null!;
}

public class VerifyEmailChangeDto
{
    [Required]
    [EmailAddress(ErrorMessage = "Invalid Email Address")]
    public string Email { get; set; } = null!;
}

public class VerifyEmailDto
{
    [Required]
    [EmailAddress (ErrorMessage = "Invalid Email Address")]
    public string NewEmail { get; set; } = null!;

    [Required]
    [EmailAddress (ErrorMessage = "Invalid Email Address")]
    public string OldEmail { get; set; } = null!;

    [Required]
    public string Otp { get; set; } = null!;
}