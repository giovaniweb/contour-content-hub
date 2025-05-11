
import { supabase } from "@/integrations/supabase/client";

// Define the UserProfile type to match what's expected in the app
export type UserProfile = {
  id?: string;
  user_id: string;
  estilo_preferido?: string;
  foco_comunicacao?: string;
  tipos_conteudo_validados?: string[];
  perfil_comportamental?: string[];
  insights_performance?: string[];
  atualizado_em?: string;
};

interface UserProfileUpdateParams {
  userId: string;
  stylePreference?: string;
  communicationFocus?: string;
  procedures?: string[];
}

/**
 * Updates user profile with new settings and preferences
 * This function is used to update intelligence core with admin settings
 */
export async function updateUserProfileSettings(params: UserProfileUpdateParams) {
  const { userId, stylePreference, communicationFocus, procedures } = params;
  
  try {
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profile')
      .select('user_id')
      .eq('user_id', userId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    // If profile exists, update it
    if (existingProfile) {
      const updateData: any = {
        atualizado_em: new Date().toISOString()
      };
      
      if (stylePreference) {
        updateData.estilo_preferido = stylePreference;
      }
      
      if (communicationFocus) {
        updateData.foco_comunicacao = communicationFocus;
      }
      
      if (procedures && procedures.length > 0) {
        updateData.tipos_conteudo_validados = procedures;
      }
      
      const { error: updateError } = await supabase
        .from('user_profile')
        .update(updateData)
        .eq('user_id', userId);
        
      if (updateError) throw updateError;
      
    } else {
      // If profile doesn't exist, create it
      const newProfileData = {
        user_id: userId,
        atualizado_em: new Date().toISOString(),
        estilo_preferido: stylePreference,
        foco_comunicacao: communicationFocus,
        tipos_conteudo_validados: procedures
      };
      
      // Remove undefined fields to avoid type errors
      Object.keys(newProfileData).forEach(key => {
        if (newProfileData[key as keyof typeof newProfileData] === undefined) {
          delete newProfileData[key as keyof typeof newProfileData];
        }
      });
      
      const { error: insertError } = await supabase
        .from('user_profile')
        .insert(newProfileData);
        
      if (insertError) throw insertError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Get user profile data for analysis
 */
export async function getUserProfileData(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_profile')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data || null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

/**
 * Get user profile - implementation for the hook
 * This is used by the intent processor
 */
export async function getUserProfile(userId?: string) {
  if (!userId) {
    // If no userId is provided, try to get it from the current session
    const { data: { session } } = await supabase.auth.getSession();
    userId = session?.user?.id;
    
    if (!userId) {
      return null;
    }
  }
  
  return getUserProfileData(userId);
}

/**
 * Update or insert user profile
 */
export async function upsertUserProfile(profile: Partial<UserProfile> & { user_id: string }) {
  try {
    const { data: existingProfile } = await supabase
      .from('user_profile')
      .select('user_id')
      .eq('user_id', profile.user_id)
      .single();
    
    if (existingProfile) {
      // Update existing profile
      const { error } = await supabase
        .from('user_profile')
        .update({
          ...profile,
          atualizado_em: new Date().toISOString()
        })
        .eq('user_id', profile.user_id);
      
      if (error) throw error;
    } else {
      // Create new profile
      const { error } = await supabase
        .from('user_profile')
        .insert({
          ...profile,
          atualizado_em: new Date().toISOString()
        });
      
      if (error) throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error upserting user profile:', error);
    throw error;
  }
}
