import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserPhotoLike, likePhoto, unlikePhoto } from '@/api/equipment/photos';

export const usePhotoLikes = (photoId: string) => {
  const queryClient = useQueryClient();

  const { data: userLike, isLoading } = useQuery({
    queryKey: ['photo-like', photoId],
    queryFn: () => getUserPhotoLike(photoId),
  });

  const isLiked = !!userLike;

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        await unlikePhoto(photoId);
      } else {
        await likePhoto(photoId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo-like', photoId] });
      queryClient.invalidateQueries({ queryKey: ['equipment-photos'] });
    }
  });

  return {
    isLiked,
    isLoading,
    toggleLike: () => toggleLikeMutation.mutate(),
    isToggling: toggleLikeMutation.isPending
  };
};