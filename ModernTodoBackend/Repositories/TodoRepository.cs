using System.Data.Common;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using ModernTodoBackend.Data;
using ModernTodoBackend.Models;
using System.Linq.Dynamic.Core;
using ModernTodoBackend.DTO;

namespace ModernTodoBackend.Repositories;

public class TodoRepository : ITodoRepository
{
    private readonly ApplicationDbContext _dbContext;

    public TodoRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Todo?>> GetAll(int pageIndex = 0, int pageSize = 10, string sortColumn = "Name",
        string sortOrder = "ASC", string filterQuery = null)
    {
        try
        {
            var query = _dbContext.Todos.AsQueryable();
            if (!string.IsNullOrEmpty(filterQuery))
            {
                // Handle existing filter query
                query = query
                    .Where(q => q.Name.ToLower().Contains(filterQuery.ToLower()) ||
                                q.Description.ToLower().Contains(filterQuery.ToLower()));
                query = query
                    .Include(u => u.ApplicationUser)
                    .AsNoTracking();
            }

            var recordCount = await query.CountAsync();
            // Handle empty filter query
            query = query
                .Include(u => u.ApplicationUser)
                .OrderBy($"{sortColumn} {sortOrder}")
                .Skip(pageIndex * pageSize)
                .Take(pageSize)
                .AsNoTracking();
            return query;
        }
        catch (DbException dbException)
        {
            throw new Exception("An Error occured while getting the data", dbException);
        }
    }

    public async Task<IEnumerable<Todo?>> GetAllCompleted(int pageIndex = 0, int pageSize = 10,
        string sortColumn = "Name",
        string sortOrder = "ASC", string filterQuery = null)
    {
        try
        {
            // Handle existing filter query for completed tasks
            var query = _dbContext.Todos.AsQueryable();
            if (!string.IsNullOrEmpty(filterQuery))
            {
                query = query
                    .Where(t => t.IsCompleted == true)
                    .Where(q => q.Name.ToLower().Contains(filterQuery.ToLower()) ||
                                q.Description.ToLower().Contains(filterQuery.ToLower()));
                query = query
                    .Include(u => u.ApplicationUser)
                    .AsNoTracking();
            }

            var recordCount = await query.CountAsync();
            // Handle empty filter query for completed tasks
            query = query
                .Where(t => t.IsCompleted == true).Include(u => u.ApplicationUser)
                .OrderBy($"{sortColumn} {sortOrder}")
                .Skip(pageIndex * pageSize)
                .Take(pageSize)
                .AsNoTracking();
            return query;
        }
        catch (DbException dbException)
        {
            throw new Exception("An Error occured while getting the data", dbException);
        }
    }

    public async Task<Todo?> Get(int id)
    {
        try
        {
            return await _dbContext.Todos
                .Include(u => u.ApplicationUser)
                .FirstOrDefaultAsync(t => t.Id == id);
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

    public async Task<Todo?> Find(Expression<Func<Todo?, bool>> predicate)
    {
        try
        {
            return await _dbContext.Todos
                .Where(predicate)
                .FirstOrDefaultAsync();
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

    public async Task Add(Todo? entity)
    {
        try
        {
            await _dbContext.Todos.AddAsync(entity);
            await SaveAsync();
        }
        catch (DbException dbException)
        {
            throw new Exception("An Error occured while creating the new data", dbException);
        }
    }

    public async Task Update(TodoDTO? entityDto)
    {
        try
        {
            var record = await _dbContext.Todos.Where(e => e.Id == entityDto.Id).FirstOrDefaultAsync();
            if (record != null)
            {
                if (!string.IsNullOrEmpty(entityDto.Name)) record.Name = entityDto.Name;
                if (!string.IsNullOrEmpty(entityDto.Description)) record.Description = entityDto.Description;
                if (entityDto.DueDate.HasValue) record.DueDate = entityDto.DueDate.Value;
                record.IsCompleted = entityDto.IsCompleted;
                _dbContext.Todos.Update(record);
                await SaveAsync();
            }
        }
        catch (DbUpdateException dbUpdateException)
        {
            throw new Exception("An error occured while updating the data", dbUpdateException);
        }
    }

    public async Task Remove(int? id)
    {
        try
        {
            var record = await _dbContext.Todos.FirstOrDefaultAsync(e => e.Id == id);
            if (record != null)
            {
                record.IsDeleted = true;
                _dbContext.Todos.Update(record);
                await SaveAsync();
            }
        }
        catch (DbUpdateException dbUpdateException)
        {
            throw new Exception("An error occured while deleting the data", dbUpdateException);
        }
    }

    public async Task<int> SaveAsync()
    {
        return await _dbContext.SaveChangesAsync();
    }

    public void Dispose()
    {
        _dbContext.Dispose();
    }
}