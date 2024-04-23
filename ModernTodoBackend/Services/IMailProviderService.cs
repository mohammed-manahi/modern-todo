namespace ModernTodoBackend.Services;

public interface IMailProviderService
{
    public Task SendAsync(string to, string subject, string body);
}