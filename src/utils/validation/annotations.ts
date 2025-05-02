
import { ValidationResult } from './types';

export interface TextAnnotation {
  type: 'positive' | 'negative' | 'suggestion' | 'gancho' | 'conflito' | 'virada' | 'cta';
  text: string;
  suggestion?: string;
  score?: number;
  blockType?: 'gancho' | 'conflito' | 'virada' | 'cta';
  replace?: boolean;
}

// Função para mapear a validação para o formato de annotations
export const mapValidationToAnnotations = (validation: ValidationResult | null): TextAnnotation[] => {
  if (!validation) return [];

  const annotations = [];

  // Mapear os blocos para anotações
  if (validation.blocos && validation.blocos.length > 0) {
    for (const bloco of validation.blocos) {
      const type = bloco.nota >= 7 ? 'positive' : 'negative';
      
      annotations.push({
        type: bloco.tipo,
        text: bloco.texto,
        suggestion: bloco.sugestao,
        score: bloco.nota,
        blockType: bloco.tipo,
        replace: bloco.substituir
      });
    }
  } else {
    // Fallback para o formato antigo se não houver blocos
    // Criar anotações simuladas baseadas nos scores gerais
    if (validation.gancho < 7) {
      annotations.push({
        type: 'gancho',
        text: "Primeiro parágrafo do roteiro",
        suggestion: "O gancho inicial precisa ser mais impactante e cativante",
        score: validation.gancho,
        blockType: 'gancho'
      });
    }
    
    if (validation.cta < 7) {
      annotations.push({
        type: 'cta',
        text: "Último parágrafo do roteiro",
        suggestion: "O CTA precisa ser mais direto e persuasivo",
        score: validation.cta,
        blockType: 'cta'
      });
    }
  }

  return annotations;
};
