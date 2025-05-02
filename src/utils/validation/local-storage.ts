
import { ValidationResult } from './types';

/**
 * Chave para identificar validações no localStorage
 */
const getValidationKey = (scriptId: string): string => `script_validation_${scriptId}`;

/**
 * Salva uma validação no localStorage
 */
export const saveLocalValidation = (scriptId: string, validation: ValidationResult): void => {
  try {
    const key = getValidationKey(scriptId);
    localStorage.setItem(key, JSON.stringify({
      ...validation,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Erro ao salvar validação no localStorage:', error);
  }
};

/**
 * Busca uma validação do localStorage
 */
export const getLocalValidation = (scriptId: string): ValidationResult & {timestamp?: string} | null => {
  try {
    const key = getValidationKey(scriptId);
    const data = localStorage.getItem(key);
    
    if (!data) return null;
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao recuperar validação do localStorage:', error);
    return null;
  }
};

/**
 * Remove uma validação do localStorage
 */
export const removeLocalValidation = (scriptId: string): void => {
  try {
    const key = getValidationKey(scriptId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Erro ao remover validação do localStorage:', error);
  }
};
