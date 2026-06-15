using backend.DTOs;

namespace backend.Interfaces;

public interface IExpenseService
{
    Task<IEnumerable<ExpenseDto>> GetAllAsync();
    Task<ExpenseDto?> GetByIdAsync(int id);
    Task<IEnumerable<ExpenseDto>> SearchByTitleAsync(string title);
    Task<IEnumerable<ExpenseDto>> GetByCategoryAsync(string category);
    Task<IEnumerable<ExpenseDto>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<ExpenseDto> CreateAsync(CreateExpenseDto dto);
    Task<ExpenseDto?> UpdateAsync(int id, UpdateExpenseDto dto);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<MonthlyTotalDto>> GetMonthlyTotalsAsync();
}

