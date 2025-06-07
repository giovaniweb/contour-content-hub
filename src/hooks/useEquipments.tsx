
import { useState, useEffect } from "react";
import { Equipment } from '@/types/equipment';
import { getEquipments } from '@/api/equipment';
import { useToast } from '@/hooks/use-toast';

export type { Equipment };

export const useEquipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching equipments from Supabase...');
        
        const data = await getEquipments();
        console.log('Equipments fetched:', data);
        
        setEquipments(data || []);
      } catch (err: any) {
        console.error('Error fetching equipments:', err);
        setError(err.message || 'Erro ao carregar equipamentos');
        
        toast({
          variant: "destructive",
          title: "Erro ao carregar equipamentos",
          description: "Não foi possível carregar os equipamentos do banco de dados.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
  }, [toast]);

  return { equipments, loading, error, refetch: () => window.location.reload() };
};
