using backend.DTOs;

namespace backend.Interfaces;

public interface ICurrencyService
{
    Task<IEnumerable<CurrencyDto>> GetAllAsync();
    Task<CurrencyDto?> GetByCodeAsync(string code);
}

