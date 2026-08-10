import axios from 'axios';
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import './ManageCategories.css';

type Category = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
};

export function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Add form state
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  // Edit state (which category is being edited + its new name)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const loadCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Handle add new category
  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setAdding(true);
    try {
      await axios.post('/api/categories', { name: newName });
      setNewName('');
      loadCategories();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || 'Failed to add category');
      } else {
        alert('Failed to add category');
      }
    } finally {
      setAdding(false);
    }
  };

  // Start editing a category
  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  // Save edited category
  const saveEdit = async (id: string) => {
    if (!editingName.trim()) return;

    try {
      await axios.put(`/api/categories/${id}`, { name: editingName });
      setEditingId(null);
      setEditingName('');
      loadCategories();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || 'Failed to update category');
      } else {
        alert('Failed to update category');
      }
    }
  };

  // Delete category
  const handleDelete = async (category: Category) => {
    const message =
      category.productCount > 0
        ? `Delete "${category.name}"? ${category.productCount} product(s) will become uncategorized.`
        : `Delete "${category.name}"?`;

    if (!window.confirm(message)) return;

    try {
      await axios.delete(`/api/categories/${category.id}`);
      loadCategories();
    } catch (err) {
      console.error(err);
      alert('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="manage-categories">
        <p className="loading">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="manage-categories">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Manage Categories</h1>
          <p className="subtitle">
            Organize your products into categories
          </p>
        </div>
        <Link to="/admin" className="back-link">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Add Form */}
      <div className="add-form-card">
        <h2>Add New Category</h2>
        <form onSubmit={handleAdd} className="add-form">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Electronics"
            className="category-input"
            required
          />
          <button type="submit" className="add-btn" disabled={adding}>
            {adding ? 'Adding...' : '+ Add Category'}
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="categories-section">
        <h2>All Categories ({categories.length})</h2>

        {categories.length === 0 ? (
          <div className="empty-state">
            <p>No categories yet. Create one above!</p>
          </div>
        ) : (
          <div className="categories-list">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                {editingId === category.id ? (
                  // EDIT MODE
                  <>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="category-input edit-input"
                      autoFocus
                    />
                    <div className="category-actions">
                      <button
                        onClick={() => saveEdit(category.id)}
                        className="btn btn-save"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="btn btn-cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  // VIEW MODE
                  <>
                    <div className="category-info">
                      <div className="category-name">{category.name}</div>
                      <div className="category-meta">
                        <span className="slug-badge">/{category.slug}</span>
                        <span className="count-badge">
                          {category.productCount} product{category.productCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="category-actions">
                      <button
                        onClick={() => startEdit(category)}
                        className="btn btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="btn btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}