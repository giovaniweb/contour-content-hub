
import { supabase } from '@/integrations/supabase/client';
import { ScriptResponse } from './api';
import { useToast } from '@/hooks/use-toast';

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
    console.log("Iniciando validação para roteiro:", script.id);
    
    // Verificar se já existe uma validação recente (menos de 1 hora)
    const existingValidation = await getValidation(script.id);
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    if (existingValidation && new Date(existingValidation.timestamp) > oneHourAgo) {
      console.log("Usando validação existente recente");
      return existingValidation;
    }
    
    // Chamar edge function para validar roteiro com IA
    const { data, error } = await supabase.functions.invoke('validate-script', {
      body: {
        content: script.content,
        type: script.type,
        title: script.title,
        scriptId: script.id
      }
    });
    
    if (error) {
      console.error("Erro ao invocar função validate-script:", error);
      throw error;
    }
    
    console.log("Validação concluída com sucesso:", data);
    
    // Salvar validação no banco de dados
    await saveValidation(script.id, data);
    
    return data;
  } catch (error) {
    console.error('Erro ao validar roteiro:', error);
    throw error;
  }
};

export const getValidation = async (scriptId: string): Promise<ValidationScore & {timestamp?: string} | null> => {
  try {
    console.log("Buscando validação para roteiro:", scriptId);
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
    
    return {
      gancho: data.pontuacao_gancho,
      clareza: data.pontuacao_clareza,
      cta: data.pontuacao_cta,
      emocao: data.pontuacao_emocao,
      total: data.pontuacao_total,
      sugestoes: data.sugestoes,
      timestamp: data.data_validacao
    };
  } catch (error) {
    console.error('Erro ao buscar validação:', error);
    return null;
  }
};

const saveValidation = async (scriptId: string, validation: ValidationScore): Promise<void> => {
  try {
    console.log("Salvando validação para roteiro:", scriptId);
    const { error } = await supabase
      .from('roteiro_validacoes')
      .insert({
        roteiro_id: scriptId,
        pontuacao_gancho: validation.gancho,
        pontuacao_clareza: validation.clareza,
        pontuacao_cta: validation.cta,
        pontuacao_emocao: validation.emocao,
        pontuacao_total: validation.total,
        sugestoes: validation.sugestoes,
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

// Função utilitária para obter indicador visual de qualidade
export const getQualityIndicator = (score: number | null): {
  color: string;
  label: string;
  icon: string;
} => {
  if (score === null) return { color: "gray", label: "Não avaliado", icon: "❓" };
  
  if (score >= 8) return { color: "green", label: "Excelente", icon: "🌟" };
  if (score >= 6) return { color: "yellow", label: "Bom", icon: "👍" };
  if (score >= 4) return { color: "orange", label: "Regular", icon: "⚠️" };
  return { color: "red", label: "Precisa melhorar", icon: "⚠️" };
};
