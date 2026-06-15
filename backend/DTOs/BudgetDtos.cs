namespace backend.DTOs;

public class BudgetDto
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string CategoryIcon { get; set; } = string.Empty;
    public string CategoryColor { get; set; } = string.Empty;
    public decimal MonthlyLimit { get; set; }
    public decimal CurrentMonthSpent { get; set; }
    public bool IsExceeded { get; set; }
    public decimal RemainingAmount { get; set; }
    public decimal PercentageUsed { get; set; }
}

public class CreateBudgetDto
{
    public int CategoryId { get; set; }
    public decimal MonthlyLimit { get; set; }
}

public class UpdateBudgetDto
{
    public decimal MonthlyLimit { get; set; }
}

