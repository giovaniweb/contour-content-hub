
import { useCallback } from 'react';

interface AnalyticsEvent {
  event: string;
  payload?: any;
  timestamp: number;
  session_id: string;
  user_profile?: any;
}

const ANALYTICS_KEY = 'mestre_da_beleza_analytics';

export function useMestreDaBelezaAnalytics() {
  
  const logEvent = useCallback((eventName: string, payload?: any, userProfile?: any) => {
    try {
      const analytics = getAnalytics();
      const newEvent: AnalyticsEvent = {
        event: eventName,
        payload,
        timestamp: Date.now(),
        session_id: userProfile?.session_id || 'unknown',
        user_profile: userProfile ? {
          step: userProfile.step,
          responses_count: Object.keys(userProfile.responses || {}).length,
          idade_estimada: userProfile.idade_estimada,
          problema_identificado: userProfile.problema_identificado
        } : undefined
      };
      
      analytics.push(newEvent);
      
      // Manter apenas os últimos 100 eventos para não sobrecarregar o localStorage
      const trimmedAnalytics = analytics.slice(-100);
      
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(trimmedAnalytics));
      
      console.log('📊 [Analytics] Evento registrado:', eventName, payload);
    } catch (error) {
      console.warn('Erro ao registrar analytics:', error);
    }
  }, []);

  const getAnalytics = useCallback((): AnalyticsEvent[] => {
    try {
      const data = localStorage.getItem(ANALYTICS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }, []);

  const clearAnalytics = useCallback(() => {
    localStorage.removeItem(ANALYTICS_KEY);
  }, []);

  const getSessionStats = useCallback((sessionId: string) => {
    const events = getAnalytics().filter(e => e.session_id === sessionId);
    
    return {
      total_events: events.length,
      questions_answered: events.filter(e => e.event === 'question_answered').length,
      time_spent: events.length > 0 ? 
        events[events.length - 1].timestamp - events[0].timestamp : 0,
      completion_rate: events.some(e => e.event === 'recommendation_generated') ? 100 : 
        (events.filter(e => e.event === 'question_answered').length / 12) * 100
    };
  }, [getAnalytics]);

  const exportAnalytics = useCallback(() => {
    const analytics = getAnalytics();
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mestre-da-beleza-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }, [getAnalytics]);

  return {
    logEvent,
    getAnalytics,
    clearAnalytics,
    getSessionStats,
    exportAnalytics
  };
}

// Eventos pré-definidos para facilitar o uso
export const ANALYTICS_EVENTS = {
  SESSION_STARTED: 'session_started',
  QUESTION_ANSWERED: 'question_answered',
  RECOMMENDATION_GENERATED: 'recommendation_generated',
  SESSION_RESET: 'session_reset',
  EQUIPMENT_SELECTED: 'equipment_selected',
  SESSION_COMPLETED: 'session_completed',
  ERROR_OCCURRED: 'error_occurred'
} as const;
