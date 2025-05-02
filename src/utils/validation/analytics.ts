
/**
 * Registra métricas de análise para as validações de roteiros
 * Melhora a qualidade do sistema ao longo do tempo
 */
export const logValidationAnalytics = async (
  scriptId: string, 
  scriptType: string,
  validation: any
): Promise<void> => {
  // Implementação básica que pode ser expandida no futuro
  try {
    // Se o roteiro não tem nota de validação acima de 5, o registro é mais importante
    const needsImprovement = validation.nota_geral < 5 || validation.total < 5;
    
    // Apenas log para monitoramento
    console.log('Analytics de validação:', {
      scriptId,
      scriptType,
      scores: {
        gancho: validation.gancho,
        clareza: validation.clareza,
        cta: validation.cta,
        emocao: validation.emocao,
        total: validation.total || validation.nota_geral
      },
      needsImprovement,
      timestamp: new Date().toISOString()
    });
    
    // Aqui você pode implementar chamadas para tracking de métricas
    // como Google Analytics, Mixpanel, etc. quando necessário
  } catch (error) {
    // Não deve quebrar fluxo principal
    console.error('Erro ao registrar analytics de validação:', error);
  }
};

/**
 * Rastreia melhorias aplicadas pelos usuários
 */
export const trackSuggestionAcceptance = async (
  scriptId: string,
  originalText: string,
  suggestion: string,
  accepted: boolean
): Promise<void> => {
  try {
    // Apenas log para monitoramento
    console.log('Sugestão de melhoria:', {
      scriptId,
      accepted,
      originalLength: originalText.length,
      suggestionLength: suggestion.length,
      timestamp: new Date().toISOString()
    });
    
    // Aqui você pode implementar chamadas para tracking de métricas
  } catch (error) {
    console.error('Erro ao registrar aceitação de sugestão:', error);
  }
};
