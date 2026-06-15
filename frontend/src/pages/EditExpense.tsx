import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UpdateExpenseDto } from '../interfaces';
import { expenseService } from '../services/expenseService';
import { useCategories } from '../hooks/useCategories';
import { useCurrencies } from '../hooks/useCurrencies';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditExpense() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, loading: catsLoading } = useCategories();
  const { currencies, loading: curLoading } = useCurrencies();

  const [form, setForm] = useState<UpdateExpenseDto>({
    title: '', amount: 0, categoryId: undefined,
    date: '', type: 'Expense', notes: '', currencyCode: 'USD',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    expenseService.getById(parseInt(id, 10))
      .then(exp => setForm({
        title: exp.title, amount: exp.amount,
        categoryId: exp.categoryId, date: exp.date.split('T')[0],
        type: exp.type, notes: exp.notes ?? '', currencyCode: exp.currencyCode,
      }))
      .catch(() => { toast.error('Transaction not found.'); navigate('/expenses'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

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
      await expenseService.update(parseInt(id!, 10), form);
      toast.success('Transaction updated!');
      navigate('/expenses');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: unknown } };
      const data = axiosErr.response?.data;
      if (Array.isArray(data)) data.forEach((msg: string) => toast.error(msg));
      else toast.error('Failed to update transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || catsLoading || curLoading) return <LoadingSpinner text="Loading transaction..." />;

  return (
    <div className="form-page">
      <div className="page-header"><h1>Edit Transaction</h1></div>
      <form onSubmit={handleSubmit} className="expense-form card">
        <div className="form-group">
          <label>Title *</label>
          <input name="title" value={form.title} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Amount *</label>
            <input name="amount" type="number" min="0.01" step="0.01" value={form.amount || ''} onChange={handleChange} required />
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
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? 'Saving…' : 'Update Transaction'}
          </button>
          <button type="button" onClick={() => navigate('/expenses')} className="btn btn-outline">Cancel</button>
        </div>
      </form>
    </div>
  );
}
