import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useVideoLikes = (videoId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        throw new Error('User not authenticated');
      }

      if (isLiked) {
        // Unlike - remove from favoritos table
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .eq('video_id', videoId)
          .eq('usuario_id', user.user.id);
        
        if (error) throw error;
      } else {
        // Like - add to favoritos table
        const { error } = await supabase
          .from('favoritos')
          .insert({
            video_id: videoId,
            usuario_id: user.user.id,
            tipo: 'video'
          });
        
        if (error) throw error;
      }
      
      return !isLiked;
    },
    onSuccess: (newLikeState) => {
      setIsLiked(newLikeState);
      queryClient.invalidateQueries({ queryKey: ['equipment-videos'] });
      toast({
        title: newLikeState ? "Vídeo curtido!" : "Curtida removida",
        description: newLikeState ? "Vídeo adicionado aos favoritos" : "Vídeo removido dos favoritos"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao processar curtida"
      });
    }
  });

  return {
    isLiked,
    setIsLiked,
    toggleLike: () => toggleLikeMutation.mutate(),
    isToggling: toggleLikeMutation.isPending
  };
};