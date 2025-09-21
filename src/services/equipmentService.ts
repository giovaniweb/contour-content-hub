import { supabase } from '@/integrations/supabase/client';

export interface Equipment {
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

export const equipmentService = {
  async getAllEquipments(): Promise<{ data: Equipment[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('equipamentos')
        .select('id, nome, categoria, ativo, tecnologia, beneficios, diferenciais, indicacoes, efeito, image_url')
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error('Erro ao buscar equipamentos:', error);
        return { data: null, error: error.message };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { data: null, error: 'Erro inesperado ao buscar equipamentos' };
    }
  },

  async getEquipmentsByCategory(category: string): Promise<{ data: Equipment[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('equipamentos')
        .select('id, nome, categoria, ativo, tecnologia, beneficios, diferenciais, indicacoes, efeito, image_url')
        .eq('ativo', true)
        .eq('categoria', category)
        .order('nome');

      if (error) {
        console.error('Erro ao buscar equipamentos por categoria:', error);
        return { data: null, error: error.message };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { data: null, error: 'Erro inesperado ao buscar equipamentos' };
    }
  },

  async getEquipmentById(id: string): Promise<{ data: Equipment | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('equipamentos')
        .select('id, nome, categoria, ativo, tecnologia, beneficios, diferenciais, indicacoes, efeito, image_url')
        .eq('id', id)
        .eq('ativo', true)
        .single();

      if (error) {
        console.error('Erro ao buscar equipamento:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { data: null, error: 'Erro inesperado ao buscar equipamento' };
    }
  }
};