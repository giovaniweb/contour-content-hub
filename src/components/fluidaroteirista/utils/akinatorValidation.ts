
import { ValidationResult } from './antiGenericValidation';

export interface AkinatorScriptData {
  tipo_conteudo?: string;
  objetivo?: string;
  canal?: string;
  estilo?: string;
  equipamentos?: string[];
  tema?: string;
  modo?: string;
}

/**
 * Validação específica para o modo Akinator
 * Mais flexível que a validação geral, pois o usuário já passou por todo o fluxo
 */
export const validateAkinatorScript = (data: AkinatorScriptData): ValidationResult => {
  console.log('🔍 [akinatorValidation] Validando dados do Akinator:', data);
  
  const errors: string[] = [];
  const suggestions: string[] = [];
  const missingFields: string[] = [];
  
  // Verificações obrigatórias para Akinator
  if (!data.tipo_conteudo) {
    missingFields.push('tipo_conteudo');
    errors.push('Tipo de conteúdo não selecionado');
  }
  
  if (!data.objetivo) {
    missingFields.push('objetivo');
    errors.push('Objetivo não definido');
  }
  
  if (!data.canal) {
    missingFields.push('canal');
    errors.push('Canal não selecionado');
  }
  
  if (!data.estilo) {
    missingFields.push('estilo');
    errors.push('Estilo de comunicação não definido');
  }
  
  if (!data.tema || data.tema.trim().length < 5) {
    missingFields.push('tema');
    errors.push('Tema muito curto ou vazio');
    suggestions.push('Descreva o tema com pelo menos 5 caracteres');
  }
  
  // Validação mais flexível para equipamentos no modo Akinator
  if (!data.equipamentos || data.equipamentos.length === 0) {
    // Não é erro crítico no Akinator, apenas sugestão
    suggestions.push('Considere selecionar equipamentos específicos para personalizar o roteiro');
  }
  
  // Determinar qualidade
  let quality: 'low' | 'medium' | 'high' = 'low';
  
  if (errors.length === 0) {
    if (data.equipamentos && data.equipamentos.length > 0 && data.tema && data.tema.length > 15) {
      quality = 'high';
    } else if (data.tema && data.tema.length > 10) {
      quality = 'medium';
    }
  }
  
  const result: ValidationResult = {
    isValid: errors.length === 0, // No modo Akinator, se não há erros críticos, pode gerar
    errors,
    suggestions,
    missingFields,
    quality
  };
  
  console.log('📊 [akinatorValidation] Resultado da validação:', result);
  return result;
};

/**
 * Verifica se o usuário completou todas as etapas obrigatórias do Akinator
 */
export const isAkinatorFlowComplete = (data: AkinatorScriptData): boolean => {
  const requiredFields = ['tipo_conteudo', 'objetivo', 'canal', 'estilo', 'tema'];
  
  const completedFields = requiredFields.filter(field => {
    const value = data[field as keyof AkinatorScriptData];
    return value && (typeof value === 'string' ? value.trim().length > 0 : true);
  });
  
  const isComplete = completedFields.length === requiredFields.length;
  
  console.log('✅ [akinatorValidation] Fluxo completo?', isComplete, 
    `(${completedFields.length}/${requiredFields.length} campos)`);
  
  return isComplete;
};
