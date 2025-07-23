export interface ScientificInsight {
  title: string;
  summary: string;
  relevanceScore: number;
  keywords: string[];
  source: string;
  authors?: string[];
  publicationDate?: string;
  fullText?: string;
  documentId?: string;
  filePath?: string;
  equipmentId?: string;
}

export interface ScriptResult {
  id: string;
  roteiro: string;
  formato: string;
  emocao_central: string;
  intencao: string;
  objetivo: string;
  mentor: string;
  canal?: string;
  elementos_aplicados?: any;
  especialidades_aplicadas?: string[];
  modo_usado?: string;
  disney_applied?: boolean;
  equipamentos_utilizados?: any[];
  created_at?: string;
}

export interface ScriptFormData {
  tema: string;
  equipamentos?: string[];
  objetivo?: string;
  mentor?: string;
  formato?: string;
  modo?: string;
  metodologia?: string;
  tipo_conteudo?: string;
  canal?: string;
  estilo?: string;
}