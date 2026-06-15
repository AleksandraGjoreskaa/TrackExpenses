using backend.DTOs;
using backend.Interfaces;
using backend.Models;

namespace backend.Services;

public class CurrencyService : ICurrencyService
{
    private readonly ICurrencyRepository _repository;

    public CurrencyService(ICurrencyRepository repository) => _repository = repository;

    private static CurrencyDto MapToDto(Currency c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Code = c.Code,
        Symbol = c.Symbol,
        Flag = c.Flag
    };

    public async Task<IEnumerable<CurrencyDto>> GetAllAsync()
        => (await _repository.GetAllAsync()).Select(MapToDto);

    public async Task<CurrencyDto?> GetByCodeAsync(string code)
    {
        var currency = await _repository.GetByCodeAsync(code);
        return currency == null ? null : MapToDto(currency);
    }
}

