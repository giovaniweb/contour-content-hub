
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getEquipmentById } from '@/api/equipment/getEquipment';
import { Equipment } from '@/types/equipment';
import { logQuery } from '@/utils/validation/loggingUtils';

export const useEquipmentDetailsState = (id?: string) => {
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!id) {
        console.error("No equipment ID provided in URL params");
        setError("ID do equipamento não fornecido");
        setLoading(false);
        return;
      }
      
      console.log(`🔍 Attempting to fetch equipment with ID: ${id}`);
      try {
        logQuery('select', 'equipamentos', { id, component: 'EquipmentDetails' });
      } catch (err) {
        console.error("Error logging query:", err);
        // Continue execution even if logging fails
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await getEquipmentById(id);
        console.log("🔍 Equipment data received:", data);
        
        if (!data) {
          console.error("🚨 No equipment found with provided ID");
          console.log("🔍 ID usado na busca:", id);
          setError("Equipamento não encontrado");
          toast({
            variant: "destructive",
            title: "Equipamento não encontrado",
            description: "Não foi possível encontrar o equipamento solicitado."
          });
          setLoading(false);
          return;
        }
        
        console.log("✅ Setting equipment data:", data.nome);
        setEquipment(data);
      } catch (err: any) {
        console.error('Error fetching equipment:', err);
        setError(err.message || "Erro ao carregar dados do equipamento");
        toast({
          variant: "destructive",
          title: "Erro ao carregar equipamento",
          description: "Não foi possível carregar os dados do equipamento."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEquipment();
  }, [id, toast]);

  return { equipment, loading, error, activeTab, setActiveTab };
};
