using System.ComponentModel.DataAnnotations;

namespace TasksHubServer.DTOs;

public class UpdateImageDto
{
    [Required]
    public IFormFile File { get; set; } 

    [Required]
    public string Email { get; set; } = string.Empty;

}

public class UpdateUsernameDto 
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; } = string.Empty;
}

public class ChangePasswordDto
{
    [Required]
    public string Email {get; set;} = string.Empty;

    [Required]
    public string OldPassword { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^(?=.*[A-Z])(?=.*\d).{6,}$", ErrorMessage = "Password must be at least 6 characters, contain at least one uppercase letter and one number.")]
    public string NewPassword { get; set; } = string.Empty;
}