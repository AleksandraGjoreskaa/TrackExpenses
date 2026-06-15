import { useCallback, useEffect, useState } from 'react';
import { Budget } from '../interfaces';
import { budgetService } from '../services/budgetService';

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setBudgets(await budgetService.getAll());
    } catch {
      setError('Failed to load budgets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBudgets(); }, [fetchBudgets]);

  return { budgets, loading, error, refetch: fetchBudgets };
}

