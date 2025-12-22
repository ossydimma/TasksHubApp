using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using MimeKit;
using System.Net.Mail;
using System.Text;
using MailKit.Net.Smtp;
using MailKit.Security;

namespace TasksHubServer.Services
{
    public class EmailSender(IConfiguration config)
    {
        private readonly IConfiguration _config = config;

        public async Task SendEmail(string userEmail, string subject, string body)
        {

            string? email = _config["EmailSettings:Email"];
            string? password = _config["EmailSettings:Password"];

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
                await client.ConnectAsync("smtp.gmail.com", 465, SecureSocketOptions.SslOnConnect);

                // Authenticate using your email and password
                await client.AuthenticateAsync(email, password);
                // Send the email
                await client.SendAsync(message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
            }
            finally
            {
                // Disconnect from the SMTP server
                await client.DisconnectAsync(true);
            }


        }

        
    }
}
