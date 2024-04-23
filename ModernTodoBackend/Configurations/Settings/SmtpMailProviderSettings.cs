namespace ModernTodoBackend.Settings;

public class SmtpMailProviderSettings
{
    // This class is used to bind smtp mail provider 
    public string SmtpServer { get; set; } = string.Empty;
    public int Port { get; set; }
    public string Sender { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
}