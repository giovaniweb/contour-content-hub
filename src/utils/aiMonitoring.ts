// P2-001: Sistema de monitoramento de custos de IA
import { supabase } from '@/integrations/supabase/client';

interface AIUsageMetrics {
  service: string;
  endpoint: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
  model: string;
  userId?: string;
  responseTime?: number;
}

interface CostReport {
  totalCost: number;
  totalTokens: number;
  requestCount: number;
  averageCost: number;
  averageTokens: number;
  costByService: Record<string, number>;
  tokensByService: Record<string, number>;
}

export class AIMonitoring {
  private static instance: AIMonitoring;
  private costs: AIUsageMetrics[] = [];

  static getInstance(): AIMonitoring {
    if (!this.instance) {
      this.instance = new AIMonitoring();
    }
    return this.instance;
  }

  async trackUsage(metrics: AIUsageMetrics): Promise<void> {
    try {
      const estimatedCost = this.calculateCost(metrics.promptTokens, metrics.completionTokens, metrics.model);
      // Armazenar localmente
      this.costs.push({
        ...metrics,
        estimatedCost,
      });

      // Enviar para Supabase se configurado
      if (metrics.userId) {
        await this.saveToDatabase({ ...metrics, estimatedCost });
      }

      // Log para monitoramento
      console.log(`💰 AI Cost: $${estimatedCost.toFixed(4)} | Tokens: ${metrics.totalTokens} | Service: ${metrics.service}`);
      
    } catch (error) {
      console.error('Erro ao rastrear uso de IA:', error);
    }
  }

  private calculateCost(promptTokens: number, completionTokens: number, model: string): number {
    // Preços por modelo (USD por 1K tokens)
    const pricing = {
      'gpt-4.1-2025-04-14': { input: 0.00250, output: 0.01000 },
      'gpt-4.1-mini-2025-04-14': { input: 0.00015, output: 0.00060 },
      'gpt-4o-mini': { input: 0.00015, output: 0.00060 },
      'gpt-4o': { input: 0.00500, output: 0.01500 }
    };

    const modelPricing = pricing[model as keyof typeof pricing] || pricing['gpt-4o-mini'];
    
    const inputCost = (promptTokens / 1000) * modelPricing.input;
    const outputCost = (completionTokens / 1000) * modelPricing.output;
    
    return inputCost + outputCost;
  }

  private async saveToDatabase(metrics: AIUsageMetrics): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_usage_metrics' as any)
        .insert({
          service_name: metrics.service,
          endpoint: metrics.endpoint,
          prompt_tokens: metrics.promptTokens,
          completion_tokens: metrics.completionTokens,
          total_tokens: metrics.totalTokens,
          estimated_cost: metrics.estimatedCost,
          model: metrics.model,
          user_id: metrics.userId || null,
          response_time_ms: metrics.responseTime || null,
        } as any);

      if (error) {
        console.error('Erro ao salvar métricas no banco:', error);
      }
    } catch (error) {
      console.error('Erro ao salvar métricas no banco:', error);
    }
  }

  generateReport(days: number = 30): CostReport {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentCosts = this.costs; // Em produção, filtrar por data

    const totalCost = recentCosts.reduce((sum, metric) => sum + metric.estimatedCost, 0);
    const totalTokens = recentCosts.reduce((sum, metric) => sum + metric.totalTokens, 0);
    const requestCount = recentCosts.length;

    const costByService = recentCosts.reduce((acc, metric) => {
      acc[metric.service] = (acc[metric.service] || 0) + metric.estimatedCost;
      return acc;
    }, {} as Record<string, number>);

    const tokensByService = recentCosts.reduce((acc, metric) => {
      acc[metric.service] = (acc[metric.service] || 0) + metric.totalTokens;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCost,
      totalTokens,
      requestCount,
      averageCost: requestCount > 0 ? totalCost / requestCount : 0,
      averageTokens: requestCount > 0 ? totalTokens / requestCount : 0,
      costByService,
      tokensByService
    };
  }

  async getOptimizationSuggestions(): Promise<string[]> {
    const report = this.generateReport();
    const suggestions: string[] = [];

    // Sugestões baseadas em uso
    if (report.averageTokens > 2000) {
      suggestions.push('Considere otimizar prompts - tokens médios acima de 2000');
    }

    if (report.totalCost > 10) {
      suggestions.push('Custo mensal alto - revisar uso de modelos premium');
    }

    const expensiveServices = Object.entries(report.costByService)
      .filter(([_, cost]) => cost > report.totalCost * 0.4)
      .map(([service]) => service);

    if (expensiveServices.length > 0) {
      suggestions.push(`Serviços com alto custo: ${expensiveServices.join(', ')}`);
    }

    return suggestions;
  }

  // Alertas automáticos
  checkCostAlerts(dailyBudget: number = 1.0): boolean {
    const today = new Date().toDateString();
    const todayCosts = this.costs.filter(cost => 
      new Date().toDateString() === today
    );
    
    const todayTotal = todayCosts.reduce((sum, cost) => sum + cost.estimatedCost, 0);
    
    if (todayTotal > dailyBudget) {
      console.warn(`🚨 Orçamento diário excedido: $${todayTotal.toFixed(4)} > $${dailyBudget}`);
      return true;
    }

    return false;
  }
}

// Helper para uso em edge functions
export const trackAIUsage = async (
  service: string,
  endpoint: string,
  promptTokens: number,
  completionTokens: number,
  model: string,
  userId?: string,
  responseTime?: number
) => {
  const monitor = AIMonitoring.getInstance();
  
  await monitor.trackUsage({
    service,
    endpoint,
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens,
    estimatedCost: 0, // Será calculado automaticamente
    model,
    userId,
    responseTime
  });
};

export default AIMonitoring;