
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/auth';

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<{ error?: any }>;
  refreshUser: () => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthProvider: Iniciando configuração de autenticação...');
    
    let timeoutId: NodeJS.Timeout;
    
    // Timeout de segurança para evitar carregamento infinito
    const safetyTimeout = setTimeout(() => {
      console.log('⚠️ AuthProvider: Timeout de segurança acionado');
      setIsLoading(false);
    }, 10000); // 10 segundos

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('📡 Auth state changed:', { event, sessionExists: !!session });
        
        // Clear any existing timeout
        if (timeoutId) clearTimeout(timeoutId);
        
        setSession(session);
        
        if (session?.user) {
          console.log('👤 Usuário encontrado na sessão:', session.user.id);
          
          // Use timeout to avoid blocking the auth state change
          timeoutId = setTimeout(async () => {
            try {
              await fetchUserProfile(session.user.id);
            } catch (error) {
              console.error('❌ Erro ao buscar perfil do usuário:', error);
              // Create fallback user profile
              const fallbackUser: UserProfile = {
                id: session.user.id,
                email: session.user.email || '',
                nome: session.user.email?.split('@')[0] || 'Usuário',
                name: session.user.email?.split('@')[0] || 'Usuário',
                role: 'user' as UserRole,
                workspace_id: 'default',
                idioma: 'PT' as 'PT' | 'EN' | 'ES'
              };
              setUser(fallbackUser);
            } finally {
              setIsLoading(false);
              clearTimeout(safetyTimeout);
            }
          }, 100);
        } else {
          console.log('🚫 Nenhum usuário na sessão');
          setUser(null);
          setIsLoading(false);
          clearTimeout(safetyTimeout);
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        console.log('🔍 Verificando sessão existente...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erro ao verificar sessão:', error);
          setIsLoading(false);
          clearTimeout(safetyTimeout);
          return;
        }

        console.log('📋 Sessão verificada:', { sessionExists: !!session });
        
        if (session?.user) {
          console.log('👤 Usuário encontrado na verificação inicial:', session.user.id);
          setSession(session);
          
          try {
            await fetchUserProfile(session.user.id);
          } catch (error) {
            console.error('❌ Erro ao buscar perfil inicial:', error);
            // Create fallback user profile
            const fallbackUser: UserProfile = {
              id: session.user.id,
              email: session.user.email || '',
              nome: session.user.email?.split('@')[0] || 'Usuário',
              name: session.user.email?.split('@')[0] || 'Usuário',
              role: 'user' as UserRole,
              workspace_id: 'default',
              idioma: 'PT' as 'PT' | 'EN' | 'ES'
            };
            setUser(fallbackUser);
          }
        } else {
          console.log('🚫 Nenhuma sessão encontrada');
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Erro crítico na verificação de sessão:', error);
      } finally {
        setIsLoading(false);
        clearTimeout(safetyTimeout);
      }
    };

    checkSession();

    return () => {
      console.log('🧹 Limpando subscription de auth');
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(safetyTimeout);
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('👤 Buscando perfil do usuário:', userId);
      
      const { data: profile, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('⚠️ Erro ao buscar perfil (pode não existir):', error);
        
        // Check if user exists in auth.users and create a fallback profile
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser && authUser.id === userId) {
          console.log('📝 Criando perfil fallback para usuário autenticado');
          const fallbackUser: UserProfile = {
            id: authUser.id,
            email: authUser.email || '',
            nome: authUser.email?.split('@')[0] || 'Usuário',
            name: authUser.email?.split('@')[0] || 'Usuário',
            role: 'user' as UserRole,
            workspace_id: 'default',
            idioma: 'PT' as 'PT' | 'EN' | 'ES'
          };
          setUser(fallbackUser);
          return;
        }
        
        throw error;
      }

      if (profile) {
        console.log('✅ Perfil encontrado:', profile.nome);
        const userProfile: UserProfile = {
          id: profile.id,
          email: profile.email,
          nome: profile.nome,
          name: profile.nome,
          role: (profile.role || 'user') as UserRole,
          workspace_id: 'default',
          clinica: profile.clinica,
          cidade: profile.cidade,
          telefone: profile.telefone,
          equipamentos: profile.equipamentos || [],
          idioma: (profile.idioma || 'PT') as 'PT' | 'EN' | 'ES'
        };
        setUser(userProfile);
      }
    } catch (error) {
      console.error('❌ Erro crítico em fetchUserProfile:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Tentando fazer login para:', email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Erro no login:', error);
        return { error };
      }

      console.log('✅ Login realizado com sucesso');
      return { data };
    } catch (error) {
      console.error('❌ Erro crítico no login:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { email: string; password: string; nome: string }) => {
    try {
      console.log('📝 Registrando novo usuário:', userData.email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            nome: userData.nome
          }
        }
      });

      if (error) {
        console.error('❌ Erro no registro:', error);
        return { error };
      }

      // Try to create profile, but don't fail if table doesn't exist
      if (data.user) {
        try {
          console.log('📝 Tentando criar perfil no banco de dados');
          const { error: profileError } = await supabase
            .from('perfis')
            .insert({
              id: data.user.id,
              email: userData.email,
              nome: userData.nome,
              role: 'user' as UserRole
            });

          if (profileError) {
            console.warn('⚠️ Não foi possível criar perfil (tabela pode não existir):', profileError);
            // Don't throw - just log the warning
          } else {
            console.log('✅ Perfil criado com sucesso');
          }
        } catch (profileError) {
          console.warn('⚠️ Erro ao criar perfil (não crítico):', profileError);
        }
      }

      console.log('✅ Registro realizado com sucesso');
      return { data };
    } catch (error) {
      console.error('❌ Erro crítico no registro:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Fazendo logout...');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      console.log('✅ Logout realizado com sucesso');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
    }
  };

  const refreshUser = async () => {
    if (session?.user) {
      console.log('🔄 Atualizando dados do usuário...');
      try {
        await fetchUserProfile(session.user.id);
        console.log('✅ Dados do usuário atualizados');
      } catch (error) {
        console.error('❌ Erro ao atualizar usuário:', error);
      }
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!session && !!user,
    isLoading,
    login,
    logout,
    register,
    refreshUser
  };

  console.log('🔍 AuthProvider estado atual:', {
    hasUser: !!user,
    hasSession: !!session,
    isAuthenticated: !!session && !!user,
    isLoading
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
