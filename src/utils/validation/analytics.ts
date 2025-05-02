
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
    // Preparar dados para análise
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
    
    // Salvar em localStorage para análise offline
    const storageKey = 'validation_analytics';
    const existingData = localStorage.getItem(storageKey);
    const analytics = existingData ? JSON.parse(existingData) : [];
    analytics.push(analyticsData);
    localStorage.setItem(storageKey, JSON.stringify(analytics.slice(-100))); // Manter apenas os 100 mais recentes
    
    console.log('Analytics de validação registrado no localStorage:', analyticsData);
  } catch (error) {
    console.error('Erro ao registrar analytics de validação:', error);
  }
};

/**
 * Extrai insights dos dados de validação acumulados
 */
export const getValidationInsights = async (): Promise<ValidationStats | null> => {
  try {
    // Usar dados do localStorage
    const storageKey = 'validation_analytics';
    const existingData = localStorage.getItem(storageKey);
    const analytics = existingData ? JSON.parse(existingData) : [];
    
    if (analytics.length === 0) {
      return null;
    }
    
    return processValidationData(analytics);
  } catch (error) {
    console.error('Erro ao obter insights de validação:', error);
    return null;
  }
};

// Função auxiliar para processar dados
const processValidationData = (data: any[]): ValidationStats => {
  const countTotal = data.length;
  
  const sumScoreOverall = data.reduce((sum, item) => sum + (parseFloat(item.score_overall) || 0), 0);
  const sumScoreGancho = data.reduce((sum, item) => sum + (parseFloat(item.score_gancho) || 0), 0);
  const sumScoreClarity = data.reduce((sum, item) => sum + (parseFloat(item.score_clareza) || 0), 0);
  const sumScoreCta = data.reduce((sum, item) => sum + (parseFloat(item.score_cta) || 0), 0);
  const sumScoreEmotional = data.reduce((sum, item) => sum + (parseFloat(item.score_emocao) || 0), 0);
  
  return {
    countTotal,
    averageScoreOverall: sumScoreOverall / countTotal,
    averageScoreByBlock: {
      gancho: sumScoreGancho / countTotal,
      conflito: sumScoreClarity / countTotal,
      virada: sumScoreEmotional / countTotal,
      cta: sumScoreCta / countTotal,
    },
    mostCommonSuggestions: [] // Implementação futura para extrair sugestões comuns
  };
};
