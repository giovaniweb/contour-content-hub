
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

// Define the AuthContextType
export interface AuthContextType {
  user: User | null;
  isAdmin: () => boolean;
  loading?: boolean;
  signIn?: (credentials: { email: string; password: string }) => Promise<{ user: User | null; error: Error | null }>;
  signOut?: () => Promise<{ error: Error | null }>;
  signUp?: (credentials: { email: string; password: string; userData?: any }) => Promise<{ user: User | null; error: Error | null }>;
  // Add other auth methods you might have
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: () => false,
  // Add other default values for auth methods
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // This function will check user roles in your database
  const isAdmin = (): boolean => {
    // For simplicity, returning true if user exists
    // In a real implementation, you would check user roles
    // from your database or JWT claims
    return !!user;
  };

  // Mock implementation of signIn (implement with real auth later)
  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { user: data?.user || null, error: error as Error | null };
    } catch (err) {
      return { user: null, error: err as Error };
    }
  };

  // Mock implementation of signOut
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error as Error | null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Mock implementation of signUp
  const signUp = async ({ email, password, userData }: { email: string; password: string; userData?: any }) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: userData
        }
      });
      return { user: data?.user || null, error: error as Error | null };
    } catch (err) {
      return { user: null, error: err as Error };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin, 
      loading,
      signIn,
      signOut,
      signUp
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
