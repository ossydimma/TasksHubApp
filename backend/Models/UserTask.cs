
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TasksHubServer.Models;

public class UserTask
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string? Category { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;
    public DateOnly? Deadline { get; set; } = null;
    public bool Status { get; set; } = false;

    [ForeignKey("UserId")]
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
}