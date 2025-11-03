// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/Auth'; // <-- 1. Import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* <-- 2. Wrap */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider> {/* <-- 3. Wrap */}
  </React.StrictMode>
);