using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class BudgetService : IBudgetService
{
    private readonly IBudgetRepository _repository;
    private readonly AppDbContext _context;

    public BudgetService(IBudgetRepository repository, AppDbContext context)
    {
        _repository = repository;
        _context = context;
    }

    private async Task<BudgetDto> EnrichWithSpending(Budget budget)
    {
        var now = DateTime.UtcNow;
        var spent = await _context.Expenses
            .Where(e => e.CategoryId == budget.CategoryId
                     && e.Type == "Expense"
                     && e.Date.Year == now.Year
                     && e.Date.Month == now.Month)
            .SumAsync(e => (decimal?)e.Amount) ?? 0;

        var remaining = budget.MonthlyLimit - spent;
        var pct = budget.MonthlyLimit > 0
            ? Math.Round((spent / budget.MonthlyLimit) * 100, 1)
            : 0;

        return new BudgetDto
        {
            Id = budget.Id,
            CategoryId = budget.CategoryId,
            CategoryName = budget.Category.Name,
            CategoryIcon = budget.Category.Icon,
            CategoryColor = budget.Category.Color,
            MonthlyLimit = budget.MonthlyLimit,
            CurrentMonthSpent = spent,
            IsExceeded = spent > budget.MonthlyLimit,
            RemainingAmount = remaining,
            PercentageUsed = pct
        };
    }

    public async Task<IEnumerable<BudgetDto>> GetAllAsync()
    {
        var budgets = await _repository.GetAllAsync();
        var tasks = budgets.Select(EnrichWithSpending);
        return await Task.WhenAll(tasks);
    }

    public async Task<BudgetDto?> GetByIdAsync(int id)
    {
        var budget = await _repository.GetByIdAsync(id);
        return budget == null ? null : await EnrichWithSpending(budget);
    }

    public async Task<BudgetDto> CreateAsync(CreateBudgetDto dto)
    {
        var budget = new Budget { CategoryId = dto.CategoryId, MonthlyLimit = dto.MonthlyLimit };
        var created = await _repository.CreateAsync(budget);
        return await EnrichWithSpending(created);
    }

    public async Task<BudgetDto?> UpdateAsync(int id, UpdateBudgetDto dto)
    {
        var budget = new Budget { MonthlyLimit = dto.MonthlyLimit };
        var updated = await _repository.UpdateAsync(id, budget);
        return updated == null ? null : await EnrichWithSpending(updated);
    }

    public async Task<bool> DeleteAsync(int id) => await _repository.DeleteAsync(id);
}

