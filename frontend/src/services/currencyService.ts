import axios from 'axios';
import { Currency } from '../interfaces';

const api = axios.create({ baseURL: 'http://localhost:5050/api/currencies' });

export const currencyService = {
  getAll: (): Promise<Currency[]> => api.get<Currency[]>('/').then(r => r.data),
  getByCode: (code: string): Promise<Currency> => api.get<Currency>(`/${code}`).then(r => r.data),
};

