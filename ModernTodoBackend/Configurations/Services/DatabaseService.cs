using Microsoft.EntityFrameworkCore;
using ModernTodoBackend.Data;

namespace ModernTodoBackend.Configurations.Services;

public static class DatabaseService
{
    public static IServiceCollection AddDatabaseService(this IServiceCollection serviceCollection,
        IConfiguration configuration)
    {
       // Extension method to register database connection service
        var defaultDbConnection = configuration.GetConnectionString("Default") ??
                                  throw new InvalidOperationException(
                                      "Default database connection string was not found");
        serviceCollection.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseSqlServer(defaultDbConnection);
        });
        return serviceCollection;
    }
}