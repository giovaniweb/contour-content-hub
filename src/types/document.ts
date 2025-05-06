
export interface TechnicalDocument {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: string;
  equipamento_id?: string;
  idioma_original?: string;
  link_dropbox?: string;
  arquivo_url?: string;
  status?: string;
  data_criacao?: string;
  criado_por?: string;
  conteudo_extraido?: string;
  keywords?: string[];
  researchers?: string[];
  vetor_embeddings?: any;
}
