
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/types/auth';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register?: (userData: any) => Promise<void>;
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuthStatus = async () => {
      try {
        // Simulate authenticated user for development
        const mockUser: UserProfile = {
          id: '1',
          email: 'user@fluida.app',
          nome: 'Usuario Fluida',
          name: 'Usuario Fluida',
          role: 'admin',
          workspace_id: 'workspace-1',
          profilePhotoUrl: undefined,
          clinica: 'Clínica Fluida',
          cidade: 'São Paulo',
          telefone: '(11) 99999-9999',
          equipamentos: ['eq1', 'eq2'],
          idioma: 'PT'
        };
        setUser(mockUser);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login
      const mockUser: UserProfile = {
        id: '1',
        email,
        nome: 'Usuario Fluida',
        name: 'Usuario Fluida',
        role: 'admin',
        workspace_id: 'workspace-1',
        profilePhotoUrl: undefined,
        clinica: 'Clínica Fluida',
        cidade: 'São Paulo',
        telefone: '(11) 99999-9999',
        equipamentos: ['eq1', 'eq2'],
        idioma: 'PT'
      };
      setUser(mockUser);
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
