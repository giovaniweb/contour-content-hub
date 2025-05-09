
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

// Interface para o usuário com fallback seguro
interface SafeUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

// Estados de inicialização do usuário
const initialUser: SafeUser = {
  id: '',
  email: '',
  role: 'user',
  name: '',
  isAdmin: false,
  isAuthenticated: false
};

/**
 * Hook para acesso seguro ao contexto de autenticação
 * Fornece fallback para quando o AuthProvider não está disponível
 */
export const useSafeAuth = () => {
  // Estado local para caso o contexto de autenticação não esteja disponível
  const [fallbackUser, setFallbackUser] = useState<SafeUser>(initialUser);
  const [loading, setLoading] = useState(true);
  
  // Tenta usar o contexto real de autenticação
  const auth = useAuth();
  
  // Se não conseguir acessar o hook useAuth (ocorrer erro), usará o fallback
  const user = auth?.user || fallbackUser;
  const isAuthenticated = !!auth?.user?.id || fallbackUser.isAuthenticated;
  const isAdmin = auth?.isAdmin?.() || fallbackUser.isAdmin;
  
  useEffect(() => {
    // Tentativa de carregar dados do usuário de alguma fonte persistente (localStorage)
    try {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setFallbackUser({
          ...initialUser,
          ...parsedUser,
          isAuthenticated: true
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Cria objeto de fallback para funções de autenticação, verificando se existem no auth
  const signIn = auth?.signIn || (async () => ({ user: null, error: new Error('Context not available') }));
  const signOut = auth?.signOut || (async () => ({ error: null }));
  const signUp = auth?.signUp || (async () => ({ user: null, error: new Error('Context not available') }));
  
  /**
   * Função para criar um perfil de usuário padrão quando dados estiverem faltando
   */
  const createDefaultUserProfile = (userData: Partial<SafeUser> = {}): SafeUser => {
    return {
      ...initialUser,
      ...userData,
      isAuthenticated: !!userData.id
    };
  };
  
  return {
    user,
    isAuthenticated,
    isAdmin,
    loading: auth?.loading || loading,
    signIn,
    signOut,
    signUp,
    createDefaultUserProfile
  };
};

export default useSafeAuth;
