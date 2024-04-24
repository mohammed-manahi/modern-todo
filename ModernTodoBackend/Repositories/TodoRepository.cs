using System.Data.Common;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using ModernTodoBackend.Data;
using ModernTodoBackend.Models;

namespace ModernTodoBackend.Repositories;

public class TodoRepository : ITodoRepository
{
    private readonly ApplicationDbContext _dbContext;

    public TodoRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Todo>> GetAll()
    {
        try
        {
            return await _dbContext.Todos.Include(u => u.ApplicationUser).AsNoTracking().ToListAsync();
        }
        catch (DbException dbException)
        {
            throw new Exception("An Error occured while getting the data", dbException);
        }
    }

    public async Task<IEnumerable<Todo>> GetAllCompleted()
    {
        try
        {
            return await _dbContext.Todos.Include(u => u.ApplicationUser).Where(t => t.IsCompleted == true)
                .AsNoTracking()
                .ToListAsync();
        }
        catch (DbException dbException)
        {
            throw new Exception("An Error occured while getting the data", dbException);
        }
    }

    public async Task<Todo> Get(int id)
    {
        try
        {
            return await _dbContext.Todos.Include(u => u.ApplicationUser).FirstOrDefaultAsync(t => t.Id == id);
        }
        catch (InvalidOperationException invalidOperationException)
        {
            throw new Exception("An error occured while looking up the data", invalidOperationException);
        }
        catch (DbException dbException)
        {
            throw new Exception("An Error occured while getting the data", dbException);
        }
    }

    public async Task<Todo> Find(Expression<Func<Todo, bool>> predicate)
    {
        try
        {
            return await _dbContext.Todos.Where(predicate).FirstOrDefaultAsync();
        }
        catch (InvalidOperationException invalidOperationException)
        {
            throw new Exception("An error occured while querying the data", invalidOperationException);
        }
        catch (DbException dbException)
        {
            throw new Exception("An Error occured while getting the data", dbException);
        }
    }

    public async Task Add(Todo entity)
    {
        try
        {
            await _dbContext.Todos.AddAsync(entity);
        }
        catch (DbException dbException)
        {
            throw new Exception("An Error occured while creating the new data", dbException);
        }
    }

    public async Task Update(Todo entity)
    {
        try
        {
            _dbContext.Update(entity);
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException dbUpdateException)
        {
            throw new Exception("An error occured while updating the data", dbUpdateException);
        }
    }

    public async Task Remove(Todo entity)
    {
        try
        {
            _dbContext.Todos.Remove(entity);
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException dbUpdateException)
        {
            throw new Exception("An error occured while deleting the data", dbUpdateException);
        }
    }

    public void Dispose()
    {
        _dbContext.Dispose();
    }
}