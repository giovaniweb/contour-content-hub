
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
  blocos?: {
    tipo: string;
    nota: number;
    sugestao?: string;
  }[];
  status?: 'success' | 'error' | 'loading';
}
