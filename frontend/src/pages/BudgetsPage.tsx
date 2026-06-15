import { useState } from 'react';
import toast from 'react-hot-toast';
import { budgetService } from '../services/budgetService';
import { useBudgets } from '../hooks/useBudgets';
import { useCategories } from '../hooks/useCategories';
import { useCurrencies } from '../hooks/useCurrencies';
import { CreateBudgetDto } from '../interfaces';
import BudgetProgressBar from '../components/BudgetProgressBar';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function BudgetsPage() {
  const { budgets, loading, refetch } = useBudgets();
  const { categories, loading: catsLoading } = useCategories();
  const { getSymbol } = useCurrencies();
  const sym = getSymbol(localStorage.getItem('defaultCurrency') ?? 'USD');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateBudgetDto>({ categoryId: 0, monthlyLimit: 0 });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const budgetCategoryIds = new Set(budgets.map(b => b.categoryId));
  // Categories that don't yet have a budget (plus the one being edited)
  const availableCategories = categories.filter(
    c => !budgetCategoryIds.has(c.id) || c.id === form.categoryId
  );

  const openAdd = () => {
    const firstId = categories.find(c => !budgetCategoryIds.has(c.id))?.id ?? 0;
    setForm({ categoryId: firstId, monthlyLimit: 0 });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (id: number) => {
    const b = budgets.find(x => x.id === id);
    if (!b) return;
    setForm({ categoryId: b.categoryId, monthlyLimit: b.monthlyLimit });
    setEditId(id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId || form.categoryId <= 0) {
      toast.error('Please select a category.');
      return;
    }
    if (!form.monthlyLimit || form.monthlyLimit <= 0) {
      toast.error('Monthly limit must be greater than 0.');
      return;
    }
    setSubmitting(true);
    try {
      if (editId) {
        await budgetService.update(editId, { monthlyLimit: form.monthlyLimit });
        toast.success('Budget updated!');
      } else {
        await budgetService.create(form);
        toast.success('Budget created!');
      }
      setShowForm(false);
      refetch();
    } catch { toast.error('Failed to save budget.'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (deleteId == null) return;
    try {
      await budgetService.delete(deleteId);
      toast.success('Budget deleted');
      refetch();
    } catch { toast.error('Failed to delete.'); }
    setDeleteId(null);
  };

  if (loading || catsLoading) return <LoadingSpinner text="Loading budgets..." />;

  const allBudgeted = availableCategories.length === 0 && !editId;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Monthly Budgets</h1>
        <button
          onClick={openAdd}
          className="btn btn-primary"
          disabled={allBudgeted}
          title={allBudgeted ? 'All categories already have budgets' : ''}
        >
          + New Budget
        </button>
      </div>

      {showForm && (
        <div className="card form-card">
          <h3>{editId ? 'Edit Budget' : 'New Monthly Budget'}</h3>
          <form onSubmit={handleSubmit}>
            {!editId && (
              <div className="form-group">
                <label>Category *</label>
                {availableCategories.length === 0 ? (
                  <p className="text-muted">All categories already have a budget.</p>
                ) : (
                  <select
                    value={form.categoryId || ''}
                    onChange={e => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) setForm(f => ({ ...f, categoryId: val }));
                    }}
                  >
                    <option value="" disabled>— Select a category —</option>
                    {availableCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                )}
              </div>
            )}
            {editId && (
              <div className="form-group">
                <label>Category</label>
                <input
                  value={`${budgets.find(b => b.id === editId)?.categoryIcon ?? ''} ${budgets.find(b => b.id === editId)?.categoryName ?? ''}`}
                  disabled
                />
              </div>
            )}
            <div className="form-group">
              <label>Monthly Limit *</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.monthlyLimit || ''}
                onChange={e => setForm(f => ({ ...f, monthlyLimit: parseFloat(e.target.value) || 0 }))}
                placeholder="e.g. 500.00"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? 'Saving…' : editId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {budgets.filter(b => b.isExceeded).length > 0 && (
        <div className="alert alert-warning">
          ⚠️ {budgets.filter(b => b.isExceeded).length} budget(s) exceeded this month!
        </div>
      )}

      {budgets.length === 0 ? (
        <EmptyState icon="🎯" title="No budgets set" description="Set monthly spending limits per category to stay on track." />
      ) : (
        <div className="budget-cards">
          {budgets.map(b => (
            <div key={b.id} className="card budget-detail-card">
              <BudgetProgressBar {...b} sym={sym} />
              <div className="budget-detail-actions">
                <button onClick={() => openEdit(b.id)} className="btn btn-edit">Edit Limit</button>
                <button onClick={() => setDeleteId(b.id)} className="btn btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Budget"
        message="Are you sure you want to delete this budget?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        danger
      />
    </div>
  );
}
