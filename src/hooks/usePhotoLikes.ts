import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function usePhotoLikes() {
  const { toast } = useToast();
  
  const saveLike = async (photoId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user || !user.user) {
        toast({
          title: "Erro ao curtir foto",
          description: "Você precisa estar logado para curtir fotos.",
          variant: "destructive"
        });
        return false;
      }
      
      const { data, error } = await supabase
        .from('favoritos')
        .insert({ 
          foto_id: photoId, 
          usuario_id: user.user.id,
          tipo: 'foto'
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error saving photo like:', error);
      return false;
    }
  };
  
  return { saveLike };
}