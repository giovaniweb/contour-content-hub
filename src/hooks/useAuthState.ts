
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile } from '@/services/authService';
import { UserProfile } from '@/types/auth';

export function useAuthState() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log("useAuthState - Setting up auth state listener");
    
    // First, set up the auth state listener to handle changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", { event, session: !!session });
        
        if (session?.user) {
          try {
            // We have a session, fetch the user profile
            const userProfile = await fetchUserProfile(session.user.id);
            
            if (userProfile) {
              setUser(userProfile);
              setIsAuthenticated(true);
            } else {
              // We have a session but no profile
              setUser(null);
              setIsAuthenticated(false);
              console.error("No user profile found for authenticated user");
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // No session, user is not authenticated
          setUser(null);
          setIsAuthenticated(false);
          console.log("No session found");
        }
        
        setIsLoading(false);
      }
    );
    
    // Then check the initial session
    const checkInitialSession = async () => {
      try {
        console.log("useAuthState - Checking initial session");
        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        
        if (session?.user) {
          try {
            const userProfile = await fetchUserProfile(session.user.id);
            
            if (userProfile) {
              setUser(userProfile);
              setIsAuthenticated(true);
            } else {
              setUser(null);
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          console.log("No initial session found");
          setUser(null);
          setIsAuthenticated(false);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking initial session:", error);
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };
    
    checkInitialSession();
    
    // Clean up the subscription when the component unmounts
    return () => {
      console.log("useAuthState - Cleaning up auth subscription");
      subscription?.unsubscribe();
    };
  }, []);

  return { user, isLoading, isAuthenticated };
}

export default useAuthState;
