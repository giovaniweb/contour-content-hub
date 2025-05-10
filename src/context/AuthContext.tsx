
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { fetchUserProfile, loginWithEmailAndPassword, logoutUser, registerUser as registerUserService, updateUserPassword as updateUserPasswordService, updateUserProfile as updateUserProfileService, fetchUserInvites } from '@/services/authService';
import { UserProfile, AuthContextType } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => { throw new Error('Not implemented') },
  logout: async () => { throw new Error('Not implemented') },
  register: async () => { throw new Error('Not implemented') },
  updateUser: async () => { throw new Error('Not implemented') },
  updatePassword: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
                toast({
                  title: 'Convites pendentes',
                  description: 'Você tem convites pendentes para se juntar a workspaces',
                });
                navigate('/invites');
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
            toast({
              title: 'Convites pendentes',
              description: 'Você tem convites pendentes para se juntar a workspaces',
            });
            setTimeout(() => navigate('/invites'), 500);
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
  }, [navigate, toast]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await loginWithEmailAndPassword(email, password);
      
      if (error) throw error;
      
      // User profile data will be set by the auth state change handler
      return;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const register = async (userData: Omit<UserProfile, "id" | "passwordChanged" | "role"> & { password: string; role?: typeof user.role }) => {
    try {
      await registerUserService(userData);
      // After registration, redirect to login
      navigate('/login');
    } catch (error: any) {
      console.error('Register error:', error);
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
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      await updateUserPasswordService(newPassword);
      return true;
    } catch (error: any) {
      console.error('Update password error:', error);
      return false;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    updateUser,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
