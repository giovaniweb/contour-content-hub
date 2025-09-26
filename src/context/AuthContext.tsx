
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/auth';

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: { 
    email: string; 
    password: string; 
    nome: string;
    role?: string;
    clinica?: string;
    cidade?: string;
    telefone?: string;
    especialidade?: string;
    experiencia?: string;
    estado?: string;
    endereco_completo?: string;
    equipamentos?: string[];
    observacoes_conteudo?: string;
    idioma?: "PT" | "EN" | "ES";
    foto_url?: string;
  }) => Promise<{ error?: any }>;
  refreshUser: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  validateAuthState: () => Promise<boolean>;
  debugAuth: () => void;
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
              // Try to get actual role from database even in error case
              console.log('🔄 Erro ao buscar perfil, tentando fallback inteligente...');
              try {
                const { data: dbProfile } = await supabase
                  .from('perfis')
                  .select('role, nome, clinica, cidade')
                  .eq('id', session.user.id)
                  .single();
                
                const fallbackUser: UserProfile = {
                  id: session.user.id,
                  email: session.user.email || '',
                  nome: dbProfile?.nome || session.user.email?.split('@')[0] || 'Usuário',
                  role: (dbProfile?.role || 'user') as UserRole,
                  workspace_id: 'default',
                  clinica: dbProfile?.clinica,
                  cidade: dbProfile?.cidade,
                  idioma: 'PT' as 'PT' | 'EN' | 'ES'
                };
                console.log('✅ Fallback inteligente criado com role:', dbProfile?.role || 'user');
                setUser(fallbackUser);
              } catch (fallbackError) {
                console.log('⚠️ Fallback inteligente falhou, usando dados básicos');
                const basicFallback: UserProfile = {
                  id: session.user.id,
                  email: session.user.email || '',
                  nome: session.user.email?.split('@')[0] || 'Usuário',
                  role: 'user' as UserRole,
                  workspace_id: 'default',
                  idioma: 'PT' as 'PT' | 'EN' | 'ES'
                };
                setUser(basicFallback);
              }
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
            // Try intelligent fallback for initial session check too
            console.log('🔄 Erro no perfil inicial, tentando fallback inteligente...');
            try {
              const { data: dbProfile } = await supabase
                .from('perfis')
                .select('role, nome, clinica, cidade')
                .eq('id', session.user.id)
                .single();
              
              const fallbackUser: UserProfile = {
                id: session.user.id,
                email: session.user.email || '',
                nome: dbProfile?.nome || session.user.email?.split('@')[0] || 'Usuário',
                role: (dbProfile?.role || 'user') as UserRole,
                workspace_id: 'default',
                clinica: dbProfile?.clinica,
                cidade: dbProfile?.cidade,
                idioma: 'PT' as 'PT' | 'EN' | 'ES'
              };
              console.log('✅ Fallback inicial inteligente criado com role:', dbProfile?.role || 'user');
              setUser(fallbackUser);
            } catch (fallbackError) {
              console.log('⚠️ Fallback inicial falhou, usando dados básicos');
              const basicFallback: UserProfile = {
                id: session.user.id,
                email: session.user.email || '',
                nome: session.user.email?.split('@')[0] || 'Usuário',
                role: 'user' as UserRole,
                workspace_id: 'default',
                idioma: 'PT' as 'PT' | 'EN' | 'ES'
              };
              setUser(basicFallback);
            }
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

  // Separate effect for periodic validation
  useEffect(() => {
    let validationInterval: NodeJS.Timeout;
    
    if (!isLoading && session && user) {
      console.log('🕐 Iniciando validação periódica...');
      validationInterval = setInterval(async () => {
        console.log('🕐 Executando validação periódica...');
        await validateAuthState();
      }, 30000); // 30 seconds
    }

    return () => {
      if (validationInterval) {
        console.log('🧹 Parando validação periódica');
        clearInterval(validationInterval);
      }
    };
  }, [isLoading, session, user]);

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

  const mapSupabaseAuthError = (error: any): string => {
    const message = (error?.message || '').toLowerCase();
    if (error?.status === 400 || message.includes('invalid login credentials')) {
      return 'Email ou senha incorretos';
    }
    if (message.includes('email not confirmed')) {
      return 'Email não confirmado. Verifique sua caixa de entrada.';
    }
    if (message.includes('too many requests')) {
      return 'Muitas tentativas. Tente novamente em alguns minutos.';
    }
    return error?.message || 'Não foi possível entrar. Tente novamente.';
  };

  const login = async (email: string, password: string): Promise<void> => {
    console.log('🔐 Tentando fazer login para:', email);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Erro no login:', error);
        throw new Error(mapSupabaseAuthError(error));
      }

      console.log('✅ Login realizado com sucesso');
      // Success: onAuthStateChange will handle state updates
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { 
    email: string; 
    password: string; 
    nome: string;
    role?: string;
    clinica?: string;
    cidade?: string;
    telefone?: string;
    especialidade?: string;
    experiencia?: string;
    estado?: string;
    endereco_completo?: string;
    equipamentos?: string[];
    observacoes_conteudo?: string;
    idioma?: "PT" | "EN" | "ES";
    foto_url?: string;
  }) => {
    try {
      console.log('📝 Registrando novo usuário:', userData.email);
      setIsLoading(true);
      
      // Validação básica antes de tentar registrar
      if (!userData.email || !userData.password || !userData.nome) {
        throw new Error('Dados obrigatórios não fornecidos');
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            nome: userData.nome,
            telefone: userData.telefone,
            cidade: userData.cidade,
            clinica: userData.clinica,
            especialidade: userData.especialidade
          }
        }
      });

      if (error) {
        console.error('❌ Erro no registro:', error);
        // Mapear erros comuns
        if (error.message.includes('User already registered')) {
          throw new Error('Este email já está cadastrado. Faça login ou use um email diferente.');
        }
        if (error.message.includes('Password should be at least')) {
          throw new Error('A senha deve ter pelo menos 6 caracteres.');
        }
        if (error.message.includes('Invalid email')) {
          throw new Error('Por favor, digite um email válido.');
        }
        throw new Error(error.message || 'Erro ao criar conta');
      }

      // Send welcome email after successful registration
      if (data.user) {
        try {
          console.log('📧 Enviando email de boas-vindas');
          await supabase.functions.invoke('send-signup-confirmation', {
            body: {
              email: userData.email,
              name: userData.nome,
              userId: data.user.id
            }
          });
          console.log('✅ Email de boas-vindas enviado com sucesso');
        } catch (emailError) {
          console.warn('⚠️ Erro ao enviar email de boas-vindas (não crítico):', emailError);
        }

        try {
          console.log('📝 Tentando criar perfil no banco de dados');
          const { error: profileError } = await supabase
            .from('perfis')
            .insert({
              id: data.user.id,
              email: userData.email,
              nome: userData.nome,
              role: (userData.role || 'user') as UserRole,
              clinica: userData.clinica,
              cidade: userData.cidade,
              telefone: userData.telefone,
              especialidade: userData.especialidade,
              estado: userData.estado,
              endereco_completo: userData.endereco_completo,
              equipamentos: userData.equipamentos,
              observacoes_conteudo: userData.observacoes_conteudo,
              idioma: userData.idioma || 'PT',
              foto_url: userData.foto_url
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
    } catch (error: any) {
      console.error('❌ Erro crítico no registro:', error);
      return { error: { message: error.message || 'Erro inesperado ao criar conta' } };
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

  const refreshAuth = async () => {
    console.log('🔄 Forçando refresh completo da autenticação...');
    setIsLoading(true);
    
    try {
      // First, get the current session from Supabase
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Erro ao obter sessão atual:', sessionError);
        setSession(null);
        setUser(null);
        return;
      }

      console.log('📋 Sessão atual obtida:', { hasSession: !!currentSession });
      setSession(currentSession);

      if (currentSession?.user) {
        console.log('👤 Usuário encontrado, buscando perfil atualizado...');
        
        // Force fetch the user profile from database
        const { data: profile, error: profileError } = await supabase
          .from('perfis')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();

        if (profileError) {
          console.error('❌ Erro ao buscar perfil atualizado:', profileError);
          // Create fallback user
          const fallbackUser: UserProfile = {
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            nome: currentSession.user.email?.split('@')[0] || 'Usuário',
            role: 'user' as UserRole,
            workspace_id: 'default',
            idioma: 'PT' as 'PT' | 'EN' | 'ES'
          };
          setUser(fallbackUser);
        } else {
          console.log('✅ Perfil atualizado obtido:', { role: profile.role, nome: profile.nome });
          const userProfile: UserProfile = {
            id: profile.id,
            email: profile.email,
            nome: profile.nome,
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
      } else {
        console.log('🚫 Nenhum usuário na sessão atualizada');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Erro crítico no refresh da autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateAuthState = async (): Promise<boolean> => {
    console.log('🔍 Validando estado de autenticação...');
    
    if (!session || !user) {
      console.log('⚠️ Validação falhou: faltam sessão ou usuário');
      return false;
    }

    try {
      // Check if session is still valid
      const { data: { user: currentAuthUser }, error } = await supabase.auth.getUser();
      
      if (error || !currentAuthUser) {
        console.log('⚠️ Validação falhou: sessão inválida ou usuário não encontrado');
        return false;
      }

      // Check if profile exists and matches
      const { data: profile, error: profileError } = await supabase
        .from('perfis')
        .select('id, email, role, nome')
        .eq('id', currentAuthUser.id)
        .single();

      if (profileError) {
        console.log('⚠️ Validação falhou: erro ao buscar perfil', profileError);
        return false;
      }

      const isValid = profile.role === user.role && profile.email === user.email;
      console.log('🔍 Comparação de dados:', { 
        isValid,
        profileRole: profile.role,
        userRole: user.role,
        profileEmail: profile.email,
        userEmail: user.email
      });

      // AUTO-CORRECTION: If data doesn't match, update frontend with database data
      if (!isValid) {
        console.log('🔄 INCONSISTÊNCIA DETECTADA! Corrigindo dados do frontend...');
        
        const correctedUser: UserProfile = {
          ...user,
          role: (profile.role || 'user') as UserRole,
          email: profile.email,
          nome: profile.nome
        };
        
        setUser(correctedUser);
        console.log('✅ Dados corrigidos automaticamente:', { 
          oldRole: user.role, 
          newRole: profile.role,
          oldEmail: user.email,
          newEmail: profile.email 
        });
        
        return true; // Return true because we fixed it
      }

      return isValid;
    } catch (error) {
      console.error('❌ Erro na validação do estado de auth:', error);
      return false;
    }
  };

  const debugAuth = () => {
    console.group('🔍 DEBUG: Estado da Autenticação');
    console.log('Usuário:', user);
    console.log('Sessão:', session);
    console.log('Autenticado:', !!session && !!user);
    console.log('Carregando:', isLoading);
    console.log('ID do usuário:', user?.id);
    console.log('Role do usuário:', user?.role);
    console.log('Email do usuário:', user?.email);
    console.log('Session valid:', session?.expires_at ? new Date(session.expires_at * 1000) > new Date() : false);
    console.groupEnd();
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!session && !!user,
    isLoading,
    login,
    logout,
    register,
    refreshUser,
    refreshAuth,
    validateAuthState,
    debugAuth
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
