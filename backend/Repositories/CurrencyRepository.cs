using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class CurrencyRepository : ICurrencyRepository
{
    private readonly AppDbContext _context;

    public CurrencyRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<Currency>> GetAllAsync()
        => await _context.Currencies.OrderBy(c => c.Code).ToListAsync();

    public async Task<Currency?> GetByCodeAsync(string code)
        => await _context.Currencies.FirstOrDefaultAsync(c => c.Code == code.ToUpper());
}

