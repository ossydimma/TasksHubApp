
using System.Collections.Concurrent;

namespace TasksHubServer.Services
{
    public class OTPService
    {
        private readonly ConcurrentDictionary<string, (string Otp, DateTime Expiry)> _otpStore = new();
        public string GenerateAndStoreOtp(string userEmail, int length = 6)
        {
            const string Chars = "0123456789";
            Random? random = new();
            var otp = new char[length];


            for (int i = 0; i < length; i++)
            {
                otp[i] = Chars[random.Next(Chars.Length)];
            }

            string otpCode = new(otp);

            DateTime expiry = DateTime.UtcNow.AddMinutes(5);

            _otpStore[userEmail] = (otpCode, expiry);

            return otpCode;
        }

        public bool VerifyOtp(string userEmail, string submittedOtp)
        {
            if (_otpStore.TryGetValue(userEmail, out var otpData))
            {
                // Check if OTP is valid and not expired
                if (otpData.Otp == submittedOtp && otpData.Expiry > DateTime.UtcNow)
                {
                    // Remove OTP after successful verification
                    _otpStore.TryRemove(userEmail, out _);
                    return true;
                }
            }

            return false; // Invalid or expired OTP
        }
    }
}
