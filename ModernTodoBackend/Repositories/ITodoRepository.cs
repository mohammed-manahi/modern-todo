using System.Linq.Expressions;
using ModernTodoBackend.DTO;
using ModernTodoBackend.Models;

namespace ModernTodoBackend.Repositories;

public interface ITodoRepository : IDisposable
{
    public Task<IEnumerable<Todo>> GetAll(int pageIndex, int pageSize, string sortColumn, string sortOrder,
        string filterQuery);

    public Task<IEnumerable<Todo>> GetAllCompleted(int pageIndex, int pageSize, string sortColumn, string sortOrder,
        string filterQuery);

    public Task<Todo> Get(int id);

    public Task<Todo> Find(Expression<Func<Todo, bool>> predicate);

    public Task Add(TodoDTO entityDto);

    public Task Update(TodoDTO entityDto);

    public Task Remove(int id);

    public Task<int> SaveAsync();
}