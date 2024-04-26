using System.Data.Common;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using ModernTodoBackend.Data;
using ModernTodoBackend.Models;
using System.Linq.Dynamic.Core;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using ModernTodoBackend.DTO;

namespace ModernTodoBackend.Repositories;

public class TodoRepository : ITodoRepository
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly UserManager<ApplicationUser> _userManager;

    public TodoRepository(ApplicationDbContext dbContext, IHttpContextAccessor httpContextAccessor,
        UserManager<ApplicationUser> userManager)
    {
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
        _userManager = userManager;
    }

    public async Task<IEnumerable<Todo>> GetAll(int pageIndex = 0, int pageSize = 10, string sortColumn = "Name",
        string sortOrder = "ASC", string filterQuery = null)
    {
        try
        {
            var userId = GetAuthenticatedUserId();
            var query = _dbContext.Todos.AsQueryable();
            if (!string.IsNullOrEmpty(filterQuery))
            {
                // Handle existing filter query
                query = query
                    .Where(q => q.UserId == userId)
                    .Where(q => q.IsDeleted == false)
                    .Where(q => q.Name.ToLower().Contains(filterQuery.ToLower()) ||
                                q.Description.ToLower().Contains(filterQuery.ToLower()));
                query = query
                    .Include(u => u.ApplicationUser)
                    .AsNoTracking();
            }

            var recordCount = await query.CountAsync();
            // Handle empty filter query
            query = query
                .Where(q => q.UserId == userId)
                .Where(q => q.IsDeleted == false)
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

    public async Task<IEnumerable<Todo>> GetAllCompleted(int pageIndex = 0, int pageSize = 10,
        string sortColumn = "Name", string sortOrder = "ASC", string filterQuery = null)
    {
        var userId = GetAuthenticatedUserId();
        try
        {
            // Handle existing filter query for completed tasks
            var query = _dbContext.Todos.AsQueryable();
            if (!string.IsNullOrEmpty(filterQuery))
            {
                query = query
                    .Where(t => t.UserId == userId)
                    .Where(q => q.IsDeleted == false)
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
                .Where(t => t.UserId == userId)
                .Where(q => q.IsDeleted == false)
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

    public async Task<Todo> Get(int id)
    {
        try
        {
            var userId = GetAuthenticatedUserId();
            var record = await _dbContext.Todos
                .Where(t => t.UserId == userId)
                .Where(t => t.IsDeleted == false)
                .Include(u => u.ApplicationUser)
                .FirstOrDefaultAsync(t => t.Id == id);
            if (record != null && record.UserId == userId && !record.IsDeleted)
            {
                return record;
            }
            else
            {
                throw new Exception("Invalid data fetch operation");
            }
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

    public async Task Add(TodoDTO entityDto)
    {
        try
        {
            var userId = GetAuthenticatedUserId();
            var applicationUser = await _userManager.FindByIdAsync(userId);
            Todo todo = new Todo()
            {
                Name = entityDto.Name,
                Description = entityDto.Description,
                DueDate = entityDto.DueDate,
                IsCompleted = entityDto.IsCompleted,
                IsDeleted = false,
                UserId = userId,
                ApplicationUser = applicationUser,
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now
            };
            await _dbContext.Todos.AddAsync(todo);
            await SaveAsync();
        }
        catch (DbException dbException)
        {
            throw new Exception("An Error occured while creating the new data", dbException);
        }
    }

    public async Task Update(TodoDTO entityDto)
    {
        try
        {
            var userId = GetAuthenticatedUserId();
            var applicationUser = await _userManager.FindByIdAsync(userId);
            var record = await _dbContext.Todos
                .Include(u => u.ApplicationUser)
                .Where(c => c.IsDeleted == false)
                .Where(e => e.Id == entityDto.Id)
                .FirstOrDefaultAsync();
            if (record != null && record.UserId == userId && !record.IsDeleted)
            {
                if (!string.IsNullOrEmpty(entityDto.Name)) record.Name = entityDto.Name;
                if (!string.IsNullOrEmpty(entityDto.Description)) record.Description = entityDto.Description;
                if (entityDto.DueDate.HasValue) record.DueDate = entityDto.DueDate.Value;
                record.IsCompleted = entityDto.IsCompleted;
                record.IsDeleted = false;
                record.UserId = userId;
                record.ApplicationUser = applicationUser;
                record.CreatedDate = record.CreatedDate;
                record.UpdatedDate = DateTime.Now;
                _dbContext.Todos.Update(record);
                await SaveAsync();
            }
            else
            {
                throw new Exception("Invalid data manipulation operation");
            }
        }
        catch (DbUpdateException dbUpdateException)
        {
            throw new Exception("An error occured while updating the data", dbUpdateException);
        }
    }

    public async Task Remove(int id)
    {
        try
        {
            var userId = GetAuthenticatedUserId();
            var record = await _dbContext.Todos
                .Include(u => u.ApplicationUser)
                .FirstOrDefaultAsync(e => e.Id == id);
            if (record != null && record.UserId == userId && !record.IsDeleted)
            {
                record.IsDeleted = true;
                _dbContext.Todos.Update(record);
                await SaveAsync();
            }
            else
            {
                throw new Exception("Invalid data manipulation operation");
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

    private string GetAuthenticatedUserId()
    {
        // Get currently authenticated user
        var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrEmpty(userId))
        {
            return userId;
        }

        return null;
    }
}