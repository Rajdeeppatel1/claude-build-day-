import { createContext, useContext, useState, useEffect } from 'react';
import { initializeSeedData } from '../data/seedData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeSeedData();
    const savedUser = localStorage.getItem('annasetu_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('annasetu_users') || '[]');
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem('annasetu_current_user', JSON.stringify(safeUser));
      return { success: true, user: safeUser };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('annasetu_users') || '[]');
    const exists = users.find((u) => u.email === userData.email);
    if (exists) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = {
      ...userData,
      id: `${userData.role}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      verified: userData.role === 'donor',
    };
    users.push(newUser);
    localStorage.setItem('annasetu_users', JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem('annasetu_current_user', JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('annasetu_current_user');
  };

  const updateProfile = (updates) => {
    const users = JSON.parse(localStorage.getItem('annasetu_users') || '[]');
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem('annasetu_users', JSON.stringify(users));
      const { password: _, ...safeUser } = users[idx];
      setUser(safeUser);
      localStorage.setItem('annasetu_current_user', JSON.stringify(safeUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
