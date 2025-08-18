import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Equipment {
  id: string;
  nome: string;
  categoria: string;
  ativo: boolean;
  tecnologia?: string;
  beneficios?: string;
  diferenciais?: string;
  indicacoes?: string;
  efeito?: string;
  image_url?: string;
}

export const useRealEquipmentData = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('equipamentos')
          .select('id, nome, categoria, ativo, tecnologia, beneficios, diferenciais, indicacoes, efeito, image_url')
          .eq('ativo', true)
          .order('nome');

        if (error) {
          throw error;
        }

        console.log('🔧 Equipamentos reais carregados:', data?.length || 0);
        setEquipments(data || []);
      } catch (err: any) {
        console.error('❌ Erro ao carregar equipamentos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
  }, []);

  const getEquipmentsByCategory = (category: 'medico' | 'estetico') => {
    return equipments.filter(eq => eq.categoria === category);
  };

  const getEquipmentById = (id: string) => {
    return equipments.find(eq => eq.id === id);
  };

  return {
    equipments,
    loading,
    error,
    getEquipmentsByCategory,
    getEquipmentById
  };
};