using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using ModernTodoBackend.Settings;

namespace ModernTodoBackend.Services;

public class MailProviderService : IMailProviderService
{
    private readonly ILogger<MailProviderService> _logger;
    private readonly IOptions<SmtpMailProviderSettings> _smtpMailProviderSettings;

    public MailProviderService(IOptions<SmtpMailProviderSettings> smtpMailProviderSettings,
        ILogger<MailProviderService> logger)
    {
        _logger = logger;
        _smtpMailProviderSettings = smtpMailProviderSettings;
    }

    public async Task SendAsync(string to, string subject, string body)
    {
        // Send email using smtp provider using smtp client context
        var host = _smtpMailProviderSettings.Value.SmtpServer;
        var port = _smtpMailProviderSettings.Value.Port;
        var user = _smtpMailProviderSettings.Value.Sender;
        var password = _smtpMailProviderSettings.Value.ApiKey;

        var emailMessage = new MailMessage(user, to, subject, body);

        using (var emailClient = new SmtpClient(host, port))
        {
            emailClient.Credentials = new NetworkCredential(user, password);
            emailClient.EnableSsl = true;
            try
            {
                await emailClient.SendMailAsync(emailMessage);
            }
            catch (SmtpException smtpException)
            {
                _logger.LogError(smtpException.Message);
            }
        }
    }
}