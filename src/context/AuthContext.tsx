import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { fetchUserProfile, loginWithEmailAndPassword, logoutUser, registerUser as registerUserService, updateUserPassword as updateUserPasswordService, updateUserProfile as updateUserProfileService } from '@/services/authService';
import { UserProfile, AuthContextType } from '@/types/auth';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => { throw new Error('Not implemented') },
  logout: async () => { throw new Error('Not implemented') },
  register: async () => { throw new Error('Not implemented') },
  updateUser: async () => { throw new Error('Not implemented') },
  updatePassword: async () => false,
  resetPassword: async () => { throw new Error('Not implemented') },
  refreshAuth: async () => { throw new Error('Not implemented') },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('AuthProvider: Inicializando autenticação');
    
    let mounted = true;

    // Configura listener para mudanças de estado de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Mudança de estado de autenticação', { event, session: !!session });
        
        if (!mounted) return;

        if (session?.user) {
          try {
            console.log('AuthProvider: Buscando perfil do usuário');
            const userProfile = await fetchUserProfile(session.user.id);
            
            if (mounted && userProfile) {
              console.log('AuthProvider: Perfil carregado com sucesso');
              setUser(userProfile);
              setIsAuthenticated(true);
              setError(null);
            } else if (mounted) {
              console.warn('AuthProvider: Perfil não encontrado');
              setUser(null);
              setIsAuthenticated(false);
              setError('Perfil do usuário não encontrado');
            }
          } catch (error) {
            console.error('AuthProvider: Erro ao carregar perfil:', error);
            if (mounted) {
              setUser(null);
              setIsAuthenticated(false);
              setError('Erro ao carregar perfil do usuário');
            }
          }
        } else {
          console.log('AuthProvider: Usuário deslogado');
          if (mounted) {
            setUser(null);
            setIsAuthenticated(false);
            setError(null);
          }
        }

        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    // Depois verifica a sessão inicial
    const checkInitialSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('AuthProvider: Verificação inicial de sessão', { session: !!session, error: sessionError });
        
        // O onAuthStateChange já vai lidar com isso, então não precisamos duplicar a lógica aqui
        // Apenas garantimos que o loading seja definido se não houver sessão
        if (!session && mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('AuthProvider: Erro na verificação inicial:', error);
        if (mounted) {
          setUser(null);
          setIsAuthenticated(false);
          setError('Erro ao verificar sessão');
          setIsLoading(false);
        }
      }
    };

    checkInitialSession();

    return () => {
      mounted = false;
      console.log('AuthProvider: Limpando subscription');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Iniciando login para', email);
      setError(null);
      
      const { data, error } = await loginWithEmailAndPassword(email, password);
      
      if (error) {
        console.error('AuthProvider: Erro no login:', error);
        throw error;
      }
      
      console.log('AuthProvider: Login realizado com sucesso');
      // O onAuthStateChange vai lidar com a atualização do estado
      return;
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao fazer login';
      console.error('AuthProvider: Erro no login:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      console.log('AuthProvider: Fazendo logout');
      setError(null);
      await logoutUser();
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao fazer logout';
      console.error('AuthProvider: Erro no logout:', errorMessage);
      setError(errorMessage);
      throw error;
    }
  };

  const register = async (userData: { 
    email: string; 
    password: string; 
    name?: string;
    role?: UserProfile["role"];
    clinic?: string;
    city?: string;
    phone?: string;
    equipment?: string[];
    language?: "PT" | "EN" | "ES";
  }) => {
    try {
      console.log('AuthProvider: Registrando usuário');
      setError(null);
      setIsLoading(true);
      await registerUserService(userData);
    } catch (error: any) {
      console.error('AuthProvider: Erro no registro:', error);
      setError(error.message || 'Error registering user');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (data: Partial<UserProfile>) => {
    try {
      if (!user?.id) throw new Error("User is not authenticated");
      
      await updateUserProfileService(user.id, data);
      
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error: any) {
      console.error('AuthProvider: Erro ao atualizar usuário:', error);
      setError(error.message || 'Error updating user');
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setError(null);
      await updateUserPasswordService(newPassword);
      return true;
    } catch (error: any) {
      console.error('AuthProvider: Erro ao atualizar senha:', error);
      setError(error.message || 'Error updating password');
      return false;
    }
  };
  
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error: any) {
      console.error('AuthProvider: Erro ao resetar senha:', error);
      setError(error.message || 'Error resetting password');
      throw error;
    }
  };
  
  const refreshAuth = async (): Promise<void> => {
    try {
      setError(null);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user.id);
        setUser(userProfile);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error: any) {
      console.error('AuthProvider: Erro ao atualizar autenticação:', error);
      setError(error.message || 'Error refreshing authentication');
      throw error;
    }
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

export default AuthProvider;
