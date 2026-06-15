using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatisticsController : ControllerBase
{
    private readonly IStatisticsService _service;

    public StatisticsController(IStatisticsService service) => _service = service;

    // GET /api/statistics/overview
    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
        => Ok(await _service.GetOverallStatisticsAsync());

    // GET /api/statistics/monthly
    [HttpGet("monthly")]
    public async Task<IActionResult> GetMonthly()
        => Ok(await _service.GetMonthlyTotalsAsync());

    // GET /api/statistics/yearly
    [HttpGet("yearly")]
    public async Task<IActionResult> GetYearly()
        => Ok(await _service.GetYearlyTotalsAsync());

    // GET /api/statistics/top-categories?top=5
    [HttpGet("top-categories")]
    public async Task<IActionResult> GetTopCategories([FromQuery] int top = 5)
        => Ok(await _service.GetTopSpendingCategoriesAsync(top));
}

