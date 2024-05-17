using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ModernTodoBackend.Controllers;
using ModernTodoBackend.DTO;
using ModernTodoBackend.Models;
using ModernTodoBackend.Repositories;

namespace ModernTodoBackend.Tests;

public class TodoEndpointsTests
{
    private readonly ITodoRepository _todoRepository;
    private readonly ILogger<TodoController> _logger;

    public TodoEndpointsTests()
    {
        _todoRepository = A.Fake<ITodoRepository>();
        _logger = A.Fake<ILogger<TodoController>>();
    }

    [Fact]
    public async Task TodoEndpoints_GetAll_ShouldReturnsStatusCode200OnSuccessfulRetrieval()
    {
        // Arrange
        var todoRequest = A.Fake<TodoRequestDTO>();
        var todos = A.Fake<IEnumerable<TodoDTO>>();
        A.CallTo(() => _todoRepository.GetAll(todoRequest))
            .Returns(Task.FromResult<IEnumerable<Todo>>(new List<Todo>()));
        var controller = new TodoController(_logger, _todoRepository);

        // Act
        var result = await controller.GetAll(todoRequest);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task TodoEndpoints_Get_ShouldReturnsATodoOnSuccessfulRetrieval()
    {
        // Arrange
        var todoId = 1;
        var todo = A.Fake<Todo>();
        A.CallTo(() => _todoRepository.Get(todoId)).Returns(Task.FromResult(todo));
        var controller = new TodoController(_logger, _todoRepository);

        // Act
        var result = await controller.Get(todoId);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task TodoEndpoints_Post_ShouldReturnsStatusCode204OnSuccessfulCreate()
    {
        // Arrange
        var newTodo = A.Fake<TodoDTO>();
        A.CallTo(() => _todoRepository.Add(newTodo)).Returns(Task.CompletedTask);
        var controller = new TodoController(_logger, _todoRepository);

        // Act
        var result = await controller.Post(newTodo);

        // Assert
        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task TodoEndpoints_Put_ShouldReturnsStatusCode200OnSuccessfulUpdate()
    {
        // Arrange
        var todo = A.Fake<TodoDTO>();
        A.CallTo(() => _todoRepository.Update(todo)).Returns(Task.FromResult(todo));
        var controller = new TodoController(_logger, _todoRepository);

        // Act
        var result = await controller.Put(todo.Id, todo);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }
    
    [Fact]
    public async Task TodoEndpoints_Delete_ShouldReturnsStatusCode200OnSuccessfulDelete()
    {
        // Arrange
        var todoId = 1;
        var todo = A.Fake<TodoDTO>();
        A.CallTo(() => _todoRepository.Remove(todoId)).Returns(Task.CompletedTask);
        var controller = new TodoController(_logger, _todoRepository);

        // Act
        var result = await controller.Delete(todoId);

        // Assert
        result.Should().BeOfType<OkResult>();
    }
}