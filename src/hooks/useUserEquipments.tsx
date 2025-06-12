
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
        console.log('🔧 [useUserEquipments] Iniciando busca de equipamentos...');
        console.log('🔧 [useUserEquipments] Usuário atual:', user);
        console.log('🔧 [useUserEquipments] Role do usuário:', user?.role);
        
        const allEquipments = await getEquipments();
        console.log('🔧 [useUserEquipments] Total de equipamentos encontrados:', allEquipments?.length || 0);
        console.log('🔧 [useUserEquipments] Equipamentos brutos:', allEquipments);
        
        if (!user) {
          console.log('🔧 [useUserEquipments] Usuário não autenticado, retornando lista vazia');
          setEquipments([]);
          return;
        }

        let filteredEquipments: Equipment[] = [];

        // Filtrar equipamentos ativos primeiro
        const activeEquipments = allEquipments.filter(eq => {
          console.log(`🔧 [useUserEquipments] Equipamento ${eq.nome}: ativo=${eq.ativo}`);
          return eq.ativo;
        });

        console.log('🔧 [useUserEquipments] Equipamentos ativos:', activeEquipments.length);

        // Admins e superadmins veem todos os equipamentos ativos
        if (user.role === 'admin' || user.role === 'superadmin') {
          filteredEquipments = activeEquipments;
          console.log('🔧 [useUserEquipments] Admin/SuperAdmin - mostrando todos os equipamentos ativos:', filteredEquipments.length);
        } else {
          // Usuários normais veem apenas equipamentos cadastrados para eles
          const userEquipmentIds = user.equipamentos || [];
          console.log('🔧 [useUserEquipments] IDs de equipamentos do usuário:', userEquipmentIds);
          
          filteredEquipments = activeEquipments.filter(eq => {
            const hasPermission = userEquipmentIds.includes(eq.id);
            console.log(`🔧 [useUserEquipments] Equipamento ${eq.nome} (${eq.id}): usuário tem permissão=${hasPermission}`);
            return hasPermission;
          });
          console.log('🔧 [useUserEquipments] Equipamentos filtrados para usuário:', filteredEquipments.length);
        }
        
        console.log('🔧 [useUserEquipments] Equipamentos finais para exibição:', filteredEquipments);
        setEquipments(filteredEquipments);
      } catch (err: any) {
        console.error('🔧 [useUserEquipments] Erro ao carregar equipamentos:', err);
        setError(err.message || 'Erro ao carregar equipamentos');
        
        toast({
          variant: "destructive",
          title: "Erro ao carregar equipamentos",
          description: "Não foi possível carregar os equipamentos do usuário.",
        });
      } finally {
        setLoading(false);
        console.log('🔧 [useUserEquipments] Busca finalizada, loading=false');
      }
    };

    console.log('🔧 [useUserEquipments] useEffect executado, user existe:', !!user);
    if (user) {
      fetchUserEquipments();
    } else {
      console.log('🔧 [useUserEquipments] Usuário não existe, definindo loading=false');
      setLoading(false);
    }
  }, [toast, user]);

  return { equipments, loading, error, refetch: () => window.location.reload() };
};
