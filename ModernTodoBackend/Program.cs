using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ModernTodoBackend.Configurations.Services;
using ModernTodoBackend.Data;
using ModernTodoBackend.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add database configurations to services DI container
builder.Services.AddDatabaseService(builder.Configuration);

// Add authorization to services DI container
builder.Services.AddAuthorization();

// Add identity api endpoints to service DI container
builder.Services.AddIdentityApiEndpoints<ApplicationUser>().AddEntityFrameworkStores<ApplicationDbContext>();

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

// Add identity endpoints to middleware pipeline
app.MapGroup("/Account").MapIdentityApi<ApplicationUser>();

app.MapGet("Account/logout", async (SignInManager<ApplicationUser> signInManager) =>
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