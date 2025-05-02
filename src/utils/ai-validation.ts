
import { supabase } from '@/integrations/supabase/client';
import { ScriptResponse } from './api';

interface ValidationScore {
  gancho: number;
  clareza: number;
  cta: number;
  emocao: number;
  total: number;
  sugestoes: string;
}

export const validateScript = async (script: ScriptResponse): Promise<ValidationScore> => {
  try {
    // Chamar edge function para validar roteiro com IA
    const { data, error } = await supabase.functions.invoke('validate-script', {
      body: {
        content: script.content,
        type: script.type,
        title: script.title
      }
    });
    
    if (error) throw error;
    
    // Salvar validação no banco de dados
    await saveValidation(script.id, data);
    
    return data;
  } catch (error) {
    console.error('Erro ao validar roteiro:', error);
    return {
      gancho: 0,
      clareza: 0, 
      cta: 0,
      emocao: 0,
      total: 0,
      sugestoes: 'Não foi possível validar o roteiro.'
    };
  }
};

export const getValidation = async (scriptId: string): Promise<ValidationScore | null> => {
  try {
    const { data, error } = await supabase
      .from('roteiro_validacoes')
      .select('*')
      .eq('roteiro_id', scriptId)
      .single();
      
    if (error) return null;
    
    return {
      gancho: data.pontuacao_gancho,
      clareza: data.pontuacao_clareza,
      cta: data.pontuacao_cta,
      emocao: data.pontuacao_emocao,
      total: data.pontuacao_total,
      sugestoes: data.sugestoes
    };
  } catch (error) {
    console.error('Erro ao buscar validação:', error);
    return null;
  }
};

const saveValidation = async (scriptId: string, validation: ValidationScore) => {
  try {
    await supabase
      .from('roteiro_validacoes')
      .upsert({
        roteiro_id: scriptId,
        pontuacao_gancho: validation.gancho,
        pontuacao_clareza: validation.clareza,
        pontuacao_cta: validation.cta,
        pontuacao_emocao: validation.emocao,
        pontuacao_total: validation.total,
        sugestoes: validation.sugestoes
      });
  } catch (error) {
    console.error('Erro ao salvar validação:', error);
  }
};
