
/**
 * Representa um bloco específico de validação de um roteiro
 */
export interface ValidationBlock {
  tipo: 'gancho' | 'conflito' | 'virada' | 'cta' | string;
  nota: number;
  texto: string;
  sugestao?: string;
  substituir?: boolean;
}

/**
 * Representa critérios de pontuação para um roteiro
 */
export interface CriteriaScores {
  hook: number;
  clarity: number;
  callToAction: number;
  emotionalConnection: number;
  overall: number;
}

/**
 * Representa o resultado completo de uma validação de roteiro
 */
export interface ValidationResult {
  blocos: ValidationBlock[];
  nota_geral: number;
  sugestoes_gerais?: string[];
  sugestoes?: string;
  gancho: number;
  clareza: number;
  cta: number;
  emocao: number;
  total: number;
  timestamp?: string;
  
  // Campos adicionais para compatibilidade com nova estrutura
  scores?: CriteriaScores;
  analysis?: string;
  improvements?: string[];
  warnings?: string[];
}

/**
 * Interface para entradas de cache com timestamp
 */
export interface CacheEntry {
  blocos: ValidationBlock[];
  nota_geral: number;
  sugestoes_gerais?: string[];
  sugestoes?: string;
  gancho: number;
  clareza: number;
  cta: number;
  emocao: number;
  total: number;
  timestamp: number;  // Este é o timestamp numérico usado para controle de cache
}

/**
 * Representa um plano de assinatura
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
 * Representa métricas de engajamento do cliente
 */
export interface ClientEngagement {
  scriptsGenerated: number;
  lastActive: Date;
  weeklyActivity: number[];
  validationScore: number;
}

/**
 * Representa análise de cliente
 */
export interface ClientAnalytics {
  conversions: number;
  engagement: number;
  contentQuality: number;
  activity: {
    date: string;
    count: number;
  }[];
}
