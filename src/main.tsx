// main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';
import axios from 'axios';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';   // ← ADD THIS
import './index.css'
import App from './App.tsx'

// Configure axios base URL for all API requests
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>              {/* ← ADD wrapper (opens) */}
          <App />
        </ToastProvider>             {/* ← ADD wrapper (closes) */}
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)