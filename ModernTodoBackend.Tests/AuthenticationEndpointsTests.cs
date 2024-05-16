using System.Diagnostics;
using System.Net;
using System.Text;
using FakeItEasy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using ModernTodoBackend.Repositories;
using Newtonsoft.Json;

namespace ModernTodoBackend.Tests;

public class AuthenticationEndpointsTests
{
    private readonly HttpClient _httpClient;
    private const string BaseAddress = "https://localhost:7092/";
    private const string UserEmail = "testuser@test.com";
    private const string UserPassword = "Password@1234567890";

    public AuthenticationEndpointsTests()
    {
        // Inject http client to make api calls for identity api endpoints
        _httpClient = new HttpClient { BaseAddress = new Uri(BaseAddress) };
    }

    [Fact]
    public async Task IdentityApiEndpoints_Register_ShouldReturnStatusCode200OnSuccessfulRegistration()
    {
        // Arrange
        var registerEndpointUrl = "account/register";
        var registerData = new { Email = UserEmail, Password = UserPassword };
        string jsonContent = JsonConvert.SerializeObject(registerData);

        // Act
        var registrationResponse = await _httpClient.PostAsync($"{BaseAddress}{registerEndpointUrl}",
            new StringContent(jsonContent, Encoding.UTF8, "application/json"));

        // Assert
        Assert.Equal(HttpStatusCode.OK, registrationResponse.StatusCode);
    }

    [Fact]
    public async Task IdentityApiEndpoints_Login_ShouldReturnsStatusCode401OnUnconfirmedEmail()
    {
        // Arrange
        var loginEndpointUrl = "account/login?useCookies=false&useSessionCookies=false";
        var loginData = new { Email = UserEmail, Password = UserPassword };
        string jsonContent = JsonConvert.SerializeObject(loginData);
        
        // Act
        var loginResponse = await _httpClient.PostAsync($"{BaseAddress}{loginEndpointUrl}",
            new StringContent(jsonContent, Encoding.UTF8, "application/json"));
        
        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, loginResponse.StatusCode);
    }
    
    [Fact]
    public async Task IdentityApiEndpoints_Login_ShouldReturnsBearerTokenCredentials()
    {
        // Arrange
        var loginEndpointUrl = "account/login?useCookies=false&useSessionCookies=false";
        var loginData = new { Email = UserEmail, Password = UserPassword };
        string jsonContent = JsonConvert.SerializeObject(loginData);
        
        // Act
        var loginResponse = await _httpClient.PostAsync($"{BaseAddress}{loginEndpointUrl}",
            new StringContent(jsonContent, Encoding.UTF8, "application/json"));
        
        // Assert
        var responseBody = await loginResponse.Content.ReadAsStringAsync();
        dynamic jsonData = JsonConvert.DeserializeObject(responseBody);
        Assert.NotNull(jsonData);
        Assert.Equal("Bearer", (string)jsonData.tokenType);
        Assert.Contains("accessToken", jsonData);
    }
}