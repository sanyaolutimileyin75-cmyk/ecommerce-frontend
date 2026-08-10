import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import './AdminPage.css';

type Stats = {
  totalProducts: number;
  totalOrders: number;
  totalRevenueCents: number;
};

export function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Get admin info and logout function from AuthContext
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await axios.get('/api/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Handle logout - clear token and go back to login page
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="subtitle">
            Welcome back, <strong>{admin?.username}</strong>! Here's what's happening in your store.
          </p>
        </div>
        <div className="header-actions">
          <div className="header-badge">
            <span className="badge-dot"></span>
            Live
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-card-blue">
          <div className="stat-header">
            <div className="stat-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat-value">
            {loading ? '—' : stats?.totalProducts ?? 0}
          </div>
          <div className="stat-footer">In inventory</div>
        </div>

        <div className="stat-card stat-card-green">
          <div className="stat-header">
            <div className="stat-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="stat-label">Revenue</span>
          </div>
          <div className="stat-value">
            {loading
              ? '—'
              : `$${((stats?.totalRevenueCents ?? 0) / 100).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
          </div>
          <div className="stat-footer">Total earnings</div>
        </div>

        <div className="stat-card stat-card-purple">
          <div className="stat-header">
            <div className="stat-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <span className="stat-label">Orders</span>
          </div>
          <div className="stat-value">
            {loading ? '—' : stats?.totalOrders ?? 0}
          </div>
          <div className="stat-footer">Customer orders</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section-title">
        <h2>Quick Actions</h2>
        <p>Manage your store operations</p>
      </div>

      <div className="admin-actions">
        <Link to="/admin/products" className="admin-card">
          <div className="card-icon card-icon-blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="card-content">
            <h3>Manage Products</h3>
            <p>View, add, edit, and delete products</p>
          </div>
          <div className="card-arrow">→</div>
        </Link>

        <Link to="/admin/orders" className="admin-card">
          <div className="card-icon card-icon-purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <div className="card-content">
            <h3>View Orders</h3>
            <p>See all customer orders</p>
          </div>
          <div className="card-arrow">→</div>
        </Link>

            <Link to="/admin/categories" className="admin-card">
      <div className="card-icon card-icon-orange">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      </div>
      <div className="card-content">
        <h3>Manage Categories</h3>
        <p>Organize products into categories</p>
      </div>
      <div className="card-arrow">→</div>
    </Link>

        <Link to="/" className="admin-card">
          <div className="card-icon card-icon-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className="card-content">
            <h3>Back to Store</h3>
            <p>Return to the main shopping page</p>
          </div>
          <div className="card-arrow">→</div>
        </Link>
      </div>
    </div>
  );
}