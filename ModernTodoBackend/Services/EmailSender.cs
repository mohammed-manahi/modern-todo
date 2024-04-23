using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using ModernTodoBackend.Settings;

namespace ModernTodoBackend.Services;

public class EmailSender : IEmailSender
{
    private readonly ILogger<EmailSender> _logger;
    private readonly IMailProviderService _mailProviderService;
    private readonly IOptions<SmtpMailProviderSettings> _smtpMailProviderSettings;

    public EmailSender(ILogger<EmailSender> logger, IMailProviderService mailProviderService,
        IOptions<SmtpMailProviderSettings> smtpMailProviderSettings)
    {
        _logger = logger;
        _mailProviderService = mailProviderService;
        _smtpMailProviderSettings = smtpMailProviderSettings;
    }

    public async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        // The implementation of identity IEmailSender interface's method signature SendEmailAsync
        var from = _smtpMailProviderSettings.Value.Sender;
        var emailMessage = new MailMessage(from, email, subject, htmlMessage);
        emailMessage.IsBodyHtml = true;
        try
        {
            await _mailProviderService.SendAsync(emailMessage.To.ToString(), emailMessage.Subject, emailMessage.Body);
        }
        catch (InvalidOperationException invalidOperationException)
        {
            _logger.LogError(invalidOperationException.Message);
        }
    }
}