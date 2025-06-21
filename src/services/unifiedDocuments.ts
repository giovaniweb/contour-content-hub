
import { supabase } from '@/integrations/supabase/client';
import { UnifiedDocument, DocumentTypeEnum, ProcessingStatusEnum, GetDocumentsParams } from '@/types/document';

export interface UnifiedDocumentService {
  fetchDocuments: (params?: GetDocumentsParams) => Promise<UnifiedDocument[]>;
  getDocumentById: (id: string) => Promise<UnifiedDocument | null>;
  uploadDocument: (file: File, tipo: DocumentTypeEnum, equipamentoId?: string) => Promise<string>;
  processDocument: (documentId: string) => Promise<boolean>;
  deleteDocument: (id: string) => Promise<boolean>;
}

class UnifiedDocumentServiceImpl implements UnifiedDocumentService {
  async fetchDocuments(params: GetDocumentsParams = {}): Promise<UnifiedDocument[]> {
    try {
      let query = supabase
        .from('unified_documents')
        .select(`
          id,
          tipo_documento,
          titulo_extraido,
          palavras_chave,
          autores,
          texto_completo,
          raw_text,
          data_upload,
          equipamento_id,
          equipamentos (nome),
          user_id,
          file_path,
          status_processamento,
          detalhes_erro,
          created_at,
          updated_at
        `);

      // Apply filters
      if (params.tipo_documento) {
        query = query.eq('tipo_documento', params.tipo_documento);
      }

      if (params.status_processamento) {
        query = query.eq('status_processamento', params.status_processamento);
      }

      if (params.search) {
        query = query.or(`titulo_extraido.ilike.%${params.search}%,texto_completo.ilike.%${params.search}%,palavras_chave.cs.{${params.search}},autores.cs.{${params.search}}`);
      }

      if (params.equipmentId) {
        query = query.eq('equipamento_id', params.equipmentId);
      }

      if (params.limit) {
        query = query.limit(params.limit);
      }

      if (params.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
      }

      query = query.order('data_upload', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(this.mapToUnifiedDocument) || [];
    } catch (error) {
      console.error('Error fetching unified documents:', error);
      throw error;
    }
  }

  async getDocumentById(id: string): Promise<UnifiedDocument | null> {
    try {
      const { data, error } = await supabase
        .from('unified_documents')
        .select(`
          id,
          tipo_documento,
          titulo_extraido,
          palavras_chave,
          autores,
          texto_completo,
          raw_text,
          data_upload,
          equipamento_id,
          equipamentos (nome),
          user_id,
          file_path,
          status_processamento,
          detalhes_erro,
          created_at,
          updated_at
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return data ? this.mapToUnifiedDocument(data) : null;
    } catch (error) {
      console.error('Error fetching document by ID:', error);
      throw error;
    }
  }

  async uploadDocument(file: File, tipo: DocumentTypeEnum, equipamentoId?: string): Promise<string> {
    try {
      // Get current user
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;

      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data: insertedDoc, error: insertError } = await supabase
        .from('unified_documents')
        .insert({
          tipo_documento: tipo,
          equipamento_id: equipamentoId || null,
          user_id: userId,
          file_path: filePath,
          status_processamento: 'pendente' as ProcessingStatusEnum,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return insertedDoc.id;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  async processDocument(documentId: string): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('process-document', {
        body: { 
          documentId,
          forceRefresh: true,
          timestamp: Date.now()
        }
      });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    }
  }

  async deleteDocument(id: string): Promise<boolean> {
    try {
      // Get document info first
      const document = await this.getDocumentById(id);
      if (!document) throw new Error('Documento não encontrado');

      // Delete from storage if file exists
      if (document.file_path) {
        await supabase.storage
          .from('documents')
          .remove([document.file_path]);
      }

      // Delete from database
      const { error } = await supabase
        .from('unified_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  private mapToUnifiedDocument(data: any): UnifiedDocument {
    return {
      id: data.id,
      tipo_documento: data.tipo_documento as DocumentTypeEnum,
      titulo_extraido: data.titulo_extraido || null,
      palavras_chave: data.palavras_chave || [],
      autores: data.autores || [],
      texto_completo: data.texto_completo || null,
      raw_text: data.raw_text || null,
      data_upload: data.data_upload,
      equipamento_id: data.equipamento_id || null,
      equipamento_nome: data.equipamentos?.nome || null,
      user_id: data.user_id || null,
      file_path: data.file_path || null,
      status_processamento: data.status_processamento as ProcessingStatusEnum,
      detalhes_erro: data.detalhes_erro || null,
      created_at: data.created_at,
      updated_at: data.updated_at,
      descricao: data.texto_completo?.substring(0, 200) || null,
    };
  }
}

export const unifiedDocumentService = new UnifiedDocumentServiceImpl();
