
export interface ValidationBlock {
  tipo: 'gancho' | 'conflito' | 'virada' | 'cta';
  nota: number;
  texto: string;
  sugestao?: string;
  substituir?: boolean;
}

export interface ValidationResult {
  blocos: ValidationBlock[];
  nota_geral: number;
  sugestoes_gerais: string[];
  gancho: number;
  clareza: number;
  cta: number;
  emocao: number;
  total: number;
  sugestoes: string;
}

export interface StoredValidation extends ValidationResult {
  timestamp?: string;
}
