
import { supabase } from '@/integrations/supabase/client';
import { ValidationResult } from './types';
import { ScriptResponse } from '../api';
import { ValidationCache } from './validation-cache';

// Get instance of the validation cache singleton
const validationCache = ValidationCache.getInstance();

/**
 * Valida um roteiro usando a função edge validate-script
 */
export const validateScript = async (script: ScriptResponse): Promise<ValidationResult> => {
  try {
    // Verificar cache
    const cachedValidation = validationCache.get(script.id);
    if (cachedValidation) {
      console.log('Usando validação em cache para:', script.id);
      return cachedValidation;
    }
    
    // Chamar função edge para validar roteiro com timeout
    console.log('Iniciando validação de roteiro:', script.id || 'novo roteiro');

    // Adicionar um timeout à chamada para evitar que fique presa
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const { data, error } = await supabase.functions.invoke('validate-script', {
        body: {
          content: script.content,
          type: script.type,
          title: script.title,
          scriptId: script.id
        },
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      if (error) {
        console.error('Erro na resposta da validação:', error);
        throw new Error(`Erro ao validar roteiro: ${error.message}`);
      }
      
      if (!data) {
        console.error('Resposta vazia na validação');
        throw new Error('Resposta vazia na validação do roteiro');
      }
      
      // Salvar validação para futura referência
      await saveValidation(script.id, data);
      validationCache.set(script.id, data);
      
      console.log('Validação concluída com sucesso:', data.total || data.nota_geral);
      return data;
    } catch (fetchError) {
      clearTimeout(timeout);
      
      if (fetchError.name === 'AbortError') {
        console.error('Timeout na validação do roteiro');
        throw new Error('A validação excedeu o tempo limite. Tente um texto mais curto ou tente novamente mais tarde.');
      }
      
      console.error('Erro na chamada de validação:', fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error('Erro ao validar roteiro:', error);
    
    // Tentar fornecer uma resposta de fallback em caso de erro crítico
    if (script.content && script.content.length > 0) {
      try {
        console.log('Tentando criar resultado de validação de fallback');
        // Criar um resultado de validação básico com base no conteúdo
        const fallbackResult: ValidationResult = {
          blocos: [],
          nota_geral: 5,
          gancho: 5,
          clareza: 5,
          cta: 5,
          emocao: 5,
          total: 5,
          sugestoes: "Não foi possível analisar seu roteiro em detalhes. Tente novamente mais tarde.",
          sugestoes_gerais: ["Verifique a clareza do texto", "Certifique-se de incluir um bom gancho inicial", "Trabalhe em um CTA mais forte"]
        };
        
        return fallbackResult;
      } catch (fallbackError) {
        console.error('Erro ao criar validação de fallback:', fallbackError);
      }
    }
    
    throw error;
  }
};

/**
 * Busca validação existente por script ID
 */
export const getValidation = async (scriptId: string): Promise<ValidationResult | null> => {
  try {
    // Verificar cache
    const cachedValidation = validationCache.get(scriptId);
    if (cachedValidation) {
      return cachedValidation;
    }
    
    // Primeiro tentar buscar do banco de dados
    const { data, error } = await supabase
      .from('roteiro_validacoes')
      .select('*')
      .eq('roteiro_id', scriptId)
      .order('data_validacao', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.warn('Validação não encontrada no banco:', error);
      
      // Tentar buscar do localStorage como fallback
      try {
        const localData = localStorage.getItem(`script_validation_${scriptId}`);
        if (localData) {
          return JSON.parse(localData);
        }
      } catch (localError) {
        console.error('Erro ao buscar validação do localStorage:', localError);
      }
      
      return null;
    }
    
    // Parse blocos from sugestoes if available
    let blocos = [];
    try {
      if (data.sugestoes && data.sugestoes.includes('"tipo":')) {
        const parsedData = JSON.parse(data.sugestoes);
        if (Array.isArray(parsedData)) {
          blocos = parsedData;
        }
      }
    } catch (e) {
      // silently fail
    }
    
    // Mapear para formato ValidationResult
    const result: ValidationResult = {
      blocos: blocos,
      nota_geral: data.pontuacao_total || 0,
      gancho: data.pontuacao_gancho || 0,
      clareza: data.pontuacao_clareza || 0,
      cta: data.pontuacao_cta || 0,
      emocao: data.pontuacao_emocao || 0,
      total: data.pontuacao_total || 0,
      sugestoes: data.sugestoes || '',
      timestamp: data.data_validacao
    };
    
    validationCache.set(scriptId, result);
    return result;
  } catch (error) {
    console.error('Erro ao buscar validação:', error);
    return null;
  }
};

/**
 * Salva resultado de validação
 */
export const saveValidation = async (scriptId: string, validation: ValidationResult): Promise<void> => {
  try {
    // Convert blocos to JSON string if needed
    let sugestoesText = validation.sugestoes || '';
    
    // If we have blocos but no sugestoes text, serialize blocos
    if (validation.blocos && (!validation.sugestoes || validation.sugestoes.trim() === '')) {
      try {
        sugestoesText = JSON.stringify(validation.blocos);
      } catch (e) {
        console.error('Erro ao serializar blocos:', e);
      }
    }
    
    // Salvar no banco de dados
    const { error } = await supabase.from('roteiro_validacoes').insert({
      roteiro_id: scriptId,
      pontuacao_gancho: validation.gancho,
      pontuacao_clareza: validation.clareza,
      pontuacao_cta: validation.cta,
      pontuacao_emocao: validation.emocao,
      pontuacao_total: validation.total || validation.nota_geral,
      sugestoes: Array.isArray(validation.sugestoes_gerais) 
        ? validation.sugestoes_gerais.join('\n') 
        : sugestoesText
    });
    
    if (error) {
      console.error('Erro ao salvar validação no banco:', error);
      
      // Fallback para localStorage
      try {
        localStorage.setItem(`script_validation_${scriptId}`, JSON.stringify({
          ...validation,
          timestamp: new Date().toISOString()
        }));
      } catch (localError) {
        console.error('Erro ao salvar validação no localStorage:', localError);
      }
    }
  } catch (error) {
    console.error('Erro ao salvar validação:', error);
  }
};
