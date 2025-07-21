import { supabase } from '@/integrations/supabase/client';

export interface UserAction {
  action_type: string;
  target_id?: string;
  target_type?: string;
  metadata?: Record<string, any>;
}

export const useUserActions = () => {
  const trackAction = async (action: UserAction) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      await supabase
        .from('user_actions')
        .insert({
          user_id: user.user.id,
          action_type: action.action_type,
          target_id: action.target_id,
          target_type: action.target_type,
          metadata: action.metadata || {}
        });

    } catch (error) {
      console.error('Erro ao rastrear ação:', error);
    }
  };

  return { trackAction };
};