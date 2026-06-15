import axios from 'axios';
import { CreateExpenseDto, Expense, ExpenseFilter, UpdateExpenseDto } from '../interfaces';

const api = axios.create({ baseURL: 'http://localhost:5050/api/expenses' });

export const expenseService = {
  getAll: (filter?: ExpenseFilter): Promise<Expense[]> =>
    api.get<Expense[]>('/', { params: filter }).then(r => r.data),

  getById: (id: number): Promise<Expense> =>
    api.get<Expense>(`/${id}`).then(r => r.data),

  create: (dto: CreateExpenseDto): Promise<Expense> =>
    api.post<Expense>('/', dto).then(r => r.data),

  update: (id: number, dto: UpdateExpenseDto): Promise<Expense> =>
    api.put<Expense>(`/${id}`, dto).then(r => r.data),

  delete: (id: number): Promise<void> =>
    api.delete(`/${id}`).then(() => undefined),

  toggleFavorite: (id: number): Promise<Expense> =>
    api.post<Expense>(`/${id}/favorite`).then(r => r.data),

  duplicate: (id: number): Promise<Expense> =>
    api.post<Expense>(`/${id}/duplicate`).then(r => r.data),
};
