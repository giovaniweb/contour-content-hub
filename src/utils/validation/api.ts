
import { supabase } from '@/integrations/supabase/client';
import { ValidationResult } from './types';
import { ScriptResponse } from '../api';
import { ValidationCache } from './validation-cache';
import { fetchValidationFromDB, saveValidationToDB } from './db-service';
import { getLocalValidation, saveLocalValidation } from './local-storage';
import { useToast } from '@/hooks/use-toast';

// Cache de validações para evitar requisições duplicadas
const validationCache = ValidationCache.getInstance();

export const validateScript = async (script: ScriptResponse): Promise<ValidationResult> => {
  try {
    console.log("Iniciando validação para roteiro:", script.id);
    
    // 1. Verificar primeiro no cache em memória
    const cachedValidation = validationCache.get(script.id);
    if (cachedValidation) {
      console.log("Usando validação em cache");
      return cachedValidation;
    }
    
    // 2. Verificar se já existe uma validação recente no banco de dados ou localStorage
    const existingValidation = await getValidation(script.id);
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    if (existingValidation && existingValidation.timestamp && new Date(existingValidation.timestamp) > oneHourAgo) {
      console.log("Usando validação existente recente");
      validationCache.set(script.id, existingValidation);
      return existingValidation;
    }
    
    // 3. Chamar edge function para validar roteiro com IA
    console.log("Enviando solicitação para validação avançada com GPT-4o");
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
    
    // 4. Salvar validação no banco de dados e cache
    await saveValidation(script.id, data);
    validationCache.set(script.id, data);
    
    return data;
  } catch (error) {
    console.error('Erro ao validar roteiro:', error);
    throw error;
  }
};

export const getValidation = async (scriptId: string): Promise<ValidationResult & {timestamp?: string} | null> => {
  try {
    console.log("Buscando validação para roteiro:", scriptId);
    
    // Verificar se o ID é um UUID válido
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(scriptId);
    
    // Se não for um UUID, usar armazenamento local
    if (!isUuid) {
      return getLocalValidation(scriptId);
    }
    
    // Para UUIDs válidos, buscar no banco de dados
    return await fetchValidationFromDB(scriptId);
  } catch (error) {
    console.error('Erro ao buscar validação:', error);
    return null;
  }
};

export const saveValidation = async (scriptId: string, validation: ValidationResult): Promise<void> => {
  try {
    console.log("Salvando validação para roteiro:", scriptId);
    
    // Verificar se o ID é um UUID válido
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(scriptId);
    
    // Se não for um UUID, usar armazenamento local
    if (!isUuid) {
      saveLocalValidation(scriptId, validation);
      return;
    }
    
    // Para UUIDs válidos, salvar no banco de dados
    await saveValidationToDB(scriptId, validation);
  } catch (error) {
    console.error('Erro ao salvar validação:', error);
    throw error;
  }
};
