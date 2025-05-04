
import { supabase, logQuery, logQueryResult } from './base';

/**
 * Busca arquivos relacionados a um equipamento pelo nome
 */
export const fetchEquipmentFiles = async (equipmentName: string): Promise<any[]> => {
  try {
    console.log(`Buscando arquivos para equipamento: ${equipmentName}`);
    logQuery('select', 'materiais', { equipment: equipmentName });
    
    const { data, error } = await supabase
      .from('materiais')
      .select('*')
      .ilike('tags', `%${equipmentName}%`);
      
    if (error) {
      console.error('Erro ao buscar arquivos relacionados:', error);
      logQueryResult('select', 'materiais', false, null, error);
      throw error;
    }
    
    console.log(`Arquivos encontrados para ${equipmentName}:`, data?.length || 0);
    logQueryResult('select', 'materiais', true, { count: data?.length || 0 });
    
    return data || [];
    
  } catch (error) {
    console.error(`Erro ao buscar arquivos para ${equipmentName}:`, error);
    throw error;
  }
};

/**
 * Busca vídeos relacionados a um equipamento pelo nome
 */
export const fetchEquipmentVideos = async (equipmentName: string): Promise<any[]> => {
  try {
    console.log(`Buscando vídeos para equipamento: ${equipmentName}`);
    logQuery('select', 'videos', { equipment: equipmentName });
    
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .contains('equipamentos', [equipmentName]);
      
    if (error) {
      console.error('Erro ao buscar vídeos relacionados:', error);
      logQueryResult('select', 'videos', false, null, error);
      throw error;
    }
    
    console.log(`Vídeos encontrados para ${equipmentName}:`, data?.length || 0);
    logQueryResult('select', 'videos', true, { count: data?.length || 0 });
    
    return data || [];
    
  } catch (error) {
    console.error(`Erro ao buscar vídeos para ${equipmentName}:`, error);
    throw error;
  }
};
