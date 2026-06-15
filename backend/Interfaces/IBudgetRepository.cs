using backend.DTOs;
using backend.Models;

namespace backend.Interfaces;

public interface IBudgetRepository
{
    Task<IEnumerable<Budget>> GetAllAsync();
    Task<Budget?> GetByIdAsync(int id);
    Task<Budget?> GetByCategoryIdAsync(int categoryId);
    Task<Budget> CreateAsync(Budget budget);
    Task<Budget?> UpdateAsync(int id, Budget budget);
    Task<bool> DeleteAsync(int id);
}

