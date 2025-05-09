
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

// Define the AuthContextType
export interface AuthContextType {
  user: User | null;
  isAdmin: () => boolean;
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

  return (
    <AuthContext.Provider value={{ user, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
