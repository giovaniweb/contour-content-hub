import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { fetchUserProfile, loginWithEmailAndPassword, logoutUser, registerUser as registerUserService, updateUserPassword as updateUserPasswordService, updateUserProfile as updateUserProfileService, fetchUserInvites } from '@/services/authService';
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
    const setupAuth = async () => {
      // First establish the auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const userProfile = await fetchUserProfile(session.user.id);
            setUser(userProfile);
            setIsAuthenticated(true);
            
            // Check if the user has pending invites
            try {
              const invites = await fetchUserInvites();
              if (invites && invites.length > 0) {
                toast('Convites pendentes', {
                  description: 'Você tem convites pendentes para se juntar a workspaces',
                });
                // We'll handle navigation in the component that consumes this context
              }
            } catch (error) {
              console.error('Error checking invites:', error);
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      );

      // Then get the current session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user.id);
        setUser(userProfile);
        setIsAuthenticated(true);
        
        // Check if the user has pending invites
        try {
          const invites = await fetchUserInvites();
          if (invites && invites.length > 0) {
            toast('Convites pendentes', {
              description: 'Você tem convites pendentes para se juntar a workspaces',
            });
            // Navigation will be handled in components using this context
          }
        } catch (error) {
          console.error('Error checking invites:', error);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }

      setIsLoading(false);
      return () => {
        subscription.unsubscribe();
      };
    };

    setupAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await loginWithEmailAndPassword(email, password);
      
      if (error) throw error;
      
      // User profile data will be set by the auth state change handler
      return;
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Error logging in');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await logoutUser();
      // Navigation will be handled by the component that uses this context
    } catch (error: any) {
      console.error('Logout error:', error);
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
      setError(null);
      await registerUserService(userData);
      // Navigation will be handled by the component that uses this context
    } catch (error: any) {
      console.error('Register error:', error);
      setError(error.message || 'Error registering user');
      throw error;
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
      // This would be implemented in authService.ts
      // await resetPasswordEmail(email);
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

export const useAuth = () => useContext(AuthContext);
