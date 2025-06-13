
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

  // CORREÇÃO CRÍTICA: Validação mais permissiva para Stories 10x
  const isStories10x = data.formato === 'stories_10x';
  const minTemaLength = isStories10x ? 3 : 5; // Stories 10x permite temas mais curtos
  
  if (!data.tema || data.tema.trim().length < minTemaLength) {
    missingFields.push('tema');
    errors.push(`Tema muito curto (mínimo ${minTemaLength} caracteres)`);
    if (!isStories10x) {
      suggestions.push('Descreva melhor o tema do seu conteúdo');
    }
  } else if (data.tema.trim().length < 8 && !isStories10x) {
    // Se tem entre 5-7 caracteres e não é Stories 10x, sugerir melhoria
    suggestions.push('Considere expandir o tema para obter melhores resultados');
  }

  // Validação de equipamentos (opcional)
  if (!data.equipamentos || data.equipamentos.length === 0) {
    suggestions.push('Nenhum equipamento selecionado - o roteiro será mais genérico');
  }

  // CORREÇÃO: Lógica de qualidade mais permissiva para Stories 10x
  let quality: 'low' | 'medium' | 'high' = 'high';
  
  if (isStories10x) {
    // Stories 10x sempre tem quality alta se tem os campos básicos
    quality = missingFields.length === 0 ? 'high' : 'medium';
  } else {
    if (missingFields.length > 2) {
      quality = 'low';
    } else if (missingFields.length > 0 || data.tema.trim().length < 8) {
      quality = 'medium';
    }
  }

  const isValid = errors.length === 0;

  console.log('✅ [validateAkinatorScript] Resultado da validação:', {
    isValid,
    quality,
    errors: errors.length,
    missingFields: missingFields.length,
    temaLength: data.tema?.length || 0,
    isStories10x
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

  // CORREÇÃO: Tema mais permissivo para Stories 10x
  const isStories10x = data.formato === 'stories_10x';
  const minTemaLength = isStories10x ? 3 : 5;
  const hasValidTema = data.tema && data.tema.trim().length >= minTemaLength;

  const isComplete = hasAllRequired && hasValidTema;

  console.log('✅ [isAkinatorFlowComplete] Fluxo completo?', isComplete, {
    hasAllRequired,
    hasValidTema,
    temaLength: data.tema?.length || 0,
    isStories10x,
    minRequired: minTemaLength
  });

  return isComplete;
};
