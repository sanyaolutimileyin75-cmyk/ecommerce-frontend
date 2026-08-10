import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';
import axios from 'axios';
import { AuthProvider } from './context/AuthContext';
import './index.css'
import App from './App.tsx'

// Configure axios base URL for all API requests
// Uses VITE_API_URL from .env file
// Falls back to empty string (uses Vite proxy) if not set
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)