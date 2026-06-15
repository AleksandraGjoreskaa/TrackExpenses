using backend.Models;

namespace backend.Interfaces;

public interface ICurrencyRepository
{
    Task<IEnumerable<Currency>> GetAllAsync();
    Task<Currency?> GetByCodeAsync(string code);
}

