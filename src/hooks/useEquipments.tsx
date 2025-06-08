
import { useState, useEffect } from "react";
import { Equipment } from '@/types/equipment';
import { getEquipments } from '@/api/equipment';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';

export type { Equipment };

export const useEquipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { profile } = useUserProfile();

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching equipments from Supabase...');
        
        const data = await getEquipments();
        console.log('Equipments fetched:', data);
        
        // Filtrar equipamentos baseado no tipo de clínica
        let filteredEquipments = data || [];
        
        if (profile?.clinic_type === 'clinica_estetica') {
          // Clínica estética só vê equipamentos estéticos
          filteredEquipments = data.filter(eq => eq.categoria === 'estetico');
          console.log('Filtered equipments for aesthetic clinic:', filteredEquipments.length);
        } else if (profile?.clinic_type === 'clinica_medica') {
          // Clínica médica vê todos os equipamentos
          filteredEquipments = data;
          console.log('All equipments for medical clinic:', filteredEquipments.length);
        }
        
        setEquipments(filteredEquipments);
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
  }, [toast, profile?.clinic_type]);

  return { equipments, loading, error, refetch: () => window.location.reload() };
};
