using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly AppDbContext _context;

    public CategoryRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<Category>> GetAllAsync()
        => await _context.Categories.OrderBy(c => c.Name).ToListAsync();

    public async Task<Category?> GetByIdAsync(int id)
        => await _context.Categories.FindAsync(id);

    public async Task<Category> CreateAsync(Category category)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<Category?> UpdateAsync(int id, Category category)
    {
        var existing = await _context.Categories.FindAsync(id);
        if (existing == null) return null;

        existing.Name = category.Name;
        existing.Icon = category.Icon;
        existing.Color = category.Color;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return false;
        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return true;
    }
}

