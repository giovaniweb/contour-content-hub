
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
      (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid potential deadlock issues with Supabase auth
          setTimeout(async () => {
            try {
              const userProfile = await fetchUserProfile(currentSession.user.id);
              setUser(userProfile);
            } catch (error) {
              console.error("Error fetching user profile:", error);
              // Still update user state with basic info from session
              setUser(currentSession.user as UserProfile);
            }
          }, 0);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check initial session
    const initSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession?.user) {
          setSession(initialSession);
          
          try {
            const userProfile = await fetchUserProfile(initialSession.user.id);
            setUser(userProfile);
          } catch (error) {
            console.error("Error fetching initial user profile:", error);
            // Still update user state with basic info from session
            setUser(initialSession.user as UserProfile);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking initial session:", error);
        setIsLoading(false);
      }
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
