import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserProfile } from '../types';

const MOCK_USER_KEY = 'solx_mock_user';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  mockLogin: (email: string, displayName: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load mock user from localStorage on mount
    const storedUser = localStorage.getItem(MOCK_USER_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(MOCK_USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const mockLogin = (email: string, displayName: string) => {
    const mockUser: UserProfile = {
      uid: `mock_${Date.now()}`,
      email,
      displayName,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D1117&color=81ecff&bold=true`,
      role: 'client',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = async () => {
    localStorage.removeItem(MOCK_USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, mockLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
