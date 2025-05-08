
import { StoredVideo } from '@/types/video-storage';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useLikes() {
  const { toast } = useToast();
  
  const saveLike = async (videoId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user || !user.user) {
        toast({
          title: "Erro ao curtir vídeo",
          description: "Você precisa estar logado para curtir vídeos.",
          variant: "destructive"
        });
        return false;
      }
      
      const { data, error } = await supabase
        .from('favoritos')
        .insert({ 
          video_id: videoId, 
          usuario_id: user.user.id 
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error saving like:', error);
      return false;
    }
  };
  
  return { saveLike };
}
