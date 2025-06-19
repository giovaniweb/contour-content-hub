
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Equipment } from '@/types/equipment';

export { Equipment };

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
        .select(`
          id,
          nome,
          tecnologia,
          efeito,
          beneficios,
          diferenciais,
          indicacoes,
          linguagem,
          data_cadastro,
          image_url,
          ativo,
          categoria,
          thumbnail_url,
          area_aplicacao,
          tipo_acao,
          possui_consumiveis,
          contraindicacoes,
          perfil_ideal_paciente,
          nivel_investimento,
          akinator_enabled
        `)
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;

      // Transform the data to match the Equipment interface
      const transformedData: Equipment[] = (data || []).map(item => ({
        id: item.id,
        nome: item.nome,
        tecnologia: item.tecnologia || '',
        efeito: item.efeito || '',
        beneficios: item.beneficios || '',
        diferenciais: item.diferenciais || '',
        indicacoes: item.indicacoes || '',
        linguagem: item.linguagem || '',
        data_cadastro: item.data_cadastro || new Date().toISOString(),
        image_url: item.image_url || '',
        ativo: item.ativo ?? true,
        categoria: item.categoria || 'estetico',
        thumbnail_url: item.thumbnail_url || '',
        area_aplicacao: item.area_aplicacao || [],
        tipo_acao: item.tipo_acao,
        possui_consumiveis: item.possui_consumiveis ?? false,
        contraindicacoes: item.contraindicacoes || [],
        perfil_ideal_paciente: item.perfil_ideal_paciente || [],
        nivel_investimento: item.nivel_investimento,
        akinator_enabled: item.akinator_enabled ?? true,
      }));

      setEquipments(transformedData);
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
