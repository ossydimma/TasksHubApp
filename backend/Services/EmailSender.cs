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
        // static string[] Scopes = { GmailService.Scope.GmailSend };
        // static string ApplicationName = "TasksHub";

        public async Task SendEmail(string userEmail, string subject, string body)
        {
            //UserCredential credential;

            //using FileStream? stream = new ("credential.json", FileMode.Open, FileAccess.Read);
            //credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
            //    GoogleClientSecrets.FromStream(stream).Secrets,
            //    Scopes,
            //    "user",
            //    CancellationToken.None,
            //    new FileDataStore("token.json", true)
            //);

            //GmailService? service = new (new BaseClientService.Initializer()
            //{
            //    HttpClientInitializer = credential,
            //    ApplicationName = ApplicationName,
            //});


            //create the email MialMessage

            //MailMessage message = new()
            //{
            //    From = new MailAddress("innovationjaygroup@gmail.com"),
            //    Subject = subject,
            //    Body = body,
            //    IsBodyHtml = false
            //};

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
                await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);

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
            
            //message.To.Add(userEmail);

            ////Convert the email to a raw message
            //var mimeMessage = MimeMessage.CreateFromMailMessage(message);
            //Message rawMessage = new()
            //{
            //    Raw = Base64UrlEncode(mimeMessage.ToString())
            //};

            ////SendAs the email
            //service.Users.Messages.Send(rawMessage, "me").Execute();


        }

        //private static string Base64UrlEncode(string input)
        //{
        //    var bytes = Encoding.UTF8.GetBytes(input);
        //    return Convert.ToBase64String(bytes)
        //        .Replace("+", "-")
        //        .Replace("/", "_")
        //        .Replace("=", "");
        //}

        
    }
}
