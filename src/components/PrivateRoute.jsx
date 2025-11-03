// src/components/PrivateRoute.jsx
import React from 'react';
import { useAuth } from '../context/Auth';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { user } = useAuth();

  // If there's a user, show the child page (AdminPanel).
  // If not, redirect to the login page.
  return user ? <Outlet /> : <Navigate to="/login" />;
};

// --- THIS IS THE MISSING LINE ---
export default PrivateRoute;