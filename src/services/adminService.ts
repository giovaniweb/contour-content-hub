import { supabase } from '@/integrations/supabase/client';

export interface AdminUserSyncResponse {
  success: boolean;
  message?: string;
  error?: string;
  profileUpdated?: boolean;
  authUpdated?: boolean;
  partialSuccess?: boolean;
}

export interface GiovanniCheckResponse {
  success: boolean;
  message?: string;
  error?: string;
  user_id?: string;
  current_email?: string;
  name?: string;
}

/**
 * Sincroniza email entre auth.users e perfis usando função administrativa
 */
export const syncUserEmail = async (
  userId: string, 
  newEmail: string
): Promise<AdminUserSyncResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('admin-user-management', {
      body: {
        action: 'syncEmail',
        userId,
        email: newEmail
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Erro na função administrativa');
    }

    return data;
  } catch (error) {
    console.error('Sync email error:', error);
    throw error;
  }
};

/**
 * Verifica informações do Giovanni para correção
 */
export const checkGiovanniEmail = async (): Promise<GiovanniCheckResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('admin-user-management', {
      body: {
        action: 'checkGiovanni'
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Erro na função administrativa');
    }

    return data;
  } catch (error) {
    console.error('Check Giovanni error:', error);
    throw error;
  }
};

/**
 * Atualiza dados de usuário usando função administrativa
 */
export const updateUserData = async (
  userId: string,
  userData: Record<string, any>
): Promise<AdminUserSyncResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('admin-user-management', {
      body: {
        action: 'updateUserData',
        userId,
        userData
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Erro na função administrativa');
    }

    return data;
  } catch (error) {
    console.error('Update user data error:', error);
    throw error;
  }
};