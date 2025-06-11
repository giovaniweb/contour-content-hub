
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
    
    const initializeAuth = async () => {
      try {
        // Verifica sessão inicial
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('AuthProvider: Sessão inicial obtida', { session: !!session, error: sessionError });
        
        if (sessionError) {
          console.error('AuthProvider: Erro ao obter sessão inicial:', sessionError);
          setUser(null);
          setIsAuthenticated(false);
          setError('Erro ao verificar sessão');
          setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('AuthProvider: Usuário encontrado na sessão, buscando perfil');
          try {
            const userProfile = await fetchUserProfile(session.user.id);
            console.log('AuthProvider: Perfil do usuário obtido', { profile: !!userProfile });
            
            if (userProfile) {
              setUser(userProfile);
              setIsAuthenticated(true);
              setError(null);
            } else {
              console.warn('AuthProvider: Perfil do usuário não encontrado');
              setUser(null);
              setIsAuthenticated(false);
              setError('Perfil do usuário não encontrado');
            }
          } catch (error) {
            console.error('AuthProvider: Erro ao carregar perfil do usuário:', error);
            setUser(null);
            setIsAuthenticated(false);
            setError('Erro ao carregar perfil do usuário');
          }
        } else {
          console.log('AuthProvider: Nenhuma sessão ativa encontrada');
          setUser(null);
          setIsAuthenticated(false);
          setError(null);
        }
      } catch (error) {
        console.error('AuthProvider: Erro durante inicialização:', error);
        setUser(null);
        setIsAuthenticated(false);
        setError('Erro ao configurar autenticação');
      } finally {
        console.log('AuthProvider: Inicialização concluída, definindo loading como false');
        setIsLoading(false);
      }
    };

    // Configura listener para mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Mudança de estado de autenticação', { event, session: !!session });
        
        if (session?.user) {
          try {
            const userProfile = await fetchUserProfile(session.user.id);
            console.log('AuthProvider: Perfil atualizado via listener', { profile: !!userProfile });
            
            if (userProfile) {
              setUser(userProfile);
              setIsAuthenticated(true);
              setError(null);
            } else {
              setUser(null);
              setIsAuthenticated(false);
              setError('Perfil do usuário não encontrado');
            }
          } catch (error) {
            console.error('AuthProvider: Erro ao carregar perfil via listener:', error);
            setUser(null);
            setIsAuthenticated(false);
            setError('Erro ao carregar perfil do usuário');
          }
        } else {
          console.log('AuthProvider: Usuário deslogado via listener');
          setUser(null);
          setIsAuthenticated(false);
          setError(null);
        }
      }
    );

    // Inicializa autenticação
    initializeAuth();

    // Cleanup
    return () => {
      console.log('AuthProvider: Limpando subscription');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Tentando fazer login');
      setError(null);
      
      const { data, error } = await loginWithEmailAndPassword(email, password);
      
      if (error) {
        console.error('AuthProvider: Erro no login:', error);
        throw error;
      }
      
      console.log('AuthProvider: Login realizado com sucesso');
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
