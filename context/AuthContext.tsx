import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage for session simulation
    const storedUser = localStorage.getItem('connecthub_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const foundUser = MOCK_USERS.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('connecthub_user', JSON.stringify(foundUser));
    } else {
      throw new Error('User not found (Try: alex@example.com)');
    }
  };

  const register = async (username: string, email: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // Check if exists
    if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error("Email already taken");
    }
    
    // Create new mock user
    const newUser: User = {
        id: `u${Date.now()}`,
        username,
        email,
        avatar: `https://ui-avatars.com/api/?name=${username}&background=random`,
        followers: [],
        following: []
    };
    
    // In a real app we'd add to DB, here we just set session
    setUser(newUser);
    localStorage.setItem('connecthub_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('connecthub_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
