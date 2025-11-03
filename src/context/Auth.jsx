// src/context/Auth.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase'; // Import our supabase client

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an active session when the app loads
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for changes in auth state (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 3. Define auth functions
  const login = (email, password) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const logout = () => {
    return supabase.auth.signOut();
  };

  // 4. Pass down the values
  const value = {
    user,
    login,
    logout,
  };

  // Don't render the app until we've checked for a user
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 5. Create a custom hook to use the context easily
export const useAuth = () => {
  return useContext(AuthContext);
};