
import { useQuery } from '@tanstack/react-query';
import { getEquipments } from '@/api/equipment';
import { Equipment } from '@/types/equipment';

// Re-export Equipment type for convenience
export type { Equipment };

export const useEquipments = () => {
  const { data: equipments = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['equipments'],
    queryFn: getEquipments,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (renamed from cacheTime)
  });

  return {
    equipments,
    loading,
    error: error as Error | null,
    refetch
  };
};
