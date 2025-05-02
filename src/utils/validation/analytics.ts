
import { ValidationResult } from './types';

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

// Armazenamento em memória para limitar uso do localStorage
const analyticsMemoryBuffer: any[] = [];
const MAX_ANALYTICS_BUFFER = 5;

/**
 * Função auxiliar para verificar dispositivos com poucos recursos
 * Compatível com TypeScript
 */
const isLowMemoryDevice = (): boolean => {
  try {
    // Verificar se a API deviceMemory está disponível
    return typeof window !== 'undefined' && 
           'navigator' in window && 
           // @ts-ignore - deviceMemory é experimental, mas queremos usar se disponível
           typeof navigator.deviceMemory === 'number' && 
           // @ts-ignore
           navigator.deviceMemory < 4;
  } catch {
    // Se não conseguir verificar a memória, assume que não é dispositivo de baixa memória
    return false;
  }
};

/**
 * Registra dados de validação para análise futura
 * Implementação extremamente otimizada para baixo consumo de recursos
 */
export const logValidationAnalytics = async (
  scriptId: string, 
  scriptType: string, 
  validation: ValidationResult
): Promise<void> => {
  try {
    // Verificar se estamos em um dispositivo com pouca memória
    if (isLowMemoryDevice()) {
      console.log("Dispositivo com pouca memória detectado, analytics desativado");
      return; // Não registrar em dispositivos com pouca memória
    }
    
    // Preparar dados para análise de forma mais leve
    const analyticsData = {
      script_id: scriptId,
      script_type: scriptType,
      timestamp: new Date().toISOString(),
      score_overall: validation.nota_geral,
      score_gancho: validation.gancho,
      score_clareza: validation.clareza,
      score_cta: validation.cta,
      score_emocao: validation.emocao
    };
    
    // Adicionar ao buffer em memória
    analyticsMemoryBuffer.push(analyticsData);
    
    // Se o buffer atingir o limite, salvar no localStorage
    if (analyticsMemoryBuffer.length >= MAX_ANALYTICS_BUFFER) {
      // Salvar buffer no localStorage e limpar
      saveAnalyticsToStorage(analyticsMemoryBuffer);
      analyticsMemoryBuffer.length = 0;
    }
    
    console.log('Analytics de validação registrado em buffer');
  } catch (error) {
    console.warn('Erro ao registrar analytics de validação:', error);
  }
};

// Função para salvar analytics no localStorage
const saveAnalyticsToStorage = (analyticsData: any[]): void => {
  try {
    const storageKey = 'validation_analytics';
    const existingDataJson = localStorage.getItem(storageKey);
    
    let analytics = [];
    if (existingDataJson) {
      analytics = JSON.parse(existingDataJson);
      // Limitar a apenas 15 registros mais recentes para economia de memória
      if (analytics.length > 15) {
        analytics = analytics.slice(-15);
      }
    }
    
    // Adicionar novos registros e salvar
    analytics.push(...analyticsData);
    localStorage.setItem(storageKey, JSON.stringify(analytics));
  } catch (storageError) {
    console.warn('Erro no localStorage, limpando analytics:', storageError);
    localStorage.removeItem('validation_analytics');
  }
};

/**
 * Extrai insights dos dados de validação acumulados
 * Implementação otimizada para performance
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
    console.warn('Erro ao obter insights de validação:', error);
    return null;
  }
};

// Função auxiliar para processar dados - otimizada para performance
const processValidationData = (data: any[]): ValidationStats => {
  // Limitar o número de registros processados para evitar travamentos
  const limitedData = data.length > 15 ? data.slice(-15) : data;
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
    mostCommonSuggestions: [] // Implementação simplificada para economizar recursos
  };
};
