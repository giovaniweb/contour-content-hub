
import { ValidationResult, ValidationBlock } from './types';
import { TextAnnotation } from '@/components/script/AnnotatedText';

/**
 * Converte blocos de validação em anotações para o componente AnnotatedText
 * Super otimizado para performance com processamento mínimo
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
  const maxBlocks = 20; // Limitar ainda mais para melhor performance
  const blocksCount = Math.min(validation.blocos.length, maxBlocks);
  
  // Processar apenas um número limitado de blocos para manter desempenho
  for (let i = 0; i < blocksCount; i++) {
    const bloco = validation.blocos[i];
    if (!bloco.texto) continue;
    
    // Determinar tipo com lógica simplificada em única passagem
    let type: "positive" | "negative" | "suggestion" | "gancho" | "conflito" | "virada" | "cta";
    
    // Mapeamento direto para eliminar condicionais
    const typeMap: Record<string, "gancho" | "conflito" | "virada" | "cta"> = {
      "gancho": "gancho",
      "conflito": "conflito", 
      "virada": "virada",
      "cta": "cta"
    };
    
    // Usar o tipo específico ou classificar por pontuação
    type = typeMap[bloco.tipo] || 
           (bloco.nota >= 8 ? "positive" : bloco.nota < 6 ? "negative" : "suggestion");
    
    // Criar mensagem de forma otimizada (sem template strings para economia de recursos)
    const message = bloco.substituir ? "Sugestão: " + (bloco.sugestao || "") : 
                                      "Pontuação: " + (bloco.nota.toFixed(1)) + "/10";
    
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
