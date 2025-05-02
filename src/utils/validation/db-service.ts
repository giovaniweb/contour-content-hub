
import { supabase } from '@/integrations/supabase/client';
import { ValidationResult } from './types';

/**
 * Busca a validação mais recente do banco de dados
 */
export const fetchValidationFromDB = async (scriptId: string): Promise<ValidationResult & {timestamp: string} | null> => {
  try {
    const { data, error } = await supabase
      .from('roteiro_validacoes')
      .select('*')
      .eq('roteiro_id', scriptId)
      .order('data_validacao', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    // Mapear para formato ValidationResult
    return {
      blocos: data.blocos || [],
      nota_geral: data.pontuacao_total || 0,
      gancho: data.pontuacao_gancho || 0,
      clareza: data.pontuacao_clareza || 0,
      cta: data.pontuacao_cta || 0,
      emocao: data.pontuacao_emocao || 0,
      total: data.pontuacao_total || 0,
      sugestoes: data.sugestoes || '',
      timestamp: data.data_validacao
    };
  } catch (error) {
    console.error('Erro ao buscar validação do banco:', error);
    return null;
  }
};

/**
 * Salva validação no banco de dados
 */
export const saveValidationToDB = async (scriptId: string, validation: ValidationResult): Promise<void> => {
  try {
    const { error } = await supabase.from('roteiro_validacoes').insert({
      roteiro_id: scriptId,
      pontuacao_gancho: validation.gancho || 0,
      pontuacao_clareza: validation.clareza || 0,
      pontuacao_cta: validation.cta || 0,
      pontuacao_emocao: validation.emocao || 0,
      pontuacao_total: validation.total || validation.nota_geral || 0,
      sugestoes: Array.isArray(validation.sugestoes_gerais) 
        ? validation.sugestoes_gerais.join('\n') 
        : validation.sugestoes || '',
      blocos: validation.blocos || []
    });
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Erro ao salvar validação no banco:', error);
    throw error;
  }
};

/**
 * Busca histórico de validações para análise
 */
export const getValidationHistory = async (scriptId: string): Promise<Array<ValidationResult & {timestamp: string}>> => {
  try {
    const { data, error } = await supabase
      .from('roteiro_validacoes')
      .select('*')
      .eq('roteiro_id', scriptId)
      .order('data_validacao', { ascending: false });
    
    if (error || !data) {
      return [];
    }
    
    // Mapear resultados
    return data.map(item => ({
      blocos: item.blocos || [],
      nota_geral: item.pontuacao_total || 0,
      gancho: item.pontuacao_gancho || 0,
      clareza: item.pontuacao_clareza || 0,
      cta: item.pontuacao_cta || 0,
      emocao: item.pontuacao_emocao || 0,
      total: item.pontuacao_total || 0,
      sugestoes: item.sugestoes || '',
      timestamp: item.data_validacao
    }));
  } catch (error) {
    console.error('Erro ao buscar histórico de validação:', error);
    return [];
  }
};
