
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/lims';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock users for development - replace with API call
  const mockUsers: User[] = [
    {
      id: '1',
      username: 'reception1',
      fullName: 'Nguyễn Thị Thu',
      role: 'reception',
      email: 'reception@lab.com',
      isActive: true,
    },
    {
      id: '2',
      username: 'tester1',
      fullName: 'Trần Văn Nam',
      role: 'tester',
      email: 'tester@lab.com',
      isActive: true,
    },
    {
      id: '3',
      username: 'manager1',
      fullName: 'Lê Thị Hoa',
      role: 'manager',
      email: 'manager@lab.com',
      isActive: true,
    },
  ];

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('limsUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // API_INTEGRATION: Call POST /api/v1/auth/login with body: { username, password }
      // API_INTEGRATION: Expects response: { success: boolean, user: User, token: string }
      
      // Mock authentication - replace with actual API call
      const mockUser = mockUsers.find(u => u.username === username);
      if (mockUser && password === 'password123') {
        setUser(mockUser);
        localStorage.setItem('limsUser', JSON.stringify(mockUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // API_INTEGRATION: Call POST /api/v1/auth/logout
    setUser(null);
    localStorage.removeItem('limsUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
