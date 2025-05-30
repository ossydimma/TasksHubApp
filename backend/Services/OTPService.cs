﻿
using System.Collections.Concurrent;
using System.Text;
using Microsoft.Extensions.Caching.Distributed;

namespace TasksHubServer.Services
{
    public class OTPService(IDistributedCache distributedCache)
    {
        private readonly IDistributedCache _distributedCache = distributedCache;
        private readonly DistributedCacheEntryOptions _cacheOptions = new DistributedCacheEntryOptions()
            .SetSlidingExpiration(TimeSpan.FromMinutes(5));

        private static readonly Random _random = new();
        public async Task<string> GenerateAndStoreOtp(string userEmail, int length = 6)
        {
            string normlizedEmail = NormalizedEmail(userEmail);
            string key = $"otp:{normlizedEmail}";

            const string digits = "0123456789";
            StringBuilder otpBuilder = new(length);
            Random? random = new();
            var otp = new char[length];


            for (int i = 0; i < length; i++)
            {
                otpBuilder.Append(digits[_random.Next(digits.Length)]);
            }

            string otpCode = otpBuilder.ToString();

            await _distributedCache.SetStringAsync(key, otpCode, _cacheOptions);

            return otpCode;
        }

        public async Task<bool> VerifyOtp(string userEmail, string submittedOtp)
        {
            string normlizedEmail = NormalizedEmail(userEmail);
            string key = $"otp:{normlizedEmail}";
            string? storedOtp = await _distributedCache.GetStringAsync(key);

            // Check if OTP is valid and not null
            if (storedOtp != null && storedOtp == submittedOtp)
            {
                // Remove OTP after successful verification
                await _distributedCache.RemoveAsync(key);
                return true;
            }

            return false; // Invalid or expired OTP
        }

        private static string NormalizedEmail(string email) => email.Trim().ToLowerInvariant();
    }
}
