
using System.ComponentModel.DataAnnotations;

namespace TasksHubServer.DTOs;

public class TaskDto
{
    [Required]
    public Guid Id { get; set; } 

    [Required]
    public string? Title { get; set; } = null!;

    [Required]
    public string? Category { get; set; } = null!;

    [Required]
    public string? Description { get; set; } = null!;
    [Required]
    public DateOnly? Deadline { get; set; }
    [Required]
    public DateTime CreationDate { get; set; }
    [Required]
    public bool Status { get; set; }
}

public class CreateTaskDto
{
    [Required]
    public string? Title { get; set; } = null!;
    public string? Category { get; set; } = null!;
    public string? Description { get; set; } = null!;
    public string? Deadline { get; set; } = null!;

}