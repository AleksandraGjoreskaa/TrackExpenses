using backend.DTOs;
using backend.Interfaces;
using backend.Models;

namespace backend.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _repository;

    public CategoryService(ICategoryRepository repository) => _repository = repository;

    private static CategoryDto MapToDto(Category c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Icon = c.Icon,
        Color = c.Color
    };

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
        => (await _repository.GetAllAsync()).Select(MapToDto);

    public async Task<CategoryDto?> GetByIdAsync(int id)
    {
        var cat = await _repository.GetByIdAsync(id);
        return cat == null ? null : MapToDto(cat);
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
    {
        var cat = new Category { Name = dto.Name, Icon = dto.Icon, Color = dto.Color };
        return MapToDto(await _repository.CreateAsync(cat));
    }

    public async Task<CategoryDto?> UpdateAsync(int id, UpdateCategoryDto dto)
    {
        var cat = new Category { Name = dto.Name, Icon = dto.Icon, Color = dto.Color };
        var updated = await _repository.UpdateAsync(id, cat);
        return updated == null ? null : MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(int id) => await _repository.DeleteAsync(id);
}

