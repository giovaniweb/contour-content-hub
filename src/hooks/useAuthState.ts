
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { UserProfile } from "@/types/auth";
import { fetchUserProfile } from "@/services/authService";

export function useAuthState() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up listener for authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Fetch user profile when session changes
          setTimeout(async () => {
            const userProfile = await fetchUserProfile(currentSession.user.id);
            setUser(userProfile);
          }, 0);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check initial session
    const initSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      if (initialSession?.user) {
        const userProfile = await fetchUserProfile(initialSession.user.id);
        setUser(userProfile);
        setSession(initialSession);
      }
      
      setIsLoading(false);
    };
    
    initSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user
  };
}
