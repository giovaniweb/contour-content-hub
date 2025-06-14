
export type DocumentType = 'artigo_cientifico' | 'ficha_tecnica' | 'protocolo' | 'video' | 'outro';
export type DocumentStatus = 'ativo' | 'inativo' | 'processando';

export interface TechnicalDocument {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: DocumentType;
  equipamento_id?: string;
  equipamento_nome?: string;
  link_dropbox?: string;
  arquivo_url?: string;
  preview_url?: string;
  pdfUrl?: string;
  idioma_original?: string;
  idiomas_traduzidos?: string[];
  status?: DocumentStatus;
  data_criacao?: string;
  criado_por?: string;
  conteudo_extraido?: string;
  keywords?: string[];
  researchers?: string[];
  vetor_embeddings?: any;
  duracao?: string;
  video_url?: string;
}

export interface GetDocumentsParams {
  type?: DocumentType;
  equipmentId?: string;
  language?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface DocumentUploadForm {
  titulo: string;
  descricao: string;
  tipo: DocumentType;
  equipamento_id?: string;
  file?: File;
  idioma_original: string;
  video_url?: string;
}

export interface DocumentAction {
  action: 'translate' | 'summarize' | 'ask' | 'generate-content';
  documentId: string;
  params?: {
    targetLanguage?: string;
    question?: string;
    contentType?: 'video_script' | 'story' | 'big_idea';
  };
}
