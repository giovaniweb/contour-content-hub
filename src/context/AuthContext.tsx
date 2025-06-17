
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
    let mounted = true;
    console.log('🔧 Configurando AuthProvider...');

    const setupAuth = async () => {
      try {
        console.log('🔍 Verificando sessão inicial...');
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📊 Sessão inicial:', { hasSession: !!session, userId: session?.user?.id });
        
        if (mounted) {
          if (session?.user) {
            console.log('👤 Usuário encontrado na sessão, buscando perfil...');
            try {
              const userProfile = await fetchUserProfile(session.user.id);
              console.log('✅ Perfil do usuário carregado:', { nome: userProfile?.nome, role: userProfile?.role });
              if (mounted) {
                setUser(userProfile);
                setIsAuthenticated(true);
              }
            } catch (profileError) {
              console.error('❌ Erro ao buscar perfil:', profileError);
              if (mounted) {
                setUser(null);
                setIsAuthenticated(false);
              }
            }
          } else {
            console.log('❌ Nenhuma sessão encontrada');
            setUser(null);
            setIsAuthenticated(false);
          }
          setIsLoading(false);
        }

        // Set up auth state listener
        console.log('🔄 Configurando listener de autenticação...');
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;

            console.log('🔄 Mudança no estado de autenticação:', { event, session: !!session });
            
            if (session?.user) {
              try {
                console.log('👤 Carregando perfil após mudança de estado...');
                const userProfile = await fetchUserProfile(session.user.id);
                console.log('✅ Perfil carregado:', { nome: userProfile?.nome });
                if (mounted) {
                  setUser(userProfile);
                  setIsAuthenticated(true);
                }
              } catch (error) {
                console.error('❌ Erro ao buscar perfil na mudança de estado:', error);
                if (mounted) {
                  setUser(null);
                  setIsAuthenticated(false);
                }
              }
            } else {
              console.log('❌ Usuário deslogado');
              if (mounted) {
                setUser(null);
                setIsAuthenticated(false);
              }
            }
            
            if (mounted) {
              setIsLoading(false);
            }
          }
        );

        return () => {
          console.log('🧹 Limpando subscription de autenticação');
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('❌ Erro na configuração de autenticação:', error);
        if (mounted) {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    setupAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🚀 Iniciando login para:', email);
      setError(null);
      setIsLoading(true);
      
      const { data, error } = await loginWithEmailAndPassword(email, password);
      console.log('📊 Resultado do login:', { success: !error, error: error?.message });
      
      if (error) {
        console.error('❌ Erro no login:', error);
        throw error;
      }
      
      console.log('✅ Login realizado com sucesso');
      // User profile will be set by the auth state change handler
      return;
    } catch (error: any) {
      console.error('❌ Erro no processo de login:', error);
      setError(error.message || 'Error logging in');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Fazendo logout...');
      setError(null);
      await logoutUser();
      console.log('✅ Logout realizado');
    } catch (error: any) {
      console.error('❌ Erro no logout:', error);
      setError(error.message || 'Error logging out');
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
      console.log('📝 Registrando usuário:', userData.email);
      setError(null);
      setIsLoading(true);
      await registerUserService(userData);
      console.log('✅ Usuário registrado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro no registro:', error);
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
      
      // Update local user state with new data
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error: any) {
      console.error('Update user error:', error);
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
      console.error('Update password error:', error);
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
      console.error('Reset password error:', error);
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
      console.error('Refresh auth error:', error);
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
