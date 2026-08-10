import { useState } from 'react';
import axios from 'axios';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call login from AuthContext
      await login(username, password);
      // On success, go to admin dashboard
      navigate('/admin');
    } catch (err) {
      // Show error from backend, or default message
      if (axios.isAxiosError(err)) {
  setError(err.response?.data?.error || 'Login failed');
} else {
  setError('Login failed');
}
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🔐</div>
          <h1>Admin Login</h1>
          <p>Sign in to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
  <div className="form-group">
    <label htmlFor="username">Username</label>
    <input
      id="username"
      type="text"
      name="username"
      autoComplete="username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder="Enter your username"
      required
      autoFocus
    />
  </div>

  <div className="form-group">
    <label htmlFor="password">Password</label>
    <input
      id="password"
      type="password"
      name="password"
      autoComplete="current-password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter your password"
      required
    />
  </div>

  {error && <div className="error-message">{error}</div>}

  <button type="submit" className="login-btn" disabled={loading}>
    {loading ? 'Signing in...' : 'Sign In'}
  </button>
</form>

        <div className="login-hint">
          <strong>Demo credentials:</strong>
          <br />
          Username: <code>admin</code> · Password: <code>admin123</code>
        </div>
      </div>
    </div>
  );
}