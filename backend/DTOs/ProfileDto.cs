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