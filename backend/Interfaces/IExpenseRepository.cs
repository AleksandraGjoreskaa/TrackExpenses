using backend.Models;

namespace backend.Interfaces;

public interface IExpenseRepository
{
    Task<IEnumerable<Expense>> GetAllAsync();
    Task<Expense?> GetByIdAsync(int id);
    Task<IEnumerable<Expense>> SearchByTitleAsync(string title);
    Task<IEnumerable<Expense>> GetByCategoryAsync(string category);
    Task<IEnumerable<Expense>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<Expense> CreateAsync(Expense expense);
    Task<Expense?> UpdateAsync(int id, Expense expense);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<Expense>> GetAllForMonthlyTotalsAsync();
}

