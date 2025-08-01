
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
    [StringLength(200, MinimumLength = 3)]
    public string Description { get; set; } = string.Empty;
    public DateOnly? Deadline { get; set; } = null;
    public DateTime Created_at { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Pending";

    [ForeignKey("UserId")]
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;

}