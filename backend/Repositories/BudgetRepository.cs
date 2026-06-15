using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class BudgetRepository : IBudgetRepository
{
    private readonly AppDbContext _context;

    public BudgetRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<Budget>> GetAllAsync()
        => await _context.Budgets.Include(b => b.Category).ToListAsync();

    public async Task<Budget?> GetByIdAsync(int id)
        => await _context.Budgets.Include(b => b.Category).FirstOrDefaultAsync(b => b.Id == id);

    public async Task<Budget?> GetByCategoryIdAsync(int categoryId)
        => await _context.Budgets.Include(b => b.Category).FirstOrDefaultAsync(b => b.CategoryId == categoryId);

    public async Task<Budget> CreateAsync(Budget budget)
    {
        _context.Budgets.Add(budget);
        await _context.SaveChangesAsync();
        return (await GetByIdAsync(budget.Id))!;
    }

    public async Task<Budget?> UpdateAsync(int id, Budget budget)
    {
        var existing = await _context.Budgets.FindAsync(id);
        if (existing == null) return null;

        existing.MonthlyLimit = budget.MonthlyLimit;
        await _context.SaveChangesAsync();
        return (await GetByIdAsync(id))!;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var budget = await _context.Budgets.FindAsync(id);
        if (budget == null) return false;
        _context.Budgets.Remove(budget);
        await _context.SaveChangesAsync();
        return true;
    }
}

