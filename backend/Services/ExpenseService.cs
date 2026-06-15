using backend.DTOs;
using backend.Interfaces;
using backend.Models;

namespace backend.Services;

public class ExpenseService : IExpenseService
{
    private readonly IExpenseRepository _repository;

    public ExpenseService(IExpenseRepository repository)
    {
        _repository = repository;
    }

    private static ExpenseDto MapToDto(Expense e) => new()
    {
        Id = e.Id,
        Title = e.Title,
        Amount = e.Amount,
        Category = e.Category,
        Date = e.Date,
        Type = e.Type,
        Notes = e.Notes
    };

    public async Task<IEnumerable<ExpenseDto>> GetAllAsync()
        => (await _repository.GetAllAsync()).Select(MapToDto);

    public async Task<ExpenseDto?> GetByIdAsync(int id)
    {
        var expense = await _repository.GetByIdAsync(id);
        return expense == null ? null : MapToDto(expense);
    }

    public async Task<IEnumerable<ExpenseDto>> SearchByTitleAsync(string title)
        => (await _repository.SearchByTitleAsync(title)).Select(MapToDto);

    public async Task<IEnumerable<ExpenseDto>> GetByCategoryAsync(string category)
        => (await _repository.GetByCategoryAsync(category)).Select(MapToDto);

    public async Task<IEnumerable<ExpenseDto>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        => (await _repository.GetByDateRangeAsync(startDate, endDate)).Select(MapToDto);

    public async Task<ExpenseDto> CreateAsync(CreateExpenseDto dto)
    {
        var expense = new Expense
        {
            Title = dto.Title,
            Amount = dto.Amount,
            Category = dto.Category,
            Date = dto.Date,
            Type = dto.Type,
            Notes = dto.Notes
        };
        var created = await _repository.CreateAsync(expense);
        return MapToDto(created);
    }

    public async Task<ExpenseDto?> UpdateAsync(int id, UpdateExpenseDto dto)
    {
        var expense = new Expense
        {
            Title = dto.Title,
            Amount = dto.Amount,
            Category = dto.Category,
            Date = dto.Date,
            Type = dto.Type,
            Notes = dto.Notes
        };
        var updated = await _repository.UpdateAsync(id, expense);
        return updated == null ? null : MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(int id)
        => await _repository.DeleteAsync(id);

    public async Task<IEnumerable<MonthlyTotalDto>> GetMonthlyTotalsAsync()
    {
        var expenses = await _repository.GetAllForMonthlyTotalsAsync();
        return expenses
            .GroupBy(e => new { e.Date.Year, e.Date.Month })
            .Select(g => new MonthlyTotalDto
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                TotalIncome = g.Where(e => e.Type == "Income").Sum(e => e.Amount),
                TotalExpenses = g.Where(e => e.Type == "Expense").Sum(e => e.Amount),
                Balance = g.Where(e => e.Type == "Income").Sum(e => e.Amount)
                         - g.Where(e => e.Type == "Expense").Sum(e => e.Amount)
            })
            .OrderBy(x => x.Year).ThenBy(x => x.Month);
    }
}

