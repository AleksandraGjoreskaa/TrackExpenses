import axios from 'axios';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../interfaces';

const api = axios.create({ baseURL: 'http://localhost:5050/api/categories' });

export const categoryService = {
  getAll: (): Promise<Category[]> => api.get<Category[]>('/').then(r => r.data),
  getById: (id: number): Promise<Category> => api.get<Category>(`/${id}`).then(r => r.data),
  create: (dto: CreateCategoryDto): Promise<Category> => api.post<Category>('/', dto).then(r => r.data),
  update: (id: number, dto: UpdateCategoryDto): Promise<Category> => api.put<Category>(`/${id}`, dto).then(r => r.data),
  delete: (id: number): Promise<void> => api.delete(`/${id}`).then(() => undefined),
};

