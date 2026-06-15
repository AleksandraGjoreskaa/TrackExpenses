using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Expense> Expenses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Expense>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)").IsRequired();
            entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Date).IsRequired();
            entity.Property(e => e.Type).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Notes).HasMaxLength(500);
        });
    }
}

