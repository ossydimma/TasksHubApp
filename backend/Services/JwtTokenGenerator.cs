using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TasksHubServer.Models;

namespace TasksHubServer.Services;

public static class JwtTokenGenerator
{
    public static string GenerateToken(ApplicationUser user, IConfiguration config)
    {
        var jwtSettings = config.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("id", user.Id.ToString()),
            new Claim("fullName", user.FullName),
            new Claim("userName", user.UserName ?? string.Empty),
            new Claim ("imageSrc", user.ProfilePicture ?? string.Empty)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["ExpiryInMinutes"])),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public static UserRefreshToken GenerateRefreshToken(Guid userId)
    {
        var randomBytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        
        UserRefreshToken refreshToken = new()
        {
            Token = Convert.ToBase64String(randomBytes),
            TokenExpiryTime = DateTime.UtcNow.AddDays(7),
            UserId = userId
        };
        return refreshToken;
    }

    
}