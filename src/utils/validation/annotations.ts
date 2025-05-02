
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
    
    // Definir cor com base na nota do bloco
    let color = "green";
    if (bloco.nota < 4) color = "red";
    else if (bloco.nota < 6) color = "orange";
    else if (bloco.nota < 8) color = "yellow";
    
    // Definir tipo de ícone com base no tipo de bloco
    let icon = "info";
    if (bloco.tipo === "gancho") icon = "hook";
    else if (bloco.tipo === "cta") icon = "target";
    else if (bloco.tipo === "conflito") icon = "alert";
    else if (bloco.tipo === "virada") icon = "sparkles";
    
    // Construir mensagem da anotação
    const message = bloco.substituir
      ? `Sugestão: ${bloco.sugestao}`
      : `Pontuação: ${bloco.nota.toFixed(1)}/10`;
    
    // Adicionar anotação
    annotations.push({
      text: bloco.texto,
      color,
      icon,
      message,
      needsAttention: bloco.substituir === true,
      suggestion: bloco.sugestao
    });
  });
  
  return annotations;
};
