// Matches the ENUM in the database migration: supabase/migrations/YYYYMMDDHHMMSS_create_unified_documents_table.sql
export type DocumentTypeEnum =
  | 'artigo_cientifico'
  | 'ficha_tecnica'
  | 'protocolo'
  | 'folder_publicitario'
  | 'outro';

// Matches the ENUM in the database migration
export type ProcessingStatusEnum =
  | 'pendente'
  | 'processando'
  | 'concluido'
  | 'falhou';

// Interface for the new unified_documents table
export interface UnifiedDocument {
  id: string; // UUID
  tipo_documento: DocumentTypeEnum;
  titulo_extraido: string | null;
  palavras_chave: string[] | null; // TEXT[]
  autores: string[] | null;        // TEXT[]
  texto_completo: string | null;   // TEXT for large extracted content or summary
  raw_text: string | null;         // TEXT for raw text from PDF
  data_upload: string;             // TIMESTAMPTZ
  equipamento_id: string | null;   // UUID, foreign key to equipamentos
  user_id: string | null;          // UUID, foreign key to auth.users
  file_path: string | null;        // TEXT, path in Supabase Storage
  status_processamento: ProcessingStatusEnum;
  detalhes_erro: string | null;    // TEXT
  created_at: string;              // TIMESTAMPTZ
  updated_at: string;              // TIMESTAMPTZ

  // Optional joined fields (like from 'equipamentos' table)
  equipamento_nome?: string | null;

  // Optional client-side computed or convenience fields (can be added as needed)
  // For example, a short description for cards, derived from texto_completo
  descricao?: string | null;
  // pdfUrl?: string | null; // If generated on client: supabase.storage.from('documents').getPublicUrl(file_path).data.publicUrl
}

// Parameters for fetching documents, adapted for UnifiedDocument
export interface GetDocumentsParams {
  search?: string;
  equipmentId?: string;
  limit?: number;
  offset?: number;
  // tipo_documento is often implicitly set by the hook/context (e.g., useScientificArticles sets it to 'artigo_cientifico')
  // but can be a filter for a generic document list.
  tipo_documento?: DocumentTypeEnum;
  status_processamento?: ProcessingStatusEnum; // To filter by processing status

  // Fields specific to certain document types, if filtering directly on them:
  // For ScientificArticleFilters, these are already defined there.
  // palavras_chave?: string[];
  // autores?: string[];
  // dateRange?: { startDate?: string; endDate?: string };
}


// --- Old types (to be reviewed/removed if no longer used by any part of the app) ---

// export type DocumentType = 'artigo_cientifico' | 'ficha_tecnica' | 'protocolo' | 'video' | 'outro';
// export type DocumentStatus = 'ativo' | 'inativo' | 'processando';

// export interface TechnicalDocument {
//   id: string;
//   titulo: string;
//   descricao?: string;
//   tipo: DocumentType; // This would map to tipo_documento
//   equipamento_id?: string;
//   equipamento_nome?: string;
//   link_dropbox?: string; // Replaced by file_path and Supabase storage
//   arquivo_url?: string;  // Replaced by file_path
//   preview_url?: string;
//   pdfUrl?: string;
//   idioma_original?: string; // Consider if this needs to be part of unified_documents or AI extracted
//   idiomas_traduzidos?: string[];
//   status?: DocumentStatus; // Replaced by status_processamento
//   data_criacao?: string; // Replaced by data_upload or created_at
//   criado_por?: string; // Replaced by user_id
//   conteudo_extraido?: string; // Replaced by texto_completo / raw_text
//   keywords?: string[]; // Replaced by palavras_chave
//   researchers?: string[]; // Replaced by autores
//   vetor_embeddings?: any; // Consider if needed in UnifiedDocument, maybe a separate table or field
//   duracao?: string; // Specific to video, might be in metadata or a different table for media types
//   video_url?: string;
// }

// This form is now handled by IntelligentUploadForm and its Zod schema
// export interface DocumentUploadForm {
//   titulo: string;
//   descricao: string;
//   tipo: DocumentType;
//   equipamento_id?: string;
//   file?: File;
//   idioma_original: string;
//   video_url?: string;
// }

// DocumentAction might still be relevant for other document interactions
export interface DocumentAction {
  action: 'translate' | 'summarize' | 'ask' | 'generate-content';
  documentId: string; // This ID would now be from unified_documents
  params?: {
    targetLanguage?: string;
    question?: string;
    contentType?: 'video_script' | 'story' | 'big_idea';
  };
}
