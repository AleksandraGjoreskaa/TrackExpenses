import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CreateExpenseDto } from '../interfaces';
import { expenseService } from '../services/expenseService';
import { useCategories } from '../hooks/useCategories';
import { useCurrencies } from '../hooks/useCurrencies';
import LoadingSpinner from '../components/LoadingSpinner';

const today = new Date().toISOString().split('T')[0];

export default function AddExpense() {
  const navigate = useNavigate();
  const { categories, loading: catsLoading } = useCategories();
  const { currencies, loading: curLoading } = useCurrencies();

  const [form, setForm] = useState<CreateExpenseDto>({
    title: '', amount: 0, categoryId: undefined,
    date: today, type: 'Expense', notes: '',
    currencyCode: localStorage.getItem('defaultCurrency') ?? 'USD',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0
            : name === 'categoryId' ? (value ? parseInt(value) : undefined)
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await expenseService.create(form);
      toast.success('Transaction added!');
      navigate('/expenses');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: unknown } };
      const data = axiosErr.response?.data;
      if (Array.isArray(data)) data.forEach((msg: string) => toast.error(msg));
      else toast.error('Failed to save transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  if (catsLoading || curLoading) return <LoadingSpinner />;

  return (
    <div className="form-page">
      <div className="page-header">
        <h1>Add Transaction</h1>
      </div>
      <form onSubmit={handleSubmit} className="expense-form card">
        <div className="form-group">
          <label>Title *</label>
          <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Grocery shopping" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Amount *</label>
            <input name="amount" type="number" min="0.01" step="0.01"
              value={form.amount || ''} onChange={handleChange} required placeholder="0.00" />
          </div>
          <div className="form-group">
            <label>Currency *</label>
            <select name="currencyCode" value={form.currencyCode} onChange={handleChange}>
              {currencies.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.code} – {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Type *</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="categoryId" value={form.categoryId ?? ''} onChange={handleChange}>
              <option value="">— None —</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Date *</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Optional notes…" />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? 'Saving…' : 'Add Transaction'}
          </button>
          <button type="button" onClick={() => navigate('/expenses')} className="btn btn-outline">Cancel</button>
        </div>
      </form>
    </div>
  );
}
