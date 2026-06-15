namespace backend.DTOs;

public class YearlyTotalDto
{
    public int Year { get; set; }
    public decimal TotalIncome { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal Balance { get; set; }
}

public class CategorySpendingDto
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string CategoryIcon { get; set; } = string.Empty;
    public string CategoryColor { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public int TransactionCount { get; set; }
    public decimal Percentage { get; set; }
}

public class OverallStatisticsDto
{
    public decimal TotalIncome { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal CurrentBalance { get; set; }
    public decimal AverageSpendingPerMonth { get; set; }
    public decimal HighestExpenseAmount { get; set; }
    public string HighestExpenseTitle { get; set; } = string.Empty;
    public decimal LowestExpenseAmount { get; set; }
    public string LowestExpenseTitle { get; set; } = string.Empty;
    public int TotalTransactions { get; set; }
}

