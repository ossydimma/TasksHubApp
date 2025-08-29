
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TasksHubServer.Models;

public class UserRefreshToken
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Token { get; set; } = null!;
    public DateTime? TokenExpiryTime { get; set; } = null;

    [ForeignKey("UserId")]
    public Guid UserId { get; set; }
    
    [JsonIgnore]
    public ApplicationUser User { get; set; } = null!;
}