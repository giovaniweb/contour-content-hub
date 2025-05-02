
import { ValidationResult, ValidationBlock } from './types';
import { TextAnnotation } from '@/components/script/AnnotatedText';

/**
 * Converte blocos de validação em anotações para o componente AnnotatedText
 * @param validation Resultado da validação
 * @returns Array de anotações de texto
 */
export const mapValidationToAnnotations = (validation: ValidationResult): TextAnnotation[] => {
  const annotations: TextAnnotation[] = [];
  
  if (!validation.blocos || validation.blocos.length === 0) {
    return annotations;
  }
  
  // Mapear cada bloco de validação para uma anotação
  validation.blocos.forEach((bloco) => {
    if (!bloco.texto) return;
    
    // Definir tipo com base na nota do bloco
    let type: "positive" | "negative" | "suggestion" | "gancho" | "conflito" | "virada" | "cta" = "suggestion";
    
    // Mapear tipo do bloco para o tipo de anotação
    if (bloco.tipo === "gancho") type = "gancho";
    else if (bloco.tipo === "conflito") type = "conflito";
    else if (bloco.tipo === "virada") type = "virada";
    else if (bloco.tipo === "cta") type = "cta";
    else if (bloco.nota >= 8) type = "positive";
    else if (bloco.nota < 6) type = "negative";
    
    // Construir mensagem da anotação
    const message = bloco.substituir
      ? `Sugestão: ${bloco.sugestao}`
      : `Pontuação: ${bloco.nota.toFixed(1)}/10`;
    
    // Adicionar anotação
    annotations.push({
      text: bloco.texto,
      type,
      suggestion: bloco.sugestao,
      score: bloco.nota,
      blockType: bloco.tipo as any,
      replace: bloco.substituir === true,
      action: message
    });
  });
  
  return annotations;
};
