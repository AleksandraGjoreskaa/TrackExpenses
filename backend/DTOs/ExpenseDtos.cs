namespace backend.DTOs;

public class ExpenseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class CreateExpenseDto
{
    public string Title { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class UpdateExpenseDto
{
    public string Title { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class MonthlyTotalDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal TotalIncome { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal Balance { get; set; }
}

