import { useQuery } from '@tanstack/react-query';
import { photoService, Photo } from '@/services/photoService';

interface UseUserPhotosParams {
  page?: number;
  itemsPerPage?: number;
  searchTerm?: string;
  selectedEquipment?: string;
}

export const useUserPhotos = (params: UseUserPhotosParams = {}) => {
  const { page = 1, itemsPerPage = 12, searchTerm = '', selectedEquipment = '' } = params;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['userPhotos', page, itemsPerPage, searchTerm, selectedEquipment],
    queryFn: async () => {
      const result = await photoService.getUserPhotos({
        page,
        itemsPerPage,
        searchTerm,
        selectedEquipment
      });
      if (result.error) {
        throw new Error(result.error);
      }
      return {
        photos: result.data || [],
        totalCount: result.totalCount || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    photos: data?.photos || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error: error?.message || null,
    refetch
  };
};