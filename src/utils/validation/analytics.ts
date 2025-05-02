
import { ValidationResult, ValidationBlock } from './types';

/**
 * Interface para estatísticas agregadas de validações
 */
export interface ValidationStats {
  countTotal: number;
  averageScoreOverall: number;
  averageScoreByBlock: {
    gancho: number;
    conflito: number;
    virada: number;
    cta: number;
  };
  mostCommonSuggestions: string[];
}

/**
 * Registra dados de validação para análise futura
 * @param scriptId ID do roteiro
 * @param scriptType Tipo do roteiro
 * @param validation Resultado da validação
 */
export const logValidationAnalytics = async (
  scriptId: string, 
  scriptType: string, 
  validation: ValidationResult
): Promise<void> => {
  try {
    // Preparar dados para análise de forma mais leve
    const analyticsData = {
      script_id: scriptId,
      script_type: scriptType,
      timestamp: new Date().toISOString(),
      score_overall: validation.nota_geral,
      score_gancho: validation.gancho,
      score_clareza: validation.clareza,
      score_cta: validation.cta,
      score_emocao: validation.emocao,
      blocks_count: validation.blocos?.length || 0,
      suggestions_count: validation.sugestoes_gerais?.length || 0,
      has_improvement_suggestions: validation.blocos?.some(b => b.substituir === true) || false
    };
    
    // Otimização: armazenar menos dados e limitar tamanho do histórico
    const storageKey = 'validation_analytics';
    const existingDataJson = localStorage.getItem(storageKey);
    
    try {
      // Usar uma abordagem mais otimizada para manipular localStorage
      let analytics = [];
      if (existingDataJson) {
        analytics = JSON.parse(existingDataJson);
        // Limitar a apenas 20 registros mais recentes para economia de memória
        if (analytics.length > 20) {
          analytics = analytics.slice(-20);
        }
      }
      
      // Adicionar novo registro e salvar
      analytics.push(analyticsData);
      localStorage.setItem(storageKey, JSON.stringify(analytics));
      
      console.log('Analytics de validação registrado');
    } catch (storageError) {
      // Em caso de erro de armazenamento (como limite excedido), limpe e tente novamente
      console.warn('Erro no localStorage, limpando analytics antigos:', storageError);
      localStorage.removeItem(storageKey);
      localStorage.setItem(storageKey, JSON.stringify([analyticsData]));
    }
  } catch (error) {
    console.error('Erro ao registrar analytics de validação:', error);
  }
};

/**
 * Extrai insights dos dados de validação acumulados
 */
export const getValidationInsights = async (): Promise<ValidationStats | null> => {
  try {
    // Otimização: apenas recuperar dados se necessário
    const storageKey = 'validation_analytics';
    const existingDataJson = localStorage.getItem(storageKey);
    if (!existingDataJson) {
      return null;
    }
    
    const analytics = JSON.parse(existingDataJson);
    if (analytics.length === 0) {
      return null;
    }
    
    return processValidationData(analytics);
  } catch (error) {
    console.error('Erro ao obter insights de validação:', error);
    return null;
  }
};

// Função auxiliar para processar dados - otimizada para performance
const processValidationData = (data: any[]): ValidationStats => {
  // Limitar o número de registros processados para evitar travamentos
  const limitedData = data.length > 50 ? data.slice(-50) : data;
  const countTotal = limitedData.length;
  
  // Usar reduce uma única vez para coletar todas as somas
  const sums = limitedData.reduce((acc, item) => {
    acc.overall += (parseFloat(item.score_overall) || 0);
    acc.gancho += (parseFloat(item.score_gancho) || 0);
    acc.clareza += (parseFloat(item.score_clareza) || 0);
    acc.cta += (parseFloat(item.score_cta) || 0);
    acc.emocao += (parseFloat(item.score_emocao) || 0);
    return acc;
  }, { overall: 0, gancho: 0, clareza: 0, cta: 0, emocao: 0 });
  
  return {
    countTotal,
    averageScoreOverall: sums.overall / countTotal,
    averageScoreByBlock: {
      gancho: sums.gancho / countTotal,
      conflito: sums.clareza / countTotal,
      virada: sums.emocao / countTotal,
      cta: sums.cta / countTotal,
    },
    mostCommonSuggestions: [] // Implementação futura mais eficiente
  };
};
