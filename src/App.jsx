// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar'; // <-- 1. Import

function App() {
  return (
    <>
      <Navbar /> {/* <-- 2. Add Navbar here */}
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;