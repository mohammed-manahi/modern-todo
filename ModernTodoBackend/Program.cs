using Microsoft.EntityFrameworkCore;
using ModernTodoBackend.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add database configurations to services DI container
var defaultDbConnection = builder.Configuration.GetConnectionString("Default") ??
                          throw new InvalidOperationException("Default database connection string was not found");
builder.Services.AddDbContext<ApplicationDbContext>(options => { options.UseSqlServer(defaultDbConnection);});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/error");
}

app.UseHttpsRedirection();

app.UseAuthorization();

// Map route for generic exception handler 
app.MapGet("/error", () =>
{
    app.Logger.LogError("Fallback: an error occurred");
    Results.Problem("An error occurred. Please try again later.");
});

app.MapControllers();

app.Run();