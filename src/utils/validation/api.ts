
import { supabase } from '@/integrations/supabase/client';
import { ValidationResult } from './types';
import { ScriptResponse } from '../api';
import { ValidationCache } from './validation-cache';

// Cache de validações para evitar requisições duplicadas
const validationCache = new class {
  private cache: Map<string, ValidationResult> = new Map();
  
  get(id: string): ValidationResult | undefined {
    return this.cache.get(id);
  }
  
  set(id: string, data: ValidationResult): void {
    this.cache.set(id, data);
  }
  
  clear(): void {
    this.cache.clear();
  }
};

/**
 * Valida um roteiro usando a função edge validate-script
 */
export const validateScript = async (script: ScriptResponse): Promise<ValidationResult> => {
  try {
    // Verificar cache
    const cachedValidation = validationCache.get(script.id);
    if (cachedValidation) {
      return cachedValidation;
    }
    
    // Chamar função edge para validar roteiro
    const { data, error } = await supabase.functions.invoke('validate-script', {
      body: {
        content: script.content,
        type: script.type,
        title: script.title,
        scriptId: script.id
      }
    });
    
    if (error) {
      throw new Error(`Erro ao validar roteiro: ${error.message}`);
    }
    
    // Salvar validação para futura referência
    if (data) {
      await saveValidation(script.id, data);
      validationCache.set(script.id, data);
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao validar roteiro:', error);
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
    
    // Mapear para formato ValidationResult
    const result: ValidationResult = {
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
        : validation.sugestoes,
      blocos: validation.blocos
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
