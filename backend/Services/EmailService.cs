using System.Net;
using System.Net.Mail;

namespace backend.Services.Interfaces;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string to, string subject, string message, CancellationToken cancellationToken)
    {
        var fromAddress = new MailAddress(_configuration["Email:From"], "Your App Name");
        var toAddress = new MailAddress(to);
        
        using var smtp = new SmtpClient
        {
            Host = _configuration["Email:SmtpHost"],  
            Port = int.Parse(_configuration["Email:SmtpPort"]),
            EnableSsl = true,
            Credentials = new NetworkCredential(
                _configuration["Email:Username"], 
                _configuration["Email:Password"])
        };

        using var mailMessage = new MailMessage(fromAddress, toAddress)
        {
            Subject = subject,
            Body = message,
            IsBodyHtml = true
        };

        await smtp.SendMailAsync(mailMessage);
    }
}