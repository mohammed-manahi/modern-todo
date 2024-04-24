using Microsoft.AspNetCore.Identity;

namespace ModernTodoBackend.Models;

public class ApplicationUser : IdentityUser
{
    // Associate user model with todo model in one-to-many relationship
    public ICollection<Todo>? Todos { get; set; }
    
}