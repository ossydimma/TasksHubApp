
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
    public string? Status { get; set; } = null!;
}

public class CreateTaskDto
{
    [Required]
    public string? Title { get; set; } = null!;
    public string? Category { get; set; } = null!;
    public string? Description { get; set; } = null!;
    public string? Deadline { get; set; } = null!;

}

public class FilterTaskDto
{
    public string? Category { get; set; }
    public DateOnly? Deadline { get; set; }
    public DateOnly? Created { get; set; }
    public string? Status { get; set; }
}