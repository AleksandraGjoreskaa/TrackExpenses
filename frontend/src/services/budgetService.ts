import axios from 'axios';
import { Budget, CreateBudgetDto, UpdateBudgetDto } from '../interfaces';

const api = axios.create({ baseURL: 'http://localhost:5050/api/budgets' });

export const budgetService = {
  getAll: (): Promise<Budget[]> => api.get<Budget[]>('/').then(r => r.data),
  getById: (id: number): Promise<Budget> => api.get<Budget>(`/${id}`).then(r => r.data),
  create: (dto: CreateBudgetDto): Promise<Budget> => api.post<Budget>('/', dto).then(r => r.data),
  update: (id: number, dto: UpdateBudgetDto): Promise<Budget> => api.put<Budget>(`/${id}`, dto).then(r => r.data),
  delete: (id: number): Promise<void> => api.delete(`/${id}`).then(() => undefined),
};

