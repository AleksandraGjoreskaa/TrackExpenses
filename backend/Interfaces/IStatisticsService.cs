using backend.DTOs;

namespace backend.Interfaces;

public interface IStatisticsService
{
    Task<IEnumerable<MonthlyTotalDto>> GetMonthlyTotalsAsync();
    Task<IEnumerable<YearlyTotalDto>> GetYearlyTotalsAsync();
    Task<IEnumerable<CategorySpendingDto>> GetTopSpendingCategoriesAsync(int top = 5);
    Task<OverallStatisticsDto> GetOverallStatisticsAsync();
}

