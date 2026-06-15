using backend.DTOs;
using backend.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BudgetsController : ControllerBase
{
    private readonly IBudgetService _service;
    private readonly IValidator<CreateBudgetDto> _createValidator;
    private readonly IValidator<UpdateBudgetDto> _updateValidator;

    public BudgetsController(
        IBudgetService service,
        IValidator<CreateBudgetDto> createValidator,
        IValidator<UpdateBudgetDto> updateValidator)
    {
        _service = service;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var budget = await _service.GetByIdAsync(id);
        return budget == null ? NotFound() : Ok(budget);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBudgetDto dto)
    {
        var validation = await _createValidator.ValidateAsync(dto);
        if (!validation.IsValid)
            return BadRequest(validation.Errors.Select(e => e.ErrorMessage));

        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBudgetDto dto)
    {
        var validation = await _updateValidator.ValidateAsync(dto);
        if (!validation.IsValid)
            return BadRequest(validation.Errors.Select(e => e.ErrorMessage));

        var updated = await _service.UpdateAsync(id, dto);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}

