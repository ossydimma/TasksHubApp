using MimeKit;
using MailKit.Security;

namespace TasksHubServer.Services
{
    public class EmailSender(IConfiguration config)
    {
        private readonly IConfiguration _config = config;

        public async Task SendEmail(string userEmail, string subject, string body)
        {
            
            string? user = _config["SMTP_USER"];
            string? pass = _config["SMTP_PASS"];
            string? host = _config["SMTP_HOST"];
            string? sender = _config["SMTP_FROM"];


            if (string.IsNullOrEmpty(pass))
            {
                Console.WriteLine("Error: Brevo SMTP Key is missing from configuration.");
                return;
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("TasksHub", sender));
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
                await client.ConnectAsync(host, 2525, SecureSocketOptions.StartTls);

                // Authenticate using your email and password
                await client.AuthenticateAsync(user, pass);

                // Send the email
                await client.SendAsync(message);
                Console.WriteLine("Email sent successfully via Brevo!");
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
