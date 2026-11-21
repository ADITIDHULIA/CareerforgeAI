import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('careerforge_user');
      return savedUser && savedUser !== 'undefined' ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem('careerforge_user');
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('careerforge_token');
    return savedToken && savedToken !== 'undefined' ? savedToken : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const savedToken = localStorage.getItem('careerforge_token');
      if (savedToken) {
        try {
          const freshUser = await authService.getCurrentUser();
          setUser(freshUser);
          localStorage.setItem('careerforge_user', JSON.stringify(freshUser));
        } catch (error) {
          console.error('Session verification failed:', error);
          localStorage.removeItem('careerforge_token');
          localStorage.removeItem('careerforge_user');
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    if (!newToken || !newUser) {
      console.error('Invalid credentials passed to login:', { newToken, newUser });
      return;
    }
    localStorage.setItem('careerforge_token', newToken);
    localStorage.setItem('careerforge_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    localStorage.setItem('careerforge_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const refreshUser = async () => {
    try {
      const freshUser = await authService.getCurrentUser();
      updateUser(freshUser);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
