
import { supabase } from '@/integrations/supabase/client';
import { ValidationResult } from './types';

// Função para buscar validação do banco de dados
export const fetchValidationFromDB = async (scriptId: string): Promise<ValidationResult & {timestamp?: string} | null> => {
  try {
    // Verificar se o ID é um UUID válido
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(scriptId);
    
    if (!isUuid) {
      return null;
    }
    
    // Para UUIDs válidos, buscar no banco de dados
    const { data, error } = await supabase
      .from('roteiro_validacoes')
      .select('*')
      .eq('roteiro_id', scriptId)
      .order('data_validacao', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      console.log("Nenhuma validação encontrada para o roteiro:", scriptId);
      return null;
    }
    
    console.log("Validação encontrada:", data);
    
    // Mapear o formato do banco de dados para o formato esperado
    const result: ValidationResult = {
      blocos: [], // Inicializar com um array vazio por padrão
      nota_geral: data.pontuacao_total,
      sugestoes_gerais: data.sugestoes.split('\n'),
      // Campos antigos para manter compatibilidade
      gancho: data.pontuacao_gancho,
      clareza: data.pontuacao_clareza,
      cta: data.pontuacao_cta,
      emocao: data.pontuacao_emocao,
      total: data.pontuacao_total,
      sugestoes: data.sugestoes
    };
    
    // Se existir a propriedade blocos no objeto, usá-la
    if (data && typeof data === 'object' && 'blocos' in data && Array.isArray(data.blocos)) {
      result.blocos = data.blocos;
    }
    
    return {
      ...result,
      timestamp: data.data_validacao
    };
  } catch (error) {
    console.error('Erro ao buscar validação:', error);
    return null;
  }
};

// Função para salvar validação no banco de dados
export const saveValidationToDB = async (scriptId: string, validation: ValidationResult): Promise<void> => {
  try {
    // Verificar se o ID é um UUID válido
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(scriptId);
    
    if (!isUuid) {
      return;
    }
    
    // Consolidar sugestões gerais em uma string se necessário
    const sugestoesStr = Array.isArray(validation.sugestoes_gerais) 
      ? validation.sugestoes_gerais.join('\n')
      : validation.sugestoes;
    
    // Para UUIDs válidos, salvar no banco de dados
    const { error } = await supabase
      .from('roteiro_validacoes')
      .insert({
        roteiro_id: scriptId,
        pontuacao_gancho: validation.gancho,
        pontuacao_clareza: validation.clareza,
        pontuacao_cta: validation.cta,
        pontuacao_emocao: validation.emocao,
        pontuacao_total: validation.total || validation.nota_geral,
        sugestoes: sugestoesStr,
        blocos: validation.blocos
      });
    
    if (error) {
      console.error("Erro ao salvar validação:", error);
      throw error;
    }
    
    console.log("Validação salva com sucesso");
  } catch (error) {
    console.error('Erro ao salvar validação:', error);
    throw error;
  }
};
