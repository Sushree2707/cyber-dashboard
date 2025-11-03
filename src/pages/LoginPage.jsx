// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/Auth'; // Import our hook
import { useNavigate, Navigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { user, login } = useAuth(); // Get user and login function
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // --- THIS IS THE FIXED LINE ---
      const { error } = await login(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        // Successful login, send them to the admin panel
        navigate('/admin');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // If user is already logged in, redirect them
  if (user) {
    return <Navigate to="/admin" />;
  }

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: '50px auto', 
      background: '#1e1e1e', // Dark background
      border: '1px solid #333',
      padding: '2rem',
      borderRadius: '8px'
    }}>
      <h2 style={{ fontWeight: '700' }}>Login to Admin Panel</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ 
              width: '100%', padding: 8, margin: '8px 0',
              background: '#333', color: '#e0e0e0', border: '1px solid #555' 
            }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ 
              width: '100%', padding: 8, margin: '8px 0',
              background: '#333', color: '#e0e0e0', border: '1px solid #555' 
            }}
          />
        </div>
        {error && <p style={{ color: '#FF4136' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px 20px' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;