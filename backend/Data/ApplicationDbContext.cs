
using Microsoft.EntityFrameworkCore;

namespace TasksHubServer.Data;

public class ApplicationDbContext : DbContext 
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Models.ApplicationUser> ApplicationUsers { get; set; } = null!;
    public DbSet<Models.UserTasks> UserTasks { get; set; } = null!;
    public DbSet<Models.UserDocuments> UserDocuments { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Models.ApplicationUser>()
            .HasMany(u => u.UserTasks)
            .WithOne(t => t.User)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Models.ApplicationUser>()
            .HasMany(u => u.UserDocument)
            .WithOne(d => d.User)
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
