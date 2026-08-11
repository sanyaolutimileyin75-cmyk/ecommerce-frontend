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
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Login failed');
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  /* fill demo credentials with one tap */
  const fillDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* ── header ── */}
        <div className="login-header">
          <div className="login-icon" aria-hidden="true">🔐</div>
          <h1>Admin Login</h1>
          <p>Sign in to access the dashboard</p>
        </div>

        {/* ── form ── */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>

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
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* error message */}
          {error && (
            <div className="error-message" role="alert">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={loading || !username.trim() || !password.trim()}
            aria-label="Sign in"
          >
            {loading ? (
              <span className="login-btn-loading">
                <span className="login-spinner" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

        </form>

        {/* ── demo hint ── */}
        <div className="login-hint">
          <strong>Demo credentials</strong>
          <div className="login-hint-row">
            <span>Username: <code>admin</code></span>
            <span>Password: <code>admin123</code></span>
          </div>
          <button
            type="button"
            className="fill-demo-btn"
            onClick={fillDemo}
          >
            Fill demo credentials
          </button>
        </div>

      </div>
    </div>
  );
}