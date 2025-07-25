import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface Badge {
  name: string;
  description: string;
  earnedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  semester: number;
  reputation: number;
  avatar?: string;
  badges?: Badge[];
  questionsAsked?: number;
  questionsAnswered?: number;
  bestAnswers?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  
  const login = async (email: string, password: string) => {
  setIsLoading(true);
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

    const { token, user } = res.data;

    if (token) {
      localStorage.setItem('token', token); // ✅ Store token
      setUser(user); // ✅ Set user
    } else {
      throw new Error('No token received');
    }
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Login failed');
  } finally {
    setIsLoading(false);
  }
};


  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
