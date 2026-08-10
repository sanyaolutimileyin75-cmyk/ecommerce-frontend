import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

// Type for the admin user
type Admin = {
  id: string;
  username: string;
};

// Type for what the context provides
type AuthContextType = {
  admin: Admin | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

// Create the context (starts as undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component - wraps the app and provides auth state
export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if a token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      setLoading(false);
      return;
    }

    // Set the token as a default header for all axios requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Verify the token with the backend
    axios
      .get('/api/auth/me')
      .then((res) => setAdmin(res.data.admin))
      .catch(() => {
        // Token is invalid/expired - clear it
        localStorage.removeItem('adminToken');
        delete axios.defaults.headers.common['Authorization'];
      })
      .finally(() => setLoading(false));
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    const response = await axios.post('/api/auth/login', { username, password });
    const { token, admin } = response.data;

    // Save token to localStorage (persists between page refreshes)
    localStorage.setItem('adminToken', token);
    // Set default axios header for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Update state
    setAdmin(admin);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['Authorization'];
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so components can easily access auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}