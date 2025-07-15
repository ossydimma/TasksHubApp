

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TasksHubServer.Models;
public class UserDocument
{
    public Guid Id {get; set;} = Guid.NewGuid();
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Title { get; set;} = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;

    public string Content { get; set;} = string.Empty;

    [ForeignKey("UserId")]
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set;} = null!;
}