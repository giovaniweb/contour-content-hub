
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { UserProfile } from "@/types/auth";
import { fetchUserProfile } from "@/services/authService";

// Helper function to create a UserProfile from a User object
const createDefaultUserProfile = (user: User): UserProfile => {
  return {
    id: user.id,
    name: user.user_metadata?.name || '',
    email: user.email || '',
    language: "PT", // Default language 
    passwordChanged: false, // Default value
    role: 'cliente' // Default role
  };
};

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
              
              if (userProfile) {
                setUser(userProfile);
              } else {
                // If profile not found, create a default one from basic user data
                setUser(createDefaultUserProfile(currentSession.user));
              }
            } catch (error) {
              console.error("Error fetching user profile:", error);
              // Still update user state with basic info from session
              setUser(createDefaultUserProfile(currentSession.user));
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
            
            if (userProfile) {
              setUser(userProfile);
            } else {
              // If profile not found, create a default one from basic user data
              setUser(createDefaultUserProfile(initialSession.user));
            }
          } catch (error) {
            console.error("Error fetching initial user profile:", error);
            // Still update user state with basic info from session
            setUser(createDefaultUserProfile(initialSession.user));
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
