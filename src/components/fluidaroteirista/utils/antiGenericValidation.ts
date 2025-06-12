
import { ScriptGenerationData } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
  missingFields: string[];
  quality: 'low' | 'medium' | 'high';
}

export const validatePreGeneration = (data: ScriptGenerationData): ValidationResult => {
  const errors: string[] = [];
  const suggestions: string[] = [];
  const missingFields: string[] = [];
  
  if (!data.tema || data.tema.trim().length < 5) {
    missingFields.push('tema');
    errors.push('Tema muito curto ou vazio');
    suggestions.push('Descreva o tema com pelo menos 5 caracteres');
  }
  
  if (!data.objetivo) {
    missingFields.push('objetivo');
    suggestions.push('Defina um objetivo claro para o roteiro');
  }
  
  if (!data.equipamentos || data.equipamentos.length === 0) {
    suggestions.push('Selecione equipamentos específicos para personalizar o roteiro');
  }
  
  let quality: 'low' | 'medium' | 'high' = 'low';
  
  if (errors.length === 0) {
    if (data.equipamentos && data.equipamentos.length > 0 && data.tema && data.tema.length > 15) {
      quality = 'high';
    } else if (data.tema && data.tema.length > 10) {
      quality = 'medium';
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    suggestions,
    missingFields,
    quality
  };
};

export const validatePostGeneration = (script: string): ValidationResult => {
  const errors: string[] = [];
  const suggestions: string[] = [];
  
  if (script.length < 50) {
    errors.push('Roteiro muito curto');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    suggestions,
    missingFields: [],
    quality: errors.length === 0 ? 'high' : 'low'
  };
};
