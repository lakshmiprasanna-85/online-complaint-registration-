import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { connectSocket, disconnectSocket, resetSocket } from '../services/socket';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const saveAuth = (userData) => {
    localStorage.setItem('token', userData.token);
    const { token, ...userInfo } = userData;
    localStorage.setItem('user', JSON.stringify(userInfo));
    setUser(userInfo);
    resetSocket();
    connectSocket();
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    disconnectSocket();
    resetSocket();
    toast.info('Logged out successfully');
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    saveAuth(data.data);
    toast.success(`Welcome back, ${data.data.name}!`);
    return data.data;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    saveAuth(data.data);
    toast.success('Account created successfully!');
    return data.data;
  };

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const { data } = await api.get('/auth/me');
      setUser(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
      connectSocket();
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
