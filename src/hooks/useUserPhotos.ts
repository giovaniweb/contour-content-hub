import { useQuery } from '@tanstack/react-query';
import { photoService, Photo } from '@/services/photoService';

export const useUserPhotos = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['userPhotos'],
    queryFn: async () => {
      const result = await photoService.getUserPhotos();
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    photos: data || [],
    isLoading,
    error: error?.message || null,
    refetch
  };
};