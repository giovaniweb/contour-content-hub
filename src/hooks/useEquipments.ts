
import { useQuery } from '@tanstack/react-query';
import { getEquipments } from '@/api/equipment';

export const useEquipments = () => {
  const { data: equipments = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['equipments'],
    queryFn: getEquipments,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });

  return {
    equipments,
    loading,
    error: error as Error | null,
    refetch
  };
};
