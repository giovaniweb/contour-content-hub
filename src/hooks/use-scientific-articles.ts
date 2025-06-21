import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedDocument, DocumentTypeEnum, ProcessingStatusEnum, GetDocumentsParams } from '@/types/document'; // Updated types
import { useToast } from '@/hooks/use-toast';

// Filters specific to scientific articles, extending generic document params
export interface ScientificArticleFilters extends GetDocumentsParams {
  // `tipo_documento` is implicitly 'artigo_cientifico'
  // `status_processamento` could be a filter e.g. 'concluido', 'falhou'
  palavras_chave?: string[]; // Use 'palavras_chave' from unified_documents
  autores?: string[];      // Use 'autores' from unified_documents
  dateRange?: {
    startDate?: string; // Format YYYY-MM-DD
    endDate?: string;   // Format YYYY-MM-DD
  };
  // TODO: Add semantic search capabilities in future
}

export const useScientificArticles = () => {
  // State will hold UnifiedDocument, but they are filtered to be articles
  const [articles, setArticles] = useState<UnifiedDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchScientificArticles = useCallback(async (filters?: ScientificArticleFilters) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('unified_documents') // Changed to new table
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
        .eq('tipo_documento', 'artigo_cientifico' as DocumentTypeEnum) // Always filter by type 'artigo_cientifico'
        // Default to 'concluido' status, but could be overridden by filters if needed
        .eq('status_processamento', 'concluido' as ProcessingStatusEnum);

      // Apply common document filters (search, equipmentId, limit, offset)
      if (filters) {
        if (filters.search) {
          // Search in title, extracted text, keywords, authors
          query = query.or(`titulo_extraido.ilike.%${filters.search}%,texto_completo.ilike.%${filters.search}%,palavras_chave.cs.{${filters.search}},autores.cs.{${filters.search}}`);
        }
        if (filters.equipmentId) {
          query = query.eq('equipamento_id', filters.equipmentId);
        }
        // Language filter might need a dedicated field in unified_documents or rely on AI extraction
        // if (filters.language) { ... }

        if (filters.limit) {
          query = query.limit(filters.limit);
        }
        if (filters.offset) {
          query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
        }

        // Apply specific ScientificArticleFilters
        if (filters.palavras_chave && filters.palavras_chave.length > 0) {
          query = query.cs('palavras_chave', filters.palavras_chave);
        }
        if (filters.autores && filters.autores.length > 0) {
           // Assuming 'autores' is an array of strings, use 'cs' (contains)
           // For partial matches on names, a more complex query or FTS might be needed
          query = query.cs('autores', filters.autores);
        }
        if (filters.dateRange) {
          if (filters.dateRange.startDate) {
            query = query.gte('data_upload', filters.dateRange.startDate); // Use data_upload or created_at
          }
          if (filters.dateRange.endDate) {
            const nextDay = new Date(filters.dateRange.endDate);
            nextDay.setDate(nextDay.getDate() + 1);
            query = query.lt('data_upload', nextDay.toISOString().split('T')[0]);
          }
        }
        // Allow filtering by processing status if passed in filters
        if (filters.status_processamento) {
            query = query.eq('status_processamento', filters.status_processamento as ProcessingStatusEnum)
        }
      }

      query = query.order('data_upload', { ascending: false });

      const { data, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      // Map data to UnifiedDocument type
      // The fields should align mostly, but ensure all are covered.
      const formattedArticles: UnifiedDocument[] = data.map(doc => ({
        id: doc.id,
        tipo_documento: doc.tipo_documento as DocumentTypeEnum,
        titulo_extraido: doc.titulo_extraido || 'Título não disponível',
        palavras_chave: doc.palavras_chave || [],
        autores: doc.autores || [],
        texto_completo: doc.texto_completo || '',
        raw_text: doc.raw_text || '',
        data_upload: doc.data_upload,
        equipamento_id: doc.equipamento_id || null,
        equipamento_nome: doc.equipamentos?.nome || '', // From joined table
        user_id: doc.user_id || null,
        file_path: doc.file_path || '',
        status_processamento: doc.status_processamento as ProcessingStatusEnum,
        detalhes_erro: doc.detalhes_erro || null,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        // Compatibility fields from TechnicalDocument if needed by UI, or UI adapts
        // For example, 'descricao' could map from 'texto_completo' if it's a summary
        descricao: doc.texto_completo?.substring(0, 200) || '', // Example mapping
        // 'arquivo_url' could be generated from 'file_path' if needed
        // pdfUrl: doc.file_path ? supabase.storage.from('documents').getPublicUrl(doc.file_path).data.publicUrl : '',
      }));

      setArticles(formattedArticles);

    } catch (err: any) {
      console.error('Error fetching scientific articles from unified_documents:', err);
      setError(err.message || 'Erro ao buscar artigos científicos.');
      toast({
        variant: "destructive",
        title: "Erro ao Buscar Artigos",
        description: err.message || 'Ocorreu um erro ao buscar os artigos científicos.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Placeholder for semantic search - would target unified_documents embeddings
  const fetchSemanticSearch = useCallback(async (queryText: string, limit: number = 10) => {
    setLoading(true);
    console.log(`Semantic search (unified_documents) for: "${queryText}" with limit ${limit}`);
    // Example:
    // const { data, error } = await supabase.functions.invoke('semantic-search-unified-documents', {
    //   body: { queryText, limit, documentType: 'artigo_cientifico' }
    // });
    // if (error) setError(error.message);
    // else setArticles(data); // Ensure 'data' is mapped to UnifiedDocument[]
    setLoading(false);
    return articles; // Return current articles or empty array
  }, [articles]);

  return {
    articles,
    loading,
    error,
    fetchScientificArticles,
    fetchSemanticSearch,
  };
};

// Ensure GetDocumentsParams is correctly defined or imported, now including status_processamento
// interface GetDocumentsParams {
//   search?: string;
//   equipmentId?: string;
//   language?: string; // Consider if this is still applicable or how it's derived
//   limit?: number;
//   offset?: number;
//   status_processamento?: ProcessingStatusEnum; // Added for filtering by status
//   // `type` is handled by the hook itself for scientific articles
// }
