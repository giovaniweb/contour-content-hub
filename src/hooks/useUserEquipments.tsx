
import { useState, useEffect } from "react";
import { Equipment } from '@/types/equipment';
import { getEquipments } from '@/api/equipment';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useUserEquipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserEquipments = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching equipments for user:', user?.role);
        
        const allEquipments = await getEquipments();
        console.log('All equipments fetched:', allEquipments);
        
        if (!user) {
          setEquipments([]);
          return;
        }

        let filteredEquipments: Equipment[] = [];

        // Admins veem todos os equipamentos
        if (user.role === 'admin' || user.role === 'superadmin') {
          filteredEquipments = allEquipments.filter(eq => eq.ativo);
          console.log('Admin user - showing all active equipments:', filteredEquipments.length);
        } else {
          // Usuários normais veem apenas equipamentos cadastrados para eles
          const userEquipmentIds = user.equipamentos || [];
          console.log('User equipment IDs:', userEquipmentIds);
          
          filteredEquipments = allEquipments.filter(eq => 
            eq.ativo && userEquipmentIds.includes(eq.id)
          );
          console.log('Filtered equipments for user:', filteredEquipments.length);
        }
        
        setEquipments(filteredEquipments);
      } catch (err: any) {
        console.error('Error fetching user equipments:', err);
        setError(err.message || 'Erro ao carregar equipamentos');
        
        toast({
          variant: "destructive",
          title: "Erro ao carregar equipamentos",
          description: "Não foi possível carregar os equipamentos do usuário.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserEquipments();
    } else {
      setLoading(false);
    }
  }, [toast, user]);

  return { equipments, loading, error, refetch: () => window.location.reload() };
};
