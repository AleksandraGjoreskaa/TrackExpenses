using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class ExpenseRepository : IExpenseRepository
{
    private readonly AppDbContext _context;

    public ExpenseRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Expense>> GetAllAsync()
        => await _context.Expenses.OrderByDescending(e => e.Date).ToListAsync();

    public async Task<Expense?> GetByIdAsync(int id)
        => await _context.Expenses.FindAsync(id);

    public async Task<IEnumerable<Expense>> SearchByTitleAsync(string title)
        => await _context.Expenses
            .Where(e => e.Title.ToLower().Contains(title.ToLower()))
            .OrderByDescending(e => e.Date)
            .ToListAsync();

    public async Task<IEnumerable<Expense>> GetByCategoryAsync(string category)
        => await _context.Expenses
            .Where(e => e.Category.ToLower() == category.ToLower())
            .OrderByDescending(e => e.Date)
            .ToListAsync();

    public async Task<IEnumerable<Expense>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        => await _context.Expenses
            .Where(e => e.Date >= startDate && e.Date <= endDate.AddDays(1).AddTicks(-1))
            .OrderByDescending(e => e.Date)
            .ToListAsync();

    public async Task<Expense> CreateAsync(Expense expense)
    {
        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();
        return expense;
    }

    public async Task<Expense?> UpdateAsync(int id, Expense expense)
    {
        var existing = await _context.Expenses.FindAsync(id);
        if (existing == null) return null;

        existing.Title = expense.Title;
        existing.Amount = expense.Amount;
        existing.Category = expense.Category;
        existing.Date = expense.Date;
        existing.Type = expense.Type;
        existing.Notes = expense.Notes;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null) return false;

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Expense>> GetAllForMonthlyTotalsAsync()
        => await _context.Expenses.ToListAsync();
}

