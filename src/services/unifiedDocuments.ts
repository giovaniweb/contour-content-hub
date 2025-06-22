
import { supabase } from '@/integrations/supabase/client';
import { UnifiedDocument, DocumentTypeEnum, GetDocumentsParams, ProcessingStatusEnum } from '@/types/document';
import { safeQueryResult, safeSingleResult } from '@/utils/validation/supabaseHelpers';

interface UnifiedDocumentWithEquipment extends UnifiedDocument {
  equipamentos?: {
    id: string;
    nome: string;
  } | null;
}

export class UnifiedDocumentService {
  async fetchDocuments(params?: GetDocumentsParams): Promise<UnifiedDocumentWithEquipment[]> {
    try {
      let query = supabase
        .from('unified_documents')
        .select(`
          *,
          equipamentos!equipamento_id(id, nome)
        `)
        .order('created_at', { ascending: false });

      if (params?.tipo_documento) {
        query = query.eq('tipo_documento', params.tipo_documento);
      }

      if (params?.equipmentId) {
        query = query.eq('equipamento_id', params.equipmentId);
      }

      if (params?.status_processamento) {
        query = query.eq('status_processamento', params.status_processamento);
      }

      if (params?.search) {
        query = query.or(`titulo_extraido.ilike.%${params.search}%,texto_completo.ilike.%${params.search}%`);
      }

      const response = await query;

      if (response.error) {
        console.error('Error fetching documents:', response.error);
        throw response.error;
      }

      return safeQueryResult<UnifiedDocumentWithEquipment>(response) || [];
    } catch (error) {
      console.error('Error in fetchDocuments:', error);
      throw error;
    }
  }

  async getDocumentById(id: string): Promise<UnifiedDocumentWithEquipment> {
    try {
      const response = await supabase
        .from('unified_documents')
        .select(`
          *,
          equipamentos!equipamento_id(id, nome)
        `)
        .eq('id', id)
        .single();

      if (response.error) {
        console.error('Error fetching document by ID:', response.error);
        throw response.error;
      }

      const result = safeSingleResult<UnifiedDocumentWithEquipment>(response);
      if (!result) {
        throw new Error('Document not found');
      }

      return result;
    } catch (error) {
      console.error('Error in getDocumentById:', error);
      throw error;
    }
  }

  async deleteDocument(id: string): Promise<boolean> {
    try {
      // First get the document to check file path
      const { data: document, error: fetchError } = await supabase
        .from('unified_documents')
        .select('file_path')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching document for deletion:', fetchError);
        throw fetchError;
      }

      // Delete file from storage if exists
      if (document?.file_path) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([document.file_path]);

        if (storageError) {
          console.warn('Error deleting file from storage:', storageError);
          // Continue with document deletion even if file deletion fails
        }
      }

      // Delete document record
      const { error: deleteError } = await supabase
        .from('unified_documents')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting document:', deleteError);
        throw deleteError;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteDocument:', error);
      throw error;
    }
  }

  async processDocument(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('process-document', {
        body: { 
          documentId: id,
          forceRefresh: true
        }
      });

      if (error) {
        console.error('Error processing document:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in processDocument:', error);
      throw error;
    }
  }

  async createDocument(documentData: Partial<UnifiedDocument>): Promise<UnifiedDocument> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('Usuário não autenticado');
      }

      const response = await supabase
        .from('unified_documents')
        .insert({
          tipo_documento: documentData.tipo_documento as DocumentTypeEnum,
          titulo_extraido: documentData.titulo_extraido,
          texto_completo: documentData.texto_completo,
          equipamento_id: documentData.equipamento_id,
          file_path: documentData.file_path,
          palavras_chave: documentData.palavras_chave,
          autores: documentData.autores,
          user_id: userData.user.id,
          status_processamento: 'pendente' as ProcessingStatusEnum
        })
        .select()
        .single();

      if (response.error) {
        console.error('Error creating document:', response.error);
        throw response.error;
      }

      const result = safeSingleResult<UnifiedDocument>(response);
      if (!result) {
        throw new Error('Failed to create document');
      }

      return result;
    } catch (error) {
      console.error('Error in createDocument:', error);
      throw error;
    }
  }

  async updateDocument(id: string, updates: Partial<UnifiedDocument>): Promise<UnifiedDocument> {
    try {
      const response = await supabase
        .from('unified_documents')
        .update({
          titulo_extraido: updates.titulo_extraido,
          texto_completo: updates.texto_completo,
          equipamento_id: updates.equipamento_id,
          palavras_chave: updates.palavras_chave,
          autores: updates.autores,
          status_processamento: updates.status_processamento as ProcessingStatusEnum
        })
        .eq('id', id)
        .select()
        .single();

      if (response.error) {
        console.error('Error updating document:', response.error);
        throw response.error;
      }

      const result = safeSingleResult<UnifiedDocument>(response);
      if (!result) {
        throw new Error('Failed to update document');
      }

      return result;
    } catch (error) {
      console.error('Error in updateDocument:', error);
      throw error;
    }
  }
}

export const unifiedDocumentService = new UnifiedDocumentService();
