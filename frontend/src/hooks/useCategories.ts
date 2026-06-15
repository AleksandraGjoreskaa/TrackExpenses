import { useCallback, useEffect, useState } from 'react';
import { Category } from '../interfaces';
import { categoryService } from '../services/categoryService';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setCategories(await categoryService.getAll());
    } catch {
      setError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}

