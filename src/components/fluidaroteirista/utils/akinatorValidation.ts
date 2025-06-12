
import { ValidationResult } from '../types';

// CORREÇÃO: Tipo atualizado para nova estrutura de 6 passos
export interface ScriptDataFromAkinator {
  canal: string;
  formato: string;
  objetivo: string;
  estilo: string;
  equipamentos: string[];
  tema: string;
  modo: string;
}

export const validateAkinatorScript = (data: ScriptDataFromAkinator): ValidationResult => {
  console.log('🔍 [validateAkinatorScript] Validando dados do Akinator:', data);
  
  const errors: string[] = [];
  const suggestions: string[] = [];
  const missingFields: string[] = [];

  // CORREÇÃO: Validações atualizadas para nova estrutura
  if (!data.canal) {
    missingFields.push('canal');
    errors.push('Canal de publicação não selecionado');
  }

  if (!data.formato) {
    missingFields.push('formato');
    errors.push('Formato do conteúdo não selecionado');
  }

  if (!data.objetivo) {
    missingFields.push('objetivo');
    errors.push('Objetivo não definido');
  }

  if (!data.estilo) {
    missingFields.push('estilo');
    errors.push('Estilo de comunicação não selecionado');
  }

  // CORREÇÃO: Validação do tema mais flexível - de 10 para 5 caracteres mínimos
  if (!data.tema || data.tema.trim().length < 5) {
    missingFields.push('tema');
    errors.push('Tema muito curto (mínimo 5 caracteres)');
    suggestions.push('Descreva melhor o tema do seu conteúdo');
  } else if (data.tema.trim().length < 10) {
    // Se tem entre 5-9 caracteres, sugerir melhoria mas não bloquear
    suggestions.push('Considere expandir o tema para obter melhores resultados');
  }

  // Validação de equipamentos (opcional)
  if (!data.equipamentos || data.equipamentos.length === 0) {
    suggestions.push('Nenhum equipamento selecionado - o roteiro será mais genérico');
  }

  // CORREÇÃO: Lógica de qualidade mais flexível
  let quality: 'low' | 'medium' | 'high' = 'high';
  
  if (missingFields.length > 2) {
    quality = 'low';
  } else if (missingFields.length > 0 || data.tema.trim().length < 8) {
    quality = 'medium';
  }

  const isValid = errors.length === 0;

  console.log('✅ [validateAkinatorScript] Resultado da validação:', {
    isValid,
    quality,
    errors: errors.length,
    missingFields: missingFields.length,
    temaLength: data.tema?.length || 0
  });

  return {
    isValid,
    errors,
    suggestions,
    missingFields,
    quality
  };
};

export const isAkinatorFlowComplete = (data: ScriptDataFromAkinator): boolean => {
  console.log('🔍 [isAkinatorFlowComplete] Verificando completude do fluxo:', data);
  
  // CORREÇÃO: Verificação atualizada para nova estrutura
  const requiredFields = ['canal', 'formato', 'objetivo', 'estilo', 'tema'];
  const hasAllRequired = requiredFields.every(field => {
    const value = data[field as keyof ScriptDataFromAkinator];
    return value && (typeof value === 'string' ? value.trim().length > 0 : true);
  });

  // CORREÇÃO: Tema deve ter pelo menos 5 caracteres (não 10)
  const hasValidTema = data.tema && data.tema.trim().length >= 5;

  const isComplete = hasAllRequired && hasValidTema;

  console.log('✅ [isAkinatorFlowComplete] Fluxo completo?', isComplete, {
    hasAllRequired,
    hasValidTema,
    temaLength: data.tema?.length || 0
  });

  return isComplete;
};
