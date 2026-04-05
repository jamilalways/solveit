import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      if (!error.response) {
        return { success: false, message: 'Cannot connect to server. Make sure the backend is running on port 5000.' };
      }
      return { success: false, message: error.response?.data?.message || 'Login failed. Check your email and password.' };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password, role });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      if (!error.response) {
        return { success: false, message: 'Cannot connect to server. Make sure the backend is running on port 5000.' };
      }
      const msg = error.response?.data?.message;
      if (msg === 'User already exists') {
        return { success: false, message: 'An account with this email already exists. Please sign in instead.' };
      }
      return { success: false, message: msg || 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
