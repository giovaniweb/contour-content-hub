
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
