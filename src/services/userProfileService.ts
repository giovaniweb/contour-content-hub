
import { supabase } from "@/integrations/supabase/client";

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
      const newProfileData: any = {
        user_id: userId,
        atualizado_em: new Date().toISOString()
      };
      
      if (stylePreference) {
        newProfileData.estilo_preferido = stylePreference;
      }
      
      if (communicationFocus) {
        newProfileData.foco_comunicacao = communicationFocus;
      }
      
      if (procedures && procedures.length > 0) {
        newProfileData.tipos_conteudo_validados = procedures;
      }
      
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
