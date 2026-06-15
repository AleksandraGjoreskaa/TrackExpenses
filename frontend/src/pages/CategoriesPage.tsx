import { useState } from 'react';
import toast from 'react-hot-toast';
import { categoryService } from '../services/categoryService';
import { useCategories } from '../hooks/useCategories';
import { CreateCategoryDto, UpdateCategoryDto } from '../interfaces';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const PRESET_ICONS = ['🍔','🚗','🛍️','💡','🎮','💊','✈️','📚','💰','🏠','🎁','📦','💼','🏋️','🎵'];
const PRESET_COLORS = ['#f97316','#3b82f6','#a855f7','#eab308','#ec4899','#22c55e','#06b6d4','#8b5cf6','#10b981','#6b7280','#ef4444','#14b8a6'];

const emptyForm: CreateCategoryDto = { name: '', icon: '💰', color: '#6366f1' };

export default function CategoriesPage() {
  const { categories, loading, refetch } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateCategoryDto>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (id: number) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    setForm({ name: cat.name, icon: cat.icon, color: cat.color });
    setEditId(id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await categoryService.update(editId, form as UpdateCategoryDto);
        toast.success('Category updated!');
      } else {
        await categoryService.create(form);
        toast.success('Category created!');
      }
      setShowForm(false);
      refetch();
    } catch { toast.error('Failed to save category.'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (deleteId == null) return;
    try {
      await categoryService.delete(deleteId);
      toast.success('Category deleted');
      refetch();
    } catch { toast.error('Failed to delete category.'); }
    setDeleteId(null);
  };

  if (loading) return <LoadingSpinner text="Loading categories..." />;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Categories</h1>
        <button onClick={openAdd} className="btn btn-primary">+ New Category</button>
      </div>

      {showForm && (
        <div className="card form-card">
          <h3>{editId ? 'Edit Category' : 'New Category'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="e.g. Food & Dining" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Icon</label>
                <div className="icon-picker">
                  {PRESET_ICONS.map(ico => (
                    <button key={ico} type="button"
                      className={`icon-btn ${form.icon === ico ? 'active' : ''}`}
                      onClick={() => setForm(f => ({ ...f, icon: ico }))}>
                      {ico}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Color</label>
                <div className="color-picker">
                  {PRESET_COLORS.map(col => (
                    <button key={col} type="button"
                      className={`color-btn ${form.color === col ? 'active' : ''}`}
                      style={{ background: col }}
                      onClick={() => setForm(f => ({ ...f, color: col }))}
                    />
                  ))}
                </div>
                <input type="color" value={form.color}
                  onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="color-input-native" />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? 'Saving…' : editId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {categories.length === 0 ? (
        <EmptyState icon="🏷️" title="No categories yet" description="Create your first category to organize your transactions." />
      ) : (
        <div className="cat-grid">
          {categories.map(cat => (
            <div key={cat.id} className="cat-card card">
              <div className="cat-card-icon" style={{ background: `${cat.color}22`, border: `2px solid ${cat.color}44` }}>
                <span>{cat.icon}</span>
              </div>
              <div className="cat-card-info">
                <span className="cat-card-name">{cat.name}</span>
                <div className="cat-card-dot" style={{ background: cat.color }} />
              </div>
              <div className="cat-card-actions">
                <button onClick={() => openEdit(cat.id)} className="btn btn-edit">Edit</button>
                <button onClick={() => setDeleteId(cat.id)} className="btn btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Category"
        message="Deleting this category will unlink it from all related transactions. Continue?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        danger
      />
    </div>
  );
}

