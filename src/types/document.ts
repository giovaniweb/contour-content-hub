
import { Database } from '@/integrations/supabase/types';

export type DocumentType = 'artigo_cientifico' | 'ficha_tecnica' | 'protocolo' | 'outro';
export type DocumentStatus = 'ativo' | 'inativo' | 'processando';

export interface TechnicalDocument {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: DocumentType;
  equipamento_id?: string;
  equipamento_nome?: string;
  link_dropbox?: string;
  idioma_original: string;
  idiomas_traduzidos: string[];
  status: DocumentStatus;
  criado_por: string;
  data_criacao: string;
  conteudo_extraido?: string;
  preview_url?: string;
  vetor_embeddings?: string;
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
