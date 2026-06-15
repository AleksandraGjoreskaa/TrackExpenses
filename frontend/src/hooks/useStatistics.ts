import { useCallback, useEffect, useState } from 'react';
import {
  CategorySpending,
  MonthlyTotal,
  OverallStatistics,
  YearlyTotal,
} from '../interfaces';
import { statisticsService } from '../services/statisticsService';

export function useStatistics() {
  const [overview, setOverview] = useState<OverallStatistics | null>(null);
  const [monthly, setMonthly] = useState<MonthlyTotal[]>([]);
  const [yearly, setYearly] = useState<YearlyTotal[]>([]);
  const [topCategories, setTopCategories] = useState<CategorySpending[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [o, m, y, t] = await Promise.all([
        statisticsService.getOverview(),
        statisticsService.getMonthly(),
        statisticsService.getYearly(),
        statisticsService.getTopCategories(),
      ]);
      setOverview(o);
      setMonthly(m);
      setYearly(y);
      setTopCategories(t);
    } catch {
      setError('Failed to load statistics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { overview, monthly, yearly, topCategories, loading, error, refetch: fetchAll };
}

