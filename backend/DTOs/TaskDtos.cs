
using System.ComponentModel.DataAnnotations;

namespace TasksHubServer.DTOs;

public class CreateTaskDto
{
    [Required]
    public string? Title { get; set; } = null!;
    public string? Category { get; set; } = null!;
    public string? Description { get; set; } = null!;
    public string? Deadline { get; set; } = null!;

}