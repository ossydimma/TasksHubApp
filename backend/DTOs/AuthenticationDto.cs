using System.ComponentModel.DataAnnotations;

namespace TasksHubServer.DTOs;

public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool RememberMe { get; set; }
}

public class SignupDto
{
    public string Fullname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    [RegularExpression(@"^(?=.*[A-Z])(?=.*\d).{6,}$", ErrorMessage = "Password must be at least 6 characters, contain at least one uppercase letter and one number.")]
    public string Password { get; set; } = string.Empty;
}

public class VerifyOtpDto
{
    public string Email { get; set; } = string.Empty;
    public string SubmittedOtp { get; set; } = string.Empty;
    public string Aim { get; set; } = string.Empty;
}

public class GoogleAuthDto
{
    public string Credential { get; set; } = string.Empty;
}


