// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/Auth';

const Navbar = () => {
  const { user, logout } = useAuth();

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#222',
    color: 'white',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    margin: '0 10px',
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={{ ...linkStyle, fontSize: '1.5rem', fontWeight: 'bold' }}>
        CyberDash
      </Link>
      <div>
        <Link to="/" style={linkStyle}>
          Dashboard
        </Link>
        {user ? (
          <>
            <Link to="/admin" style={linkStyle}>
              Admin Panel
            </Link>
            <button onClick={logout} style={{ marginLeft: '10px' }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={linkStyle}>
            Admin Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;