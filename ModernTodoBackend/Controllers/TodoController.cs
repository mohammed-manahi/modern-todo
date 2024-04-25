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
    
    /// <summary>
    /// Gets a list of all todos
    /// </summary>
    /// <remarks>
    /// Request: GET api/Todo/GetAll
    /// </remarks>
    /// <returns>An enumerable collection of todos</returns>
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

    /// <summary>
    /// Gets a list of all completed todos
    /// </summary>
    /// <remarks>
    /// Request: GET api/Todo/GetAllCompleted
    /// </remarks>
    /// <returns>An enumerable collection of completed todos</returns>
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
    
    /// <summary>
    /// Gets a single todo using id route parameter
    /// </summary>
    /// <remarks>
    /// Request: GET api/Todo/Get/:id
    /// </remarks>
    /// <returns>A singular todo</returns>
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
    
    /// <summary>
    /// Create a new todo 
    /// </summary>
    /// <remarks>
    /// Request: POST api/Todo/Create
    /// </remarks>
    /// <returns>No returns</returns>
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
    
    /// <summary>
    /// Update an existing todo 
    /// </summary>
    /// <remarks>
    /// Request: PUT api/Todo/Update/:id
    /// </remarks>
    /// <returns>A singular todo</returns>
    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Put([FromRoute] int id, [FromBody] TodoDTO entityDto)
    {
        try
        {
            if (entityDto == null) return BadRequest();
            if (entityDto.Id != id) return NotFound();
            if (!ModelState.IsValid) return Problem();
            await _todoRepository.Update(entityDto);
            return Ok(entityDto);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception.Message);
            return BadRequest();
        }
    }
    
    /// <summary>
    /// Delete an existing to do (soft delete)
    /// </summary>
    /// <remarks>
    /// Request: DELETE api/Todo/Delete/:id
    /// </remarks>
    /// <returns>No returns</returns>
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