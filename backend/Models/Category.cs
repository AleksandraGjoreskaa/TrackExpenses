namespace backend.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = "💰";
    public string Color { get; set; } = "#6366f1";
    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
}

