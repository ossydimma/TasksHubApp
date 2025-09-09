using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace TasksHubServer.Models;
    public class ApplicationUser
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(100, ErrorMessage = "Full Name cannot be longer than 100 characters.")]
        public string FullName { get; set; } = string.Empty;
        public string? UserName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; } = string.Empty;
        public string? ProfilePicture { get; set; } = null;
        public string? ProfileImagePublicId { get; set; } = null;
        public string? GoogleSub { get; set; } = null;
        [Required]
        [EmailAddress (ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; } = string.Empty;
        public bool IsEmailVerified { get; set; }
        public byte[]? PasswordHash { get; set; } = null;
        public byte[]? PasswordSalt { get; set; } = null;

        [JsonIgnore]
        public List<UserRefreshToken> RefreshTokens { get; set; } = [];
        [JsonIgnore]
        public virtual List<UserDocument>UserDocument { get; set; } = [];
        [JsonIgnore]
        public virtual List<UserTask> UserTasks { get; set; } = [];

    }
