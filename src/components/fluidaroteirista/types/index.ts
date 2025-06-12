
export interface FluidaScriptResult {
  id?: string;
  roteiro: string;
  formato: string;
  emocao_central: string;
  intencao: string;
  objetivo: string;
  mentor: string;
  canal?: string; // Adicionando a propriedade canal
  elementos_aplicados?: any;
  especialidades_aplicadas?: string[];
  modo_usado?: string;
  disney_applied?: boolean;
  equipamentos_utilizados?: any[];
  created_at?: string;
}

export interface ScriptGenerationData {
  tema: string;
  equipamentos?: string[];
  objetivo?: string;
  mentor?: string;
  formato?: string;
  modo?: string;
  // Akinator specific fields
  tipo_conteudo?: string;
  canal?: string;
  estilo?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
  missingFields: string[];
  quality: 'low' | 'medium' | 'high';
}
