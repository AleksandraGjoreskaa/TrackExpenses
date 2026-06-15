using backend.DTOs;
using backend.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly IExpenseService _service;
    private readonly IValidator<CreateExpenseDto> _createValidator;
    private readonly IValidator<UpdateExpenseDto> _updateValidator;

    public ExpensesController(
        IExpenseService service,
        IValidator<CreateExpenseDto> createValidator,
        IValidator<UpdateExpenseDto> updateValidator)
    {
        _service = service;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    // GET /api/expenses
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    // GET /api/expenses/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var expense = await _service.GetByIdAsync(id);
        return expense == null ? NotFound(new { message = $"Expense with id {id} not found." }) : Ok(expense);
    }

    // GET /api/expenses/search?title=groceries
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            return BadRequest(new { message = "Title query parameter is required." });

        return Ok(await _service.SearchByTitleAsync(title));
    }

    // GET /api/expenses/category/{category}
    [HttpGet("category/{category}")]
    public async Task<IActionResult> GetByCategory(string category)
        => Ok(await _service.GetByCategoryAsync(category));

    // GET /api/expenses/date-range?startDate=2026-01-01&endDate=2026-01-31
    [HttpGet("date-range")]
    public async Task<IActionResult> GetByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        if (startDate > endDate)
            return BadRequest(new { message = "startDate must be before or equal to endDate." });

        return Ok(await _service.GetByDateRangeAsync(startDate, endDate));
    }

    // GET /api/expenses/monthly-totals
    [HttpGet("monthly-totals")]
    public async Task<IActionResult> GetMonthlyTotals()
        => Ok(await _service.GetMonthlyTotalsAsync());

    // POST /api/expenses
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateExpenseDto dto)
    {
        var validation = await _createValidator.ValidateAsync(dto);
        if (!validation.IsValid)
            return BadRequest(validation.Errors.Select(e => e.ErrorMessage));

        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT /api/expenses/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateExpenseDto dto)
    {
        var validation = await _updateValidator.ValidateAsync(dto);
        if (!validation.IsValid)
            return BadRequest(validation.Errors.Select(e => e.ErrorMessage));

        var updated = await _service.UpdateAsync(id, dto);
        return updated == null ? NotFound(new { message = $"Expense with id {id} not found." }) : Ok(updated);
    }

    // DELETE /api/expenses/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound(new { message = $"Expense with id {id} not found." });
    }
}

