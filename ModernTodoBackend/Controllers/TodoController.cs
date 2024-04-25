using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModernTodoBackend.DTO;
using ModernTodoBackend.Repositories;

namespace ModernTodoBackend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TodoController : ControllerBase
{
    // Todo: crud operation, documentation, add documentation to swagger 
    private readonly ILogger<TodoController> _logger;
    private readonly ITodoRepository _todoRepository;

    public TodoController(ILogger<TodoController> logger, ITodoRepository todoRepository)
    {
        // Constructor injection for logger and todo repository
        _logger = logger;
        _todoRepository = todoRepository;
    }


    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll([FromQuery] int pageIndex = 0, int pageSize = 10,
        string sortColumn = "Name",
        string sortOrder = "ASC", string filterQuery = null)
    {
        try
        {
            var result = await _todoRepository.GetAll(pageIndex, pageSize, sortColumn, sortOrder, filterQuery);
            if (result == null) return BadRequest();
            return Ok(result);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception.Message);
            return BadRequest();
        }
    }

    [HttpGet("GetAllCompleted")]
    public async Task<IActionResult> GetAllCompleted([FromQuery] int pageIndex = 0, int pageSize = 10,
        string sortColumn = "Name",
        string sortOrder = "ASC", string filterQuery = null)
    {
        try
        {
            var result = await _todoRepository.GetAllCompleted(pageIndex, pageSize, sortColumn, sortOrder, filterQuery);
            if (result == null) return BadRequest();
            return Ok(result);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception.Message);
            return BadRequest();
        }
    }

    [HttpGet("Get/{id}")]
    public async Task<IActionResult> Get([FromRoute] int id)
    {
        try
        {
            var result = await _todoRepository.Get(id);
            if (result == null) return NotFound();
            return Ok(result);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception.Message);
            return NotFound();
        }
    }

    [HttpPost("Create")]
    public async Task<IActionResult> Post([FromBody] TodoDTO entityDto)
    {
        try
        {
            if (!ModelState.IsValid) return Problem();
            await _todoRepository.Add(entityDto);
            return NoContent();
        }
        catch (Exception exception)
        {
            _logger.LogError(exception.Message);
            return BadRequest();
        }
    }

    [HttpPut("Update")]
    public async Task<IActionResult> Put([FromBody] TodoDTO entityDto)
    {
        try
        {
            if (entityDto == null) return BadRequest();
            if (!ModelState.IsValid) return Problem();
            await _todoRepository.Update(entityDto);
            return Ok();
        }
        catch (Exception exception)
        {
            _logger.LogError(exception.Message);
            return BadRequest();
        }
    }

    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        try
        {
            if (id == null || id == 0) return NotFound();
            await _todoRepository.Remove(id);
            return Ok();
        }
        catch (Exception exception)
        {
            _logger.LogError(exception.Message);
            return BadRequest();
        }
    }
}