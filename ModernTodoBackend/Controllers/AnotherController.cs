using Microsoft.AspNetCore.Mvc;

namespace ModernTodoBackend.Controllers;

[ApiController]
[Route("[controller]")]
public class AnotherController: ControllerBase
{
    [HttpGet]
    public string Index()
    {
        return "Hello";
    }
}