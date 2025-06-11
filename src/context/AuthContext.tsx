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
    console.log('AuthProvider: Setting up auth state listener');

    const setupAuth = async () => {
      try {
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;

            console.log('AuthProvider: Auth state changed:', { event, session: !!session, userId: session?.user?.id });
            
            if (session?.user) {
              try {
                console.log('AuthProvider: Fetching user profile for:', session.user.id);
                const userProfile = await fetchUserProfile(session.user.id);
                
                if (mounted && userProfile) {
                  console.log('AuthProvider: User profile loaded:', userProfile);
                  setUser(userProfile);
                  setIsAuthenticated(true);
                  setError(null);
                } else {
                  console.error('AuthProvider: No user profile found for authenticated user');
                  if (mounted) {
                    setUser(null);
                    setIsAuthenticated(false);
                    setError('Perfil do usuário não encontrado');
                  }
                }
              } catch (error) {
                console.error('AuthProvider: Error fetching user profile:', error);
                if (mounted) {
                  setUser(null);
                  setIsAuthenticated(false);
                  setError('Erro ao carregar perfil do usuário');
                }
              }
            } else {
              console.log('AuthProvider: No session, user is not authenticated');
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

        // Then check the initial session
        console.log('AuthProvider: Checking initial session');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session?.user) {
            console.log('AuthProvider: Initial session found:', session.user.id);
            try {
              const userProfile = await fetchUserProfile(session.user.id);
              if (userProfile) {
                console.log('AuthProvider: Initial user profile loaded:', userProfile);
                setUser(userProfile);
                setIsAuthenticated(true);
                setError(null);
              } else {
                console.error('AuthProvider: No initial user profile found');
                setUser(null);
                setIsAuthenticated(false);
                setError('Perfil do usuário não encontrado');
              }
            } catch (error) {
              console.error('AuthProvider: Error fetching initial user profile:', error);
              setUser(null);
              setIsAuthenticated(false);
              setError('Erro ao carregar perfil do usuário');
            }
          } else {
            console.log('AuthProvider: No initial session found');
            setUser(null);
            setIsAuthenticated(false);
            setError(null);
          }
          setIsLoading(false);
        }

        return () => {
          console.log('AuthProvider: Cleaning up auth subscription');
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('AuthProvider: Error setting up auth:', error);
        if (mounted) {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          setError('Erro ao configurar autenticação');
        }
      }
    };

    setupAuth();

    return () => {
      console.log('AuthProvider: Component unmounting');
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Login attempt for email:', email);
      setError(null);
      setIsLoading(true);
      
      const { data, error } = await loginWithEmailAndPassword(email, password);
      
      if (error) {
        console.error('AuthProvider: Login error:', error);
        throw error;
      }
      
      console.log('AuthProvider: Login successful, session will be handled by auth state change');
      // User profile will be set by the auth state change handler
      return;
    } catch (error: any) {
      console.error('AuthProvider: Login error:', error);
      const errorMessage = error.message || 'Erro ao fazer login';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('AuthProvider: Logout attempt');
      setError(null);
      await logoutUser();
      console.log('AuthProvider: Logout successful');
    } catch (error: any) {
      console.error('AuthProvider: Logout error:', error);
      setError(error.message || 'Erro ao fazer logout');
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
      setError(null);
      setIsLoading(true);
      await registerUserService(userData);
    } catch (error: any) {
      console.error('Register error:', error);
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

export default AuthProvider;
