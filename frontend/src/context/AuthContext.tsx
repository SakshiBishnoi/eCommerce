import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCartFromBackend, clearCart } from '../store';

interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const dispatch = useDispatch();

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      // Fetch cart from backend when user is authenticated
      dispatch(fetchCartFromBackend() as any);
    }
  }, [dispatch]);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    // Fetch cart from backend when user logs in
    dispatch(fetchCartFromBackend() as any);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // Clear cart when user logs out
    dispatch(clearCart());
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper to get stored user
function getStoredUser(): User | null {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 