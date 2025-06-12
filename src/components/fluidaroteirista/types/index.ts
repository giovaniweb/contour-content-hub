
export interface FluidaScriptResult {
  roteiro: string;
  formato: string;
  emocao_central: string;
  intencao: string;
  objetivo: string;
  mentor: string;
  elementos_aplicados?: any;
  especialidades_aplicadas?: string[];
  modo_usado?: string;
  disney_applied?: boolean;
  equipamentos_utilizados?: any[];
}

export interface ScriptGenerationData {
  tema: string;
  equipamentos?: string[];
  objetivo?: string;
  mentor?: string;
  formato?: string;
  modo?: string;
}
