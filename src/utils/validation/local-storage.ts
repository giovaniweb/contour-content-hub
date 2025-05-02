
import { ValidationResult } from './types';

// Funções para armazenamento local de validações
export const saveLocalValidation = (scriptId: string, validation: ValidationResult): void => {
  if (typeof window === 'undefined') return;
  
  const validationKey = `validation_${scriptId}`;
  const validationData = {...validation, timestamp: new Date().toISOString()};
  localStorage.setItem(validationKey, JSON.stringify(validationData));
};

export const getLocalValidation = (scriptId: string): ValidationResult & {timestamp?: string} | null => {
  if (typeof window === 'undefined') return null;
  
  const validationKey = `validation_${scriptId}`;
  const storedValidation = localStorage.getItem(validationKey);
  
  if (storedValidation) {
    return JSON.parse(storedValidation);
  }
  return null;
};
