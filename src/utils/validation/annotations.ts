
import { ValidationResult, ValidationBlock } from './types';
import { TextAnnotation } from '@/components/script/AnnotatedText';

/**
 * Mapeia os blocos de validação para anotações de texto que podem ser exibidas
 * no componente AnnotatedText
 */
export const mapValidationToAnnotations = (validation: ValidationResult): TextAnnotation[] => {
  const annotations: TextAnnotation[] = [];

  // Adicionar blocos como anotações
  if (validation.blocos) {
    validation.blocos.forEach(bloco => {
      if (!bloco.texto || bloco.texto.trim() === '') return;

      // Determinar o tipo de anotação com base na nota do bloco
      const type = bloco.nota >= 8 ? 'positive' : 
                   bloco.nota >= 6 ? 'suggestion' : 'negative';

      annotations.push({
        type,
        text: bloco.texto,
        suggestion: bloco.sugestao || undefined,
        score: bloco.nota,
        blockType: bloco.tipo as any,
        replace: bloco.substituir || false
      });
    });
  }

  return annotations;
};

/**
 * Cria anotações para texto baseado em pontuações específicas
 */
export const createScoreAnnotations = (
  content: string,
  scores: {
    gancho?: number,
    clareza?: number,
    cta?: number,
    emocao?: number
  }
): TextAnnotation[] => {
  const annotations: TextAnnotation[] = [];
  
  // Identifica parágrafos para classificação
  const paragraphs = content.split(/\n\n+/);
  
  // Primeiro parágrafo é geralmente o gancho
  if (paragraphs.length > 0 && scores.gancho !== undefined) {
    annotations.push({
      type: 'gancho',
      text: paragraphs[0],
      score: scores.gancho,
      blockType: 'gancho'
    });
  }
  
  // Último parágrafo geralmente contém o CTA
  if (paragraphs.length > 1 && scores.cta !== undefined) {
    annotations.push({
      type: 'cta',
      text: paragraphs[paragraphs.length - 1],
      score: scores.cta,
      blockType: 'cta'
    });
  }
  
  return annotations;
};
