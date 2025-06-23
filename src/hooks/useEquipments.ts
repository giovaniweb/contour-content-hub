
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Equipment } from '@/types/equipment';

export type { Equipment } from '@/types/equipment';

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
      
      // Transform data to match Equipment interface
      const transformedData: Equipment[] = (data || []).map(item => ({
        id: item.id,
        nome: item.nome,
        categoria: (item.categoria === 'medico' ? 'medico' : 'estetico') as 'medico' | 'estetico',
        tecnologia: item.tecnologia,
        beneficios: item.beneficios,
        indicacoes: item.indicacoes,
        diferenciais: item.diferenciais,
        ativo: item.ativo,
        image_url: item.image_url,
        thumbnail_url: item.thumbnail_url,
        data_cadastro: item.data_cadastro,
        efeito: item.efeito || '',
        linguagem: item.linguagem || '',
        area_aplicacao: item.area_aplicacao || [],
        tipo_acao: item.tipo_acao as 'Não invasivo' | 'Minimante invasivo' | 'Invasivo' | undefined,
        possui_consumiveis: item.possui_consumiveis || false,
        contraindicacoes: item.contraindicacoes || [],
        perfil_ideal_paciente: item.perfil_ideal_paciente || [],
        nivel_investimento: item.nivel_investimento as 'Alto' | 'Médio' | 'Baixo' | undefined,
        akinator_enabled: item.akinator_enabled ?? true,
      }));
      
      setEquipments(transformedData);
    } catch (err: any) {
      console.error('Error in fetchEquipments:', err);
      setError(typeof err === 'string' ? err : err?.message || 'Erro ao carregar equipamentos');
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
