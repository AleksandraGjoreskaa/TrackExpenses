using backend.DTOs;
using backend.Interfaces;

namespace backend.Services;

public class StatisticsService : IStatisticsService
{
    private readonly IExpenseRepository _repository;

    public StatisticsService(IExpenseRepository repository) => _repository = repository;

    public async Task<IEnumerable<MonthlyTotalDto>> GetMonthlyTotalsAsync()
    {
        var expenses = await _repository.GetAllForStatisticsAsync();
        return expenses
            .GroupBy(e => new { e.Date.Year, e.Date.Month })
            .Select(g => new MonthlyTotalDto
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                TotalIncome = g.Where(e => e.Type == "Income").Sum(e => e.Amount),
                TotalExpenses = g.Where(e => e.Type == "Expense").Sum(e => e.Amount),
                Balance = g.Where(e => e.Type == "Income").Sum(e => e.Amount)
                         - g.Where(e => e.Type == "Expense").Sum(e => e.Amount)
            })
            .OrderBy(x => x.Year).ThenBy(x => x.Month);
    }

    public async Task<IEnumerable<YearlyTotalDto>> GetYearlyTotalsAsync()
    {
        var expenses = await _repository.GetAllForStatisticsAsync();
        return expenses
            .GroupBy(e => e.Date.Year)
            .Select(g => new YearlyTotalDto
            {
                Year = g.Key,
                TotalIncome = g.Where(e => e.Type == "Income").Sum(e => e.Amount),
                TotalExpenses = g.Where(e => e.Type == "Expense").Sum(e => e.Amount),
                Balance = g.Where(e => e.Type == "Income").Sum(e => e.Amount)
                         - g.Where(e => e.Type == "Expense").Sum(e => e.Amount)
            })
            .OrderBy(x => x.Year);
    }

    public async Task<IEnumerable<CategorySpendingDto>> GetTopSpendingCategoriesAsync(int top = 5)
    {
        var expenses = await _repository.GetAllForStatisticsAsync();
        var expenseOnly = expenses.Where(e => e.Type == "Expense").ToList();
        var grandTotal = expenseOnly.Sum(e => e.Amount);

        return expenseOnly
            .GroupBy(e => new
            {
                e.CategoryId,
                Name = e.Category?.Name ?? "Uncategorized",
                Icon = e.Category?.Icon ?? "💰",
                Color = e.Category?.Color ?? "#6366f1"
            })
            .Select(g => new CategorySpendingDto
            {
                CategoryId = g.Key.CategoryId ?? 0,
                CategoryName = g.Key.Name,
                CategoryIcon = g.Key.Icon,
                CategoryColor = g.Key.Color,
                TotalAmount = g.Sum(e => e.Amount),
                TransactionCount = g.Count(),
                Percentage = grandTotal > 0
                    ? Math.Round((g.Sum(e => e.Amount) / grandTotal) * 100, 1)
                    : 0
            })
            .OrderByDescending(x => x.TotalAmount)
            .Take(top);
    }

    public async Task<OverallStatisticsDto> GetOverallStatisticsAsync()
    {
        var expenses = (await _repository.GetAllForStatisticsAsync()).ToList();

        var income = expenses.Where(e => e.Type == "Income").Sum(e => e.Amount);
        var totalExp = expenses.Where(e => e.Type == "Expense").Sum(e => e.Amount);

        var onlyExpenses = expenses.Where(e => e.Type == "Expense").ToList();

        var monthlyGroups = expenses
            .GroupBy(e => new { e.Date.Year, e.Date.Month })
            .Select(g => g.Where(e => e.Type == "Expense").Sum(e => e.Amount))
            .ToList();

        var avgPerMonth = monthlyGroups.Count > 0
            ? Math.Round(monthlyGroups.Average(), 2)
            : 0;

        var highest = onlyExpenses.OrderByDescending(e => e.Amount).FirstOrDefault();
        var lowest = onlyExpenses.OrderBy(e => e.Amount).FirstOrDefault();

        return new OverallStatisticsDto
        {
            TotalIncome = income,
            TotalExpenses = totalExp,
            CurrentBalance = income - totalExp,
            AverageSpendingPerMonth = avgPerMonth,
            HighestExpenseAmount = highest?.Amount ?? 0,
            HighestExpenseTitle = highest?.Title ?? "-",
            LowestExpenseAmount = lowest?.Amount ?? 0,
            LowestExpenseTitle = lowest?.Title ?? "-",
            TotalTransactions = expenses.Count
        };
    }
}

