using backend.DTOs;

namespace backend.Interfaces;

public interface IBudgetService
{
    Task<IEnumerable<BudgetDto>> GetAllAsync();
    Task<BudgetDto?> GetByIdAsync(int id);
    Task<BudgetDto> CreateAsync(CreateBudgetDto dto);
    Task<BudgetDto?> UpdateAsync(int id, UpdateBudgetDto dto);
    Task<bool> DeleteAsync(int id);
}

