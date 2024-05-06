using System.Reflection;
using System.Security.Claims;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ModernTodoBackend.Configurations.Services;
using ModernTodoBackend.Data;
using ModernTodoBackend.Models;
using ModernTodoBackend.Repositories;
using ModernTodoBackend.Services;
using ModernTodoBackend.Settings;
using IEmailSender = Microsoft.AspNetCore.Identity.UI.Services.IEmailSender;

var builder = WebApplication.CreateBuilder(args);

// Add json options to get related relations data
builder.Services.AddControllers()
    .AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Enable xml documentation in the swagger ui
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFile));
});

// Add database configurations to services DI container
builder.Services.AddDatabaseService(builder.Configuration);

// Add authorization to services DI container
builder.Services.AddAuthorization();

// Add identity api endpoints to service DI container
builder.Services.AddIdentityApiEndpoints<ApplicationUser>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
    options.SignIn.RequireConfirmedEmail = true;
}).AddEntityFrameworkStores<ApplicationDbContext>();

// Add mail provider to service DI container
builder.Services.AddTransient<IMailProviderService, MailProviderService>();
builder.Services.AddTransient<IEmailSender, EmailSender>();

// Add smtp mail provider configuration
builder.Services.Configure<SmtpMailProviderSettings>(builder.Configuration.GetSection("SmtpMailProvider"));

// Add todo repository to services DI container
builder.Services.AddScoped<ITodoRepository, TodoRepository>();

// Add cors policy
const string AllowedOrigins = "_AllowedOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowedOrigins, policy =>
    {
        policy.WithOrigins("http://localhost:6060", "https://localhost:6060");
        policy.AllowAnyMethod();
        policy.AllowAnyHeader();
        policy.AllowCredentials();
    });
});

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

// Add cors middleware to pipeline
app.UseCors(AllowedOrigins);

// Add identity endpoints to middleware pipeline
app.MapGroup("/Account").MapIdentityApi<ApplicationUser>();

app.MapPost("Account/logout", async (SignInManager<ApplicationUser> signInManager) =>
{
    // Additional endpoint for the base identity endpoints to log out user
    await signInManager.SignOutAsync();
    return Results.Ok();
}).RequireAuthorization();

app.MapGet("Account/getAuthenticatedUserEmail", (ClaimsPrincipal user) =>
{
    // Additional endpoint for the base identity endpoints to get authenticated user email
    var userEmail = user.FindFirstValue(ClaimTypes.Email) ??
                    throw new InvalidOperationException("User email can not be found");
    return Results.Json(new { email = userEmail });
}).RequireAuthorization();

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