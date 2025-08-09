// P1-002: Configurações padronizadas para OpenAI
export const OPENAI_MODELS = {
  SCRIPT_GENERATION: 'gpt-4.1-2025-04-14',
  BIG_IDEAS: 'gpt-4.1-2025-04-14', 
  VALIDATION: 'gpt-4.1-mini-2025-04-14',
  MARKETING: 'gpt-4.1-2025-04-14'
} as const;

// Modelos GPT-5 disponíveis
export const OPENAI_GPT5_MODELS = {
  CORE: 'gpt-5',
  MINI: 'gpt-5-mini',
  CHAT: 'gpt-5-chat'
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

// GPT-5 Mode constants and routing
export const GPT5_CORE = 'gpt-5';
export const GPT5_MINI = 'gpt-5-mini';
export const G4_1 = 'gpt-4.1';

export const BAN_LIST = [
  /ladeira\s*copywarrior/gi,
  /copywarrior/gi,
  /do\s+jeito\s+ladeira/gi,
  /metodologia\s+ladeira/gi
];

export type { ModelTier } from '@/types/ai';

export const modelRouter = (tier: import('@/types/ai').ModelTier): string[] => {
  if (tier === 'gpt5') return [GPT5_CORE, GPT5_MINI, G4_1];
  return [G4_1];
};
