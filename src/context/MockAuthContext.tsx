
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar sessão persistida no localStorage
  useEffect(() => {
    const loadPersistedAuth = () => {
      try {
        const savedAuth = localStorage.getItem('fluida_auth_session');
        if (savedAuth) {
          const authData = JSON.parse(savedAuth);
          console.log('🔐 Carregando sessão persistida:', authData);
          setUser(authData.user);
          setIsAuthenticated(authData.isAuthenticated);
        } else {
          // Se não há sessão salva, criar um usuário mock automaticamente para desenvolvimento
          console.log('🔐 Criando usuário mock para desenvolvimento');
          const mockUser: UserProfile = {
            id: '1d0af739-6f08-4f35-83a5-8ce85b99d32a',
            email: 'giovani.g@live.com',
            nome: 'Dr. João Silva',
            role: 'admin',
            workspace_id: 'ws_default',
            clinica: 'Clínica Fluida',
            cidade: 'São Paulo',
            telefone: '(11) 99999-9999',
            equipamentos: ['adella', 'ultralift'],
            idioma: 'PT'
          };
          
          setUser(mockUser);
          setIsAuthenticated(true);
          
          // Salvar no localStorage
          const authData = {
            user: mockUser,
            isAuthenticated: true
          };
          localStorage.setItem('fluida_auth_session', JSON.stringify(authData));
          console.log('💾 Usuário mock criado e salvo:', mockUser);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar sessão persistida:', error);
        localStorage.removeItem('fluida_auth_session');
      } finally {
        setIsLoading(false);
      }
    };

    loadPersistedAuth();
  }, []);

  // Salvar sessão no localStorage sempre que o estado mudar
  useEffect(() => {
    if (user && isAuthenticated) {
      const authData = {
        user,
        isAuthenticated
      };
      localStorage.setItem('fluida_auth_session', JSON.stringify(authData));
      console.log('💾 Sessão salva no localStorage:', authData);
    }
  }, [user, isAuthenticated]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usar o UUID real do banco de dados para garantir consistência
      const authenticatedUser: UserProfile = {
        id: '1d0af739-6f08-4f35-83a5-8ce85b99d32a',
        email: email,
        nome: 'Dr. João Silva',
        role: 'admin',
        workspace_id: 'ws_default',
        clinica: 'Clínica Fluida',
        cidade: 'São Paulo',
        telefone: '(11) 99999-9999',
        equipamentos: ['adella', 'ultralift'],
        idioma: 'PT'
      };
      
      setUser(authenticatedUser);
      setIsAuthenticated(true);
      
      console.log('✅ Login realizado com sucesso:', authenticatedUser);
    } catch (error: any) {
      setError(error.message || 'Erro no login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem('fluida_auth_session');
    console.log('🚪 Logout realizado');
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simular registro
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: UserProfile = {
        id: '1d0af739-6f08-4f35-83a5-8ce85b99d32a',
        email: userData.email,
        nome: userData.name || 'Dr. João Silva',
        role: 'admin',
        workspace_id: 'ws_default',
        clinica: userData.clinic || 'Clínica Fluida',
        cidade: userData.city || 'São Paulo',
        telefone: userData.phone || '(11) 99999-9999',
        equipamentos: userData.equipment || ['adella', 'ultralift'],
        idioma: userData.language || 'PT'
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      console.log('✅ Registro realizado com sucesso:', newUser);
    } catch (error: any) {
      setError(error.message || 'Erro no registro');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (data: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      console.log('👤 Usuário atualizado:', updatedUser);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // Mock implementation
    return true;
  };

  const resetPassword = async (email: string): Promise<void> => {
    console.log('📧 Reset de senha solicitado para:', email);
  };

  const refreshAuth = async (): Promise<void> => {
    // Recarregar dados do usuário se necessário
    console.log('🔄 Refresh de autenticação');
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
