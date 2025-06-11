
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => { throw new Error('Not implemented') },
  logout: async () => { throw new Error('Not implemented') },
  register: async () => { throw new Error('Not implemented') },
  updateUser: async () => { throw new Error('Not implemented') },
  updatePassword: async () => false,
  resetPassword: async () => { throw new Error('Not implemented') },
  refreshAuth: async () => { throw new Error('Not implemented') },
});

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>({
    id: '1',
    email: 'usuario@exemplo.com',
    nome: 'Usuário de Teste',
    role: 'admin',
    name: 'Usuário de Teste'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simular login
    setTimeout(() => {
      setUser({
        id: '1',
        email: email,
        nome: 'Usuário Logado',
        role: 'admin',
        name: 'Usuário Logado'
      });
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000);
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    // Simular registro
    setTimeout(() => {
      setUser({
        id: '1',
        email: userData.email,
        nome: userData.name || 'Novo Usuário',
        role: 'admin',
        name: userData.name || 'Novo Usuário'
      });
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000);
  };

  const updateUser = async (data: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    return true;
  };

  const resetPassword = async (email: string): Promise<void> => {
    // Mock implementation
  };

  const refreshAuth = async (): Promise<void> => {
    // Mock implementation
  };

  const value = {
    user,
    loading: isLoading,
    isLoading,
    isAuthenticated,
    error,
    login,
    logout,
    register,
    updateUser,
    updatePassword,
    resetPassword,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
