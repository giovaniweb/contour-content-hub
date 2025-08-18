import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRealEquipmentData } from '@/hooks/useRealEquipmentData';

interface Equipment {
  id: string;
  nome: string;
  beneficios?: string;
  diferenciais?: string;
  tecnologia?: string;
}

export const useEquipmentData = (equipmentId?: string) => {
  const { getEquipmentById, loading: globalLoading } = useRealEquipmentData();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!equipmentId || equipmentId === 'Não informado') {
      setEquipment(null);
      return;
    }

    // Usar dados reais em vez de mock
    const realEquipment = getEquipmentById(equipmentId);
    if (realEquipment) {
      setEquipment(realEquipment);
    } else {
      // Fallback para busca direta caso não esteja no cache
      const fetchEquipment = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('equipamentos')
            .select('id, nome, beneficios, diferenciais, tecnologia')
            .eq('id', equipmentId)
            .single();

          if (error) {
            console.error('Erro ao buscar equipamento:', error);
            return;
          }

          setEquipment(data);
        } catch (error) {
          console.error('Erro ao buscar equipamento:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchEquipment();
    }
  }, [equipmentId, getEquipmentById]);

  return { 
    equipment, 
    loading: loading || globalLoading 
  };
};