// P1-002: Configurações padronizadas para OpenAI
export const OPENAI_MODELS = {
  SCRIPT_GENERATION: 'gpt-4.1-2025-04-14',
  BIG_IDEAS: 'gpt-4.1-2025-04-14', 
  VALIDATION: 'gpt-4.1-mini-2025-04-14',
  MARKETING: 'gpt-4.1-2025-04-14'
} as const;

export const OPENAI_CONFIG = {
  maxTokens: 2000,
  temperature: 0.7,
  timeout: 30000,
  retries: 3
} as const;

export const API_RATE_LIMITS = {
  perMinute: 60,
  perHour: 1000,
  perDay: 10000
} as const;

export const validateOpenAIConfig = (): boolean => {
  try {
    const apiKey = (typeof process !== 'undefined' && (process as any).env && (process as any).env.OPENAI_API_KEY) || null;
    return Boolean(apiKey);
  } catch {
    // Em ambiente de browser, evitar crash por ausência de process
    return true;
  }
};