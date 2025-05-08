
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
    role: 'cliente' // Default role
  };
};

export function useAuthState() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("useAuthState - Setting up auth state listener");
    
    // Set up listener for authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", { event, session: !!currentSession });
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid potential deadlock issues with Supabase auth
          setTimeout(async () => {
            try {
              const userProfile = await fetchUserProfile(currentSession.user.id);
              
              if (userProfile) {
                console.log("User profile fetched successfully:", userProfile.name);
                setUser(userProfile);
              } else {
                console.log("No user profile found, creating default");
                // If profile not found, create a default one from basic user data
                setUser(createDefaultUserProfile(currentSession.user));
              }
            } catch (error) {
              console.error("Error fetching user profile:", error);
              // Still update user state with basic info from session
              console.log("Using default profile due to error");
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
        console.log("useAuthState - Checking initial session");
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession?.user) {
          console.log("Initial session found with user:", initialSession.user.email);
          setSession(initialSession);
          
          try {
            const userProfile = await fetchUserProfile(initialSession.user.id);
            
            if (userProfile) {
              console.log("Initial user profile fetched successfully:", userProfile.name);
              setUser(userProfile);
            } else {
              console.log("No initial user profile found, creating default");
              // If profile not found, create a default one from basic user data
              setUser(createDefaultUserProfile(initialSession.user));
            }
          } catch (error) {
            console.error("Error fetching initial user profile:", error);
            // Still update user state with basic info from session
            console.log("Using default profile for initial session due to error");
            setUser(createDefaultUserProfile(initialSession.user));
          }
        } else {
          console.log("No initial session found");
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking initial session:", error);
        setIsLoading(false);
      }
    };
    
    initSession();
    
    return () => {
      console.log("useAuthState - Cleaning up auth subscription");
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
