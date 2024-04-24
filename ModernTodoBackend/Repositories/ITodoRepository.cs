using System.Linq.Expressions;
using ModernTodoBackend.Models;

namespace ModernTodoBackend.Repositories;

public interface ITodoRepository : IDisposable
{
    public Task<IEnumerable<Todo>> GetAll();
    
    public Task<IEnumerable<Todo>> GetAllCompleted();
    
    public Task<Todo> Get(int id);
    
    public Task<Todo> Find(Expression<Func<Todo, bool>> predicate);
    
    public Task Add(Todo entity);
    
    public Task Update(Todo entity);
    
    public Task Remove(Todo entity);
}