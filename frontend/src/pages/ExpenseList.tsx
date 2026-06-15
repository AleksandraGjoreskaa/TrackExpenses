import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useExpenses } from '../hooks/useExpenses';
import { useCategories } from '../hooks/useCategories';
import { ExpenseFilter } from '../interfaces';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const DATE_PRESETS = ['All', 'Today', 'This Week', 'This Month', 'Custom'];
const SORT_OPTIONS = [
  { label: 'Date ↓', sortBy: 'date', descending: true },
  { label: 'Date ↑', sortBy: 'date', descending: false },
  { label: 'Amount ↓', sortBy: 'amount', descending: true },
  { label: 'Amount ↑', sortBy: 'amount', descending: false },
];

const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default function ExpenseList() {
  const [filter, setFilter] = useState<ExpenseFilter>({ sortBy: 'date', descending: true });
  const [search, setSearch] = useState('');
  const [datePreset, setDatePreset] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortIndex, setSortIndex] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { expenses, loading, error, deleteExpense, toggleFavorite, duplicate } = useExpenses(filter);
  const { categories } = useCategories();

  const applyFilter = useCallback((patch: Partial<ExpenseFilter>) => {
    const updated = { ...filter, ...patch };
    setFilter(updated);
  }, [filter]);

  const handleSearch = () => applyFilter({ search: search.trim() || undefined });

  const handleClearSearch = () => {
    setSearch('');
    applyFilter({ search: undefined });
  };

  const handleCategoryFilter = (id: number | undefined) =>
    applyFilter({ categoryId: id });

  const handleTypeFilter = (type: 'Income' | 'Expense' | undefined) =>
    applyFilter({ type });

  const handleFavoriteFilter = (val: boolean | undefined) =>
    applyFilter({ isFavorite: val });

  const handleSort = (idx: number) => {
    setSortIndex(idx);
    const s = SORT_OPTIONS[idx];
    applyFilter({ sortBy: s.sortBy as ExpenseFilter['sortBy'], descending: s.descending });
  };

  const handleDatePreset = (preset: string) => {
    setDatePreset(preset);
    const now = new Date();
    const today = fmt(now);
    if (preset === 'All') { applyFilter({ startDate: undefined, endDate: undefined }); return; }
    if (preset === 'Today') { applyFilter({ startDate: today, endDate: today }); return; }
    if (preset === 'This Week') {
      const day = now.getDay();
      const mon = new Date(now); mon.setDate(now.getDate() - day + (day === 0 ? -6 : 1));
      applyFilter({ startDate: fmt(mon), endDate: today }); return;
    }
    if (preset === 'This Month') {
      applyFilter({ startDate: `${now.getFullYear()}-${pad(now.getMonth()+1)}-01`, endDate: today }); return;
    }
  };

  const handleCustomDate = () => {
    if (startDate && endDate) applyFilter({ startDate, endDate });
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    try {
      await deleteExpense(deleteId);
      toast.success('Transaction deleted');
    } catch { toast.error('Failed to delete'); }
    setDeleteId(null);
  };

  const handleToggleFavorite = async (id: number, current: boolean) => {
    try {
      await toggleFavorite(id);
      toast.success(current ? 'Removed from favorites' : 'Added to favorites');
    } catch { toast.error('Failed to update'); }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await duplicate(id);
      toast.success('Transaction duplicated');
    } catch { toast.error('Failed to duplicate'); }
  };

  if (loading) return <LoadingSpinner text="Loading transactions..." />;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Transactions</h1>
        <Link to="/add" className="btn btn-primary">+ Add</Link>
      </div>

      {/* Filters panel */}
      <div className="filters-panel">
        {/* Search */}
        <div className="search-bar">
          <input
            type="text" placeholder="Search by title..."
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="btn btn-secondary">Search</button>
          {filter.search && <button onClick={handleClearSearch} className="btn btn-outline">✕</button>}
        </div>

        {/* Category pills */}
        <div className="filter-row">
          <span className="filter-label">Category</span>
          <div className="filter-pills">
            <button onClick={() => handleCategoryFilter(undefined)}
              className={`filter-btn ${!filter.categoryId ? 'active' : ''}`}>All</button>
            {categories.map(c => (
              <button key={c.id} onClick={() => handleCategoryFilter(c.id)}
                className={`filter-btn ${filter.categoryId === c.id ? 'active' : ''}`}
                style={filter.categoryId === c.id ? { background: c.color, borderColor: c.color, color: '#fff' } : {}}>
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Type filter */}
        <div className="filter-row">
          <span className="filter-label">Type</span>
          <div className="filter-pills">
            {[undefined, 'Income' as const, 'Expense' as const].map(t => (
              <button key={t ?? 'all'} onClick={() => handleTypeFilter(t)}
                className={`filter-btn ${filter.type === t ? 'active' : ''}`}>{t ?? 'All'}</button>
            ))}
          </div>
        </div>

        {/* Date filter */}
        <div className="filter-row">
          <span className="filter-label">Date</span>
          <div className="filter-pills">
            {DATE_PRESETS.map(p => (
              <button key={p} onClick={() => handleDatePreset(p)}
                className={`filter-btn ${datePreset === p ? 'active' : ''}`}>{p}</button>
            ))}
          </div>
          {datePreset === 'Custom' && (
            <div className="custom-date">
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              <span>to</span>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              <button onClick={handleCustomDate} className="btn btn-secondary">Apply</button>
            </div>
          )}
        </div>

        {/* Sort + Favorite */}
        <div className="filter-row">
          <span className="filter-label">Sort</span>
          <div className="filter-pills">
            {SORT_OPTIONS.map((s, i) => (
              <button key={i} onClick={() => handleSort(i)}
                className={`filter-btn ${sortIndex === i ? 'active' : ''}`}>{s.label}</button>
            ))}
          </div>
          <button onClick={() => handleFavoriteFilter(filter.isFavorite ? undefined : true)}
            className={`filter-btn ${filter.isFavorite ? 'active' : ''}`}>⭐ Favorites</button>
        </div>
      </div>

      {/* Table */}
      {expenses.length === 0 ? (
        <EmptyState icon="📭" title="No transactions found" description="Try adjusting your filters or add a new transaction."
          actionLabel="+ Add Transaction" actionTo="/add" />
      ) : (
        <div className="table-card">
          <table className="expense-table">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Type</th>
                <th>Currency</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td>
                    <button className={`fav-btn ${exp.isFavorite ? 'active' : ''}`}
                      onClick={() => handleToggleFavorite(exp.id, exp.isFavorite)}
                      title={exp.isFavorite ? 'Remove favorite' : 'Add to favorites'}>
                      {exp.isFavorite ? '⭐' : '☆'}
                    </button>
                  </td>
                  <td className="td-title">{exp.title}</td>
                  <td>
                    {exp.categoryName ? (
                      <span className="category-chip"
                        style={{ background: `${exp.categoryColor}22`, color: exp.categoryColor, border: `1px solid ${exp.categoryColor}44` }}>
                        {exp.categoryIcon} {exp.categoryName}
                      </span>
                    ) : <span className="text-muted">—</span>}
                  </td>
                  <td className="text-muted">{new Date(exp.date).toLocaleDateString()}</td>
                  <td><span className={`type-badge ${exp.type.toLowerCase()}`}>{exp.type}</span></td>
                  <td className="text-muted">{exp.currencyCode}</td>
                  <td className={exp.type === 'Income' ? 'amount-income' : 'amount-expense'}>
                    {exp.type === 'Income' ? '+' : '-'}{exp.amount.toFixed(2)}
                  </td>
                  <td className="actions">
                    <Link to={`/edit/${exp.id}`} className="btn btn-edit">Edit</Link>
                    <button onClick={() => handleDuplicate(exp.id)} className="btn btn-ghost" title="Duplicate">⧉</button>
                    <button onClick={() => setDeleteId(exp.id)} className="btn btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        danger
      />
    </div>
  );
}
