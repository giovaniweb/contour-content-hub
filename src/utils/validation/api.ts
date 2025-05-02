
import { supabase } from '@/integrations/supabase/client';
import { ValidationResult } from './types';
import { ScriptResponse } from '../api';
import { ValidationCache } from './validation-cache';
import { fetchValidationFromDB, saveValidationToDB } from './db-service';
import { getLocalValidation, saveLocalValidation } from './local-storage';
import { logValidationAnalytics } from './analytics';

// Cache de validações para evitar requisições duplicadas
const validationCache = ValidationCache.getInstance();

/**
 * Valida um roteiro usando a IA
 * Otimizado para melhor performance e experiência de usuário
 */
export const validateScript = async (script: ScriptResponse): Promise<ValidationResult> => {
  try {
    console.log("Iniciando validação para roteiro:", script.id);
    
    // 1. Verificar primeiro no cache em memória (mais rápido)
    const cachedValidation = validationCache.get(script.id);
    if (cachedValidation) {
      console.log("Usando validação em cache");
      return cachedValidation;
    }
    
    // 2. Verificar se já existe uma validação recente no banco ou localStorage
    const existingValidation = await getValidation(script.id);
    const thirtyMinutesAgo = new Date();
    thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);
    
    if (existingValidation && existingValidation.timestamp && new Date(existingValidation.timestamp) > thirtyMinutesAgo) {
      console.log("Usando validação existente recente");
      validationCache.set(script.id, existingValidation);
      return existingValidation;
    }
    
    // 3. Otimização: Preparar conteúdo para validação (limitar tamanho se necessário)
    let contentToValidate = script.content;
    const MAX_CONTENT_LENGTH = 5000; // Limitar tamanho para melhorar desempenho
    if (contentToValidate && contentToValidate.length > MAX_CONTENT_LENGTH) {
      contentToValidate = contentToValidate.substring(0, MAX_CONTENT_LENGTH) + 
        "\n[...Conteúdo truncado para otimizar desempenho...]";
    }
    
    // 4. Implementar validação com timeout para evitar travamentos
    console.log("Enviando solicitação para validação avançada com GPT-4o");
    
    // Criar uma promessa com timeout para evitar esperas infinitas
    const validationResult: any = await Promise.race([
      supabase.functions.invoke('validate-script', {
        body: {
          content: contentToValidate,
          type: script.type,
          title: script.title,
          scriptId: script.id
        }
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout: A validação do roteiro excedeu o tempo limite.")), 30000)
      )
    ]);
    
    // Verificar resultado da validação
    if (!validationResult || validationResult.error) {
      throw new Error(validationResult?.error || "Erro desconhecido na validação");
    }
    
    console.log("Validação concluída com sucesso");
    const data = validationResult.data as ValidationResult;
    
    // 5. Salvar validação otimizada e registar análise sem bloquear o UI
    setTimeout(() => {
      saveValidation(script.id, data).catch(console.error);
      logValidationAnalytics(script.id, script.type, data).catch(console.error);
    }, 100);
    
    // Adicionar ao cache imediatamente
    validationCache.set(script.id, data);
    
    return data;
  } catch (error) {
    console.error('Erro ao validar roteiro:', error);
    throw error;
  }
};

// Função otimizada para buscar validação de diversas fontes
export const getValidation = async (scriptId: string): Promise<ValidationResult & {timestamp?: string} | null> => {
  try {
    // Verificar se o ID é um UUID válido
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(scriptId);
    
    // Para IDs temporários, usar armazenamento local apenas
    if (!isUuid) {
      return getLocalValidation(scriptId);
    }
    
    // Para UUIDs válidos, buscar no banco de dados com timeout
    try {
      // Adicionar timeout para evitar esperas longas
      const timeoutPromise = new Promise<null>((resolve) => 
        setTimeout(() => resolve(null), 3000) // 3s timeout
      );
      
      const dbResult = await Promise.race([
        fetchValidationFromDB(scriptId),
        timeoutPromise
      ]);
      
      if (dbResult) return dbResult;
      
      // Fallback para storage local se o DB timeout
      return getLocalValidation(scriptId);
    } catch (dbError) {
      console.warn('Erro ao buscar do DB, usando localStorage:', dbError);
      return getLocalValidation(scriptId);
    }
  } catch (error) {
    console.error('Erro ao buscar validação:', error);
    return null;
  }
};

// Função para salvar validação em background
export const saveValidation = async (scriptId: string, validation: ValidationResult): Promise<void> => {
  try {
    // Verificar se o ID é um UUID válido
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(scriptId);
    
    // Se não for um UUID, usar armazenamento local
    if (!isUuid) {
      saveLocalValidation(scriptId, validation);
      return;
    }
    
    // Para UUIDs válidos, tentar salvar no banco de dados
    try {
      await Promise.race([
        saveValidationToDB(scriptId, validation),
        new Promise((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), 5000))
      ]);
    } catch (dbError) {
      console.warn('Erro ao salvar no DB, usando localStorage:', dbError);
      saveLocalValidation(scriptId, validation);
    }
  } catch (error) {
    console.error('Erro ao salvar validação:', error);
    // Sempre tentar salvar localmente como fallback
    saveLocalValidation(scriptId, validation);
  }
};
