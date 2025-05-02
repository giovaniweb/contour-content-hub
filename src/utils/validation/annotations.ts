
import { ValidationResult, ValidationBlock } from './types';
import { TextAnnotation } from '@/components/script/AnnotatedText';

/**
 * Converte blocos de validação em anotações para o componente AnnotatedText
 * Otimizado para performance com processamento mínimo
 * 
 * @param validation Resultado da validação
 * @returns Array de anotações de texto
 */
export const mapValidationToAnnotations = (validation: ValidationResult): TextAnnotation[] => {
  // Verificação rápida para retorno antecipado
  if (!validation.blocos || validation.blocos.length === 0) {
    return [];
  }
  
  // Definir tamanho inicial do array para evitar realocações
  const annotations: TextAnnotation[] = [];
  const blocksCount = Math.min(validation.blocos.length, 50); // Limitar para no máximo 50 blocos
  
  // Processar apenas um número limitado de blocos para manter desempenho
  for (let i = 0; i < blocksCount; i++) {
    const bloco = validation.blocos[i];
    if (!bloco.texto) continue;
    
    // Determinar tipo com lógica simplificada
    let type: "positive" | "negative" | "suggestion" | "gancho" | "conflito" | "virada" | "cta";
    
    // Verificação simplificada para tipos conhecidos
    switch (bloco.tipo) {
      case "gancho": type = "gancho"; break;
      case "conflito": type = "conflito"; break;
      case "virada": type = "virada"; break;
      case "cta": type = "cta"; break;
      default:
        // Para outros tipos, classificar por pontuação
        type = bloco.nota >= 8 ? "positive" : bloco.nota < 6 ? "negative" : "suggestion";
    }
    
    // Criar mensagem de forma otimizada
    const message = bloco.substituir ? `Sugestão: ${bloco.sugestao}` : `Pontuação: ${bloco.nota.toFixed(1)}/10`;
    
    // Adicionar apenas os campos necessários
    annotations.push({
      text: bloco.texto,
      type,
      suggestion: bloco.sugestao,
      score: bloco.nota,
      blockType: bloco.tipo as any,
      replace: bloco.substituir === true,
      action: message
    });
  }
  
  return annotations;
};
