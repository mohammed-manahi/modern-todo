using System.ComponentModel.DataAnnotations;

namespace ModernTodoBackend.DTO;

public class TodoDTO
{
    // DTO binder for mapping the updatable properties of todo model
    [Required] public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; } 
}