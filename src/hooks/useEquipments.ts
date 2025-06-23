
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Equipment {
  id: string;
  nome: string;
  categoria: string;
  tecnologia: string;
  beneficios: string;
  indicacoes: string;
  diferenciais: string;
  ativo: boolean;
  image_url?: string;
  thumbnail_url?: string;
  data_cadastro: string;
}

export const useEquipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('equipamentos')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error('Error fetching equipments:', error);
        throw error;
      }

      console.log('✅ Equipments loaded:', data?.length || 0);
      setEquipments(data || []);
    } catch (err: any) {
      console.error('Error in fetchEquipments:', err);
      setError(err.message || 'Erro ao carregar equipamentos');
      setEquipments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  return {
    equipments,
    loading,
    error,
    refetch: fetchEquipments
  };
};
