import axios from 'axios';
import { CategorySpending, MonthlyTotal, OverallStatistics, YearlyTotal } from '../interfaces';

const api = axios.create({ baseURL: 'http://localhost:5050/api/statistics' });

export const statisticsService = {
  getOverview: (): Promise<OverallStatistics> => api.get<OverallStatistics>('/overview').then(r => r.data),
  getMonthly: (): Promise<MonthlyTotal[]> => api.get<MonthlyTotal[]>('/monthly').then(r => r.data),
  getYearly: (): Promise<YearlyTotal[]> => api.get<YearlyTotal[]>('/yearly').then(r => r.data),
  getTopCategories: (top = 5): Promise<CategorySpending[]> =>
    api.get<CategorySpending[]>(`/top-categories?top=${top}`).then(r => r.data),
};

