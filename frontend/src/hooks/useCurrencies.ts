import { useCallback, useEffect, useState } from 'react';
import { Currency } from '../interfaces';
import { currencyService } from '../services/currencyService';

export function useCurrencies() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCurrencies = useCallback(async () => {
    try {
      setCurrencies(await currencyService.getAll());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCurrencies(); }, [fetchCurrencies]);

  const getSymbol = (code: string) =>
    currencies.find(c => c.code === code)?.symbol ?? code;

  return { currencies, loading, getSymbol };
}

