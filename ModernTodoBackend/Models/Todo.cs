namespace ModernTodoBackend.Models;

public class Todo : BaseModel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; } = false;
    public bool IsDeleted { get; set; } = false;
    
    // Associate todo model with application user model in many-to-one relationship
    public string UserId { get; set; }
    public ApplicationUser ApplicationUser { get; set; }
}