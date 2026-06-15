import { useEffect, useState, useCallback } from 'react';
import { Expense, ExpenseFilter } from '../interfaces';
import { expenseService } from '../services/expenseService';

export function useExpenses(initialFilter?: ExpenseFilter) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async (filter?: ExpenseFilter) => {
    try {
      setLoading(true);
      setError(null);
      const data = await expenseService.getAll(filter ?? initialFilter);
      setExpenses(data);
    } catch {
      setError('Failed to fetch expenses. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const deleteExpense = async (id: number) => {
    await expenseService.delete(id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const toggleFavorite = async (id: number) => {
    const updated = await expenseService.toggleFavorite(id);
    setExpenses(prev => prev.map(e => (e.id === id ? updated : e)));
    return updated;
  };

  const duplicate = async (id: number) => {
    const copy = await expenseService.duplicate(id);
    setExpenses(prev => [copy, ...prev]);
    return copy;
  };

  return { expenses, loading, error, refetch: fetchExpenses, deleteExpense, toggleFavorite, duplicate };
}
