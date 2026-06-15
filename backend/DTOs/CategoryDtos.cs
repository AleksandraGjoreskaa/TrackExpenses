namespace backend.DTOs;

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}

public class CreateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = "💰";
    public string Color { get; set; } = "#6366f1";
}

public class UpdateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}

