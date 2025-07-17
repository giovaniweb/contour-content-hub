import { supabase } from '@/integrations/supabase/client';
import { PDFProcessingResult, UploadResult } from './pdfProcessingService';
import type { UnifiedDocument, DocumentTypeEnum, ProcessingStatusEnum } from '@/types/document';

export interface CreateDocumentPayload {
  title: string;
  content: string;
  conclusion?: string;
  keywords: string[];
  authors: string[];
  rawText?: string;
  filePath?: string;
  equipamentoId?: string;
  status_processamento?: string;
}

export class UnifiedDocumentService {
  
  async deleteStorageFile(filePath: string): Promise<{success: boolean; error?: string}> {
    try {
      const { error } = await supabase.storage
        .from('documents')
        .remove([filePath]);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async processDocument(documentId: string): Promise<void> {
    try {
      console.log('🔄 [Unified Document] Iniciando processamento do documento:', documentId);
      
      // Chamar a edge function para processar o documento
      const { data, error } = await supabase.functions.invoke('process-document', {
        body: {
          documentId: documentId,
          forceRefresh: true
        }
      });

      if (error) {
        console.error('❌ [Unified Document] Erro no processamento:', error);
        throw new Error(`Erro no processamento do documento: ${error.message}`);
      }

      console.log('✅ [Unified Document] Processamento concluído:', data);
    } catch (error: any) {
      console.error('❌ [Unified Document] Erro ao processar documento:', error);
      throw error;
    }
  }

  
  /**
   * Cria um novo documento na tabela unified_documents
   */
  async createDocument(payload: CreateDocumentPayload): Promise<UnifiedDocument> {
    try {
      console.log('📝 [Unified Document] Criando documento:', payload.title);

      // Obter usuário atual
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('Usuário não autenticado');
      }

      // Usar a função do banco de dados para criar o documento
      const { data, error } = await supabase.rpc('create_unified_document', {
        p_title: payload.title,
        p_content: payload.content,
        p_conclusion: payload.conclusion || '',
        p_keywords: payload.keywords,
        p_authors: payload.authors,
        p_raw_text: payload.rawText || '',
        p_file_path: payload.filePath || null,
        p_user_id: userData.user.id,
        p_equipamento_id: payload.equipamentoId || null
      });

      if (error) {
        console.error('❌ [Unified Document] Erro ao criar:', error);
        throw new Error(`Erro ao criar documento: ${error.message}`);
      }

      // Buscar o documento criado para retornar completo
      const { data: document, error: fetchError } = await supabase
        .from('unified_documents')
        .select('*')
        .eq('id', data)
        .single();

      if (fetchError) {
        console.error('❌ [Unified Document] Erro ao buscar documento criado:', fetchError);
        throw new Error(`Erro ao buscar documento criado: ${fetchError.message}`);
      }

      console.log('✅ [Unified Document] Documento criado com sucesso:', document.id);
      return document as UnifiedDocument;

    } catch (error: any) {
      console.error('❌ [Unified Document] Erro:', error);
      throw error;
    }
  }

  /**
   * Atualiza um documento existente
   */
  async updateDocument(documentId: string, payload: Partial<CreateDocumentPayload>): Promise<UnifiedDocument> {
    try {
      console.log('🔄 [Unified Document] Atualizando documento:', documentId);

      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (payload.title) updateData.titulo_extraido = payload.title;
      if (payload.content) updateData.texto_completo = payload.content;
      if (payload.keywords) updateData.palavras_chave = payload.keywords;
      if (payload.authors) updateData.autores = payload.authors;
      if (payload.rawText) updateData.raw_text = payload.rawText;
      if (payload.filePath) updateData.file_path = payload.filePath;
      if (payload.equipamentoId) updateData.equipamento_id = payload.equipamentoId;

      const { data, error } = await supabase
        .from('unified_documents')
        .update(updateData)
        .eq('id', documentId)
        .select()
        .single();

      if (error) {
        console.error('❌ [Unified Document] Erro ao atualizar:', error);
        throw new Error(`Erro ao atualizar documento: ${error.message}`);
      }

      console.log('✅ [Unified Document] Documento atualizado com sucesso');
      return data as UnifiedDocument;

    } catch (error: any) {
      console.error('❌ [Unified Document] Erro:', error);
      throw error;
    }
  }

  /**
   * Busca documentos do usuário atual
   */
  async getDocuments(filters?: {
    search?: string;
    equipmentId?: string;
    limit?: number;
    offset?: number;
  }): Promise<UnifiedDocument[]> {
    try {
      console.log('🔍 [Unified Document] Buscando documentos');

      // Obter usuário atual
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('Usuário não autenticado');
      }

      let query = supabase
        .from('unified_documents')
        .select(`
          *,
          equipamentos!equipamento_id(nome)
        `)
        .eq('user_id', userData.user.id)
        .eq('tipo_documento', 'artigo_cientifico')
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters?.search) {
        query = query.or(`titulo_extraido.ilike.%${filters.search}%,texto_completo.ilike.%${filters.search}%`);
      }

      if (filters?.equipmentId) {
        query = query.eq('equipamento_id', filters.equipmentId);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ [Unified Document] Erro ao buscar:', error);
        throw new Error(`Erro ao buscar documentos: ${error.message}`);
      }

      console.log('✅ [Unified Document] Documentos encontrados:', data?.length || 0);
      return (data || []) as UnifiedDocument[];

    } catch (error: any) {
      console.error('❌ [Unified Document] Erro:', error);
      throw error;
    }
  }

  /**
   * Exclui um documento
   */
  async deleteDocument(documentId: string): Promise<void> {
    try {
      console.log('🗑️ [Unified Document] Excluindo documento:', documentId);

      const { error } = await supabase
        .from('unified_documents')
        .delete()
        .eq('id', documentId);

      if (error) {
        console.error('❌ [Unified Document] Erro ao excluir:', error);
        throw new Error(`Erro ao excluir documento: ${error.message}`);
      }

      console.log('✅ [Unified Document] Documento excluído com sucesso');

    } catch (error: any) {
      console.error('❌ [Unified Document] Erro:', error);
      throw error;
    }
  }

  /**
   * Cria documento a partir de resultados de processamento
   */
  async createFromProcessing(
    upload: UploadResult,
    processing: PDFProcessingResult,
    equipamentoId?: string
  ): Promise<UnifiedDocument> {
    try {
      console.log('🔧 [Unified Document] Criando documento a partir de processamento');

      const payload: CreateDocumentPayload = {
        title: processing.title,
        content: processing.content,
        conclusion: processing.conclusion,
        keywords: processing.keywords,
        authors: processing.authors,
        rawText: processing.rawText,
        filePath: upload.success ? upload.filePath : undefined,
        equipamentoId
      };

      return await this.createDocument(payload);

    } catch (error: any) {
      console.error('❌ [Unified Document] Erro ao criar documento:', error);
      throw error;
    }
  }
}

// Instância singleton do serviço
export const unifiedDocumentService = new UnifiedDocumentService();