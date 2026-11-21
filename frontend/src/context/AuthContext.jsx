import React, { createContext, useState, useContext, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ username, password });
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setToken(data.token);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isFaculty = user?.role === 'ROLE_FACULTY';
  const isStudent = user?.role === 'ROLE_STUDENT';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated, isAdmin, isFaculty, isStudent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
