using MimeKit;
using MailKit.Security;

namespace TasksHubServer.Services
{
    public class EmailSender(IConfiguration config)
    {
        private readonly IConfiguration _config = config;

        public async Task SendEmail(string userEmail, string subject, string body)
        {

            string? email = _config["EmailSettings:Email"];
            string? apiKey = _config["EmailSettings:ApiKey"];

            if (string.IsNullOrEmpty(apiKey))
            {
                Console.WriteLine("Error: Resend API Key is missing from configuration.");
                return;
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("TasksHub", email));
            message.To.Add(MailboxAddress.Parse(userEmail));
            message.Subject = subject;
            message.Body = new TextPart("html")
            {
                Text = body
            };

            using var client = new MailKit.Net.Smtp.SmtpClient();
            try
            {
                // Connect to the SMTP server
                // await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                await client.ConnectAsync("smtp.resend.com", 465, SecureSocketOptions.SslOnConnect);

                // Authenticate using your email and password
                // await client.AuthenticateAsync(email, password);
                await client.AuthenticateAsync("resend", apiKey);
                // Send the email
                await client.SendAsync(message);
                Console.WriteLine("Email sent successfully via Resend!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email Failed. Type: {ex.GetType().Name}, Message: {ex.Message}");
            }
            finally
            {
                // Disconnect from the SMTP server
                await client.DisconnectAsync(true);
            }


        }

        
    }
}
