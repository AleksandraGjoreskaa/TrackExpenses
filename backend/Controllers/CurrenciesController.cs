using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CurrenciesController : ControllerBase
{
    private readonly ICurrencyService _service;

    public CurrenciesController(ICurrencyService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{code}")]
    public async Task<IActionResult> GetByCode(string code)
    {
        var currency = await _service.GetByCodeAsync(code);
        return currency == null ? NotFound() : Ok(currency);
    }
}

