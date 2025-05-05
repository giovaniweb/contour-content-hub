
/**
 * Resultado da validação do roteiro
 */
export interface ValidationResult {
  gancho?: number;
  clareza?: number;
  cta?: number;
  emocao?: number;
  nota_geral?: number;
  total?: number;
  sugestoes?: string;
  sugestoes_gerais?: string[];
  blocos?: ValidationBlock[];
  status?: 'success' | 'error' | 'loading';
  timestamp?: string; // Added for cache entries
}

/**
 * Bloco de validação para cada parte do roteiro
 */
export interface ValidationBlock {
  tipo: string;
  nota: number;
  sugestao?: string;
  texto?: string;
  substituir?: boolean;
}

/**
 * Entrada de cache para validações
 */
export interface CacheEntry extends ValidationResult {
  timestamp: number;
}

/**
 * Plano de assinatura para clientes
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  billingCycle: 'monthly' | 'yearly';
  active: boolean;
  aiGenerationLimit?: number;
  pdfExportLimit?: number;
  validationLimit?: number;
}

/**
 * Métricas de engajamento do cliente
 */
export interface ClientEngagement {
  scriptsGenerated: number;
  lastActive: Date;
  weeklyActivity: number[];
  validationScore: number;
}

/**
 * Dados analíticos do cliente
 */
export interface ClientAnalytics {
  views: number;
  engagement: number;
  conversions: number;
  metrics: {
    period: string;
    views: number;
    engagement: number;
    conversions: number;
  }[];
}
