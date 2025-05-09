
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user's role from the database
          const { data: userData, error: roleError } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (roleError) {
            console.error('Error fetching user role:', roleError);
            setUser(null);
            setError('Error fetching user role');
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              role: userData?.role || 'user'
            });
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth error:', err);
        setUser(null);
        setError('Authentication error');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        checkAuth();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const isAuthenticated = (): boolean => {
    return !!user;
  };

  return {
    user,
    loading,
    error,
    isAdmin,
    isAuthenticated
  };
};

export default useAuth;
