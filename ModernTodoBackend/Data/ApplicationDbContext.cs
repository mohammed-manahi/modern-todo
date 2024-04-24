using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ModernTodoBackend.Models;

namespace ModernTodoBackend.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> dbContextOptions) : base(dbContextOptions)
    {
    }

    public override int SaveChanges()
    {
        // Manage create and update date time states for base model
        foreach (var entityEntry in ChangeTracker.Entries<BaseModel>())
        {
            if (entityEntry.State == EntityState.Added)
            {
                entityEntry.Entity.CreatedDate = DateTime.UtcNow;
                entityEntry.Entity.UpdatedDate = DateTime.UtcNow;
            }

            if (entityEntry.State == EntityState.Modified)
            {
                entityEntry.Entity.UpdatedDate = DateTime.UtcNow;
            }
        }

        return base.SaveChanges();
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        // One-to-many relationship between user and todo models
        builder.Entity<ApplicationUser>()
            .HasMany(m => m.Todos)
            .WithOne(o => o.ApplicationUser)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Todo model validations
        builder.Entity<Todo>(entityOpetions =>
        {
            entityOpetions.HasKey(k => k.Id);
            entityOpetions.Property(p => p.Name).HasMaxLength(50).IsRequired();
            entityOpetions.Property(p => p.Description).HasMaxLength(250);
            entityOpetions.Property(p => p.IsCompleted).HasDefaultValue(false);
            entityOpetions.Property(p => p.IsDeleted).HasDefaultValue(false);
        });

        base.OnModelCreating(builder);
    }

    public DbSet<ApplicationUser> ApplicationUsers => Set<ApplicationUser>();
    public DbSet<Todo> Todos => Set<Todo>();
}