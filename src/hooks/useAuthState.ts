
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { UserProfile } from "@/types/auth";
import { fetchUserProfile } from "@/services/authService";

// Helper function to create a UserProfile from a User object
const createDefaultUserProfile = (user: User): UserProfile => {
  console.log("Creating default user profile from:", user);
  
  // Ensure we have all required fields with fallback values
  return {
    id: user.id,
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
    email: user.email || '',
    clinic: user.user_metadata?.clinic || '',
    city: user.user_metadata?.city || '',
    phone: user.user_metadata?.phone || '',
    equipment: user.user_metadata?.equipment || [],
    language: "PT", // Default language 
    profilePhotoUrl: user.user_metadata?.avatar_url || '',
    passwordChanged: false, // Default value
    role: validateRole(user.user_metadata?.role || 'cliente') // Sanitize role
  };
};

// Helper function to validate role
const validateRole = (role: string): 'cliente' | 'admin' | 'operador' | 'vendedor' => {
  const validRoles = ['cliente', 'admin', 'operador', 'vendedor'];
  if (validRoles.includes(role)) {
    return role as 'cliente' | 'admin' | 'operador' | 'vendedor';
  }
  return 'cliente'; // Default to 'cliente' if invalid
};

export function useAuthState() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("useAuthState - Setting up auth state listener");
    
    let isMounted = true;
    
    // Set up listener for authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!isMounted) return;
        
        console.log("Auth state changed:", { event, session: !!currentSession });
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid potential deadlock issues with Supabase auth
          setTimeout(async () => {
            if (!isMounted) return;
            
            try {
              const userProfile = await fetchUserProfile(currentSession.user.id);
              
              if (userProfile && isMounted) {
                console.log("User profile fetched successfully:", userProfile.name);
                setUser(userProfile);
              } else if (isMounted) {
                console.log("No user profile found, creating default");
                // If profile not found, create a default one from basic user data
                setUser(createDefaultUserProfile(currentSession.user));
              }
            } catch (error) {
              console.error("Error fetching user profile:", error);
              if (isMounted) {
                // Still update user state with basic info from session
                console.log("Using default profile due to error");
                setUser(createDefaultUserProfile(currentSession.user));
                setError(error instanceof Error ? error : new Error(String(error)));
              }
            } finally {
              if (isMounted) {
                setIsLoading(false);
              }
            }
          }, 0);
        } else if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Check initial session
    const initSession = async () => {
      try {
        console.log("useAuthState - Checking initial session");
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (initialSession?.user) {
          console.log("Initial session found with user:", initialSession.user.email);
          setSession(initialSession);
          
          try {
            const userProfile = await fetchUserProfile(initialSession.user.id);
            
            if (userProfile && isMounted) {
              console.log("Initial user profile fetched successfully:", userProfile.name);
              setUser(userProfile);
            } else if (isMounted) {
              console.log("No initial user profile found, creating default");
              // If profile not found, create a default one from basic user data
              setUser(createDefaultUserProfile(initialSession.user));
            }
          } catch (error) {
            console.error("Error fetching initial user profile:", error);
            if (isMounted) {
              // Still update user state with basic info from session
              console.log("Using default profile for initial session due to error");
              setUser(createDefaultUserProfile(initialSession.user));
              setError(error instanceof Error ? error : new Error(String(error)));
            }
          }
        } else if (isMounted) {
          console.log("No initial session found");
        }
        
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking initial session:", error);
        if (isMounted) {
          setIsLoading(false);
          setError(error instanceof Error ? error : new Error(String(error)));
        }
      }
    };
    
    initSession();
    
    return () => {
      console.log("useAuthState - Cleaning up auth subscription");
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    isLoading,
    error,
    isAuthenticated: !!user
  };
}
