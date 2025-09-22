import { supabase } from '@/integrations/supabase/client';
import { DEFAULT_USER_PERMISSIONS } from './featureMapping';
import { AppFeature } from '@/hooks/useFeatureAccess';

/**
 * Initialize default permissions for existing users who might not have permissions set up
 */
export const initializeUserPermissions = async (userId: string) => {
  try {
    // Check if user already has permissions
    const { data: existingPermissions, error: checkError } = await supabase
      .from('user_feature_permissions')
      .select('feature')
      .eq('user_id', userId);

    if (checkError) {
      console.error('Error checking existing permissions:', checkError);
      return;
    }

    // If user has no permissions, set up defaults
    if (!existingPermissions || existingPermissions.length === 0) {
      console.log('Setting up default permissions for user:', userId);
      
      // Create all permissions (enabled for default features, disabled for others)
      const allFeatures: AppFeature[] = [
        'mestre_beleza',
        'consultor_mkt', 
        'fluida_roteirista',
        'videos',
        'fotos',
        'artes',
        'artigos_cientificos',
        'academia',
        'equipamentos'
      ];

      const permissionsToInsert = allFeatures.map(feature => ({
        user_id: userId,
        feature,
        enabled: DEFAULT_USER_PERMISSIONS.includes(feature),
        expires_at: null
      }));

      const { error: insertError } = await supabase
        .from('user_feature_permissions')
        .insert(permissionsToInsert);

      if (insertError) {
        console.error('Error inserting default permissions:', insertError);
      } else {
        console.log('Default permissions set up successfully for user:', userId);
      }
    }
  } catch (error) {
    console.error('Error initializing user permissions:', error);
  }
};