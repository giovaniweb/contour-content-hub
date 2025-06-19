
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Equipment {
  id: string;
  nome: string;
}

export const useEquipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('equipamentos')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;

      setEquipments(data || []);
    } catch (err: any) {
      console.error('Error fetching equipments:', err);
      setError(err.message);
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
    refetch: fetchEquipments,
  };
};
