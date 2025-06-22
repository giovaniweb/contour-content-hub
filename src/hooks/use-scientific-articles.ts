
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedDocument, DocumentTypeEnum, ProcessingStatusEnum, GetDocumentsParams } from '@/types/document';
import { useToast } from '@/hooks/use-toast';

export interface ScientificArticleFilters extends GetDocumentsParams {
  palavras_chave?: string[];
  autores?: string[];
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
}

export const useScientificArticles = () => {
  const [articles, setArticles] = useState<UnifiedDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchScientificArticles = useCallback(async (filters?: ScientificArticleFilters) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching scientific articles with filters:', filters);

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

      // Apply common document filters
      if (filters) {
        if (filters.search) {
          query = query.or(`titulo_extraido.ilike.%${filters.search}%,texto_completo.ilike.%${filters.search}%`);
        }
        if (filters.equipmentId) {
          query = query.eq('equipamento_id', filters.equipmentId);
        }
        if (filters.limit) {
          query = query.limit(filters.limit);
        }
        if (filters.offset) {
          query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
        }

        // Apply specific ScientificArticleFilters
        if (filters.palavras_chave && filters.palavras_chave.length > 0) {
          const keywordConditions = filters.palavras_chave.map(keyword => 
            `palavras_chave.cs.{${keyword}}`
          ).join(',');
          query = query.or(keywordConditions);
        }
        if (filters.autores && filters.autores.length > 0) {
          const authorConditions = filters.autores.map(author => 
            `autores.cs.{${author}}`
          ).join(',');
          query = query.or(authorConditions);
        }
        if (filters.dateRange) {
          if (filters.dateRange.startDate) {
            query = query.gte('data_upload', filters.dateRange.startDate);
          }
          if (filters.dateRange.endDate) {
            const nextDay = new Date(filters.dateRange.endDate);
            nextDay.setDate(nextDay.getDate() + 1);
            query = query.lt('data_upload', nextDay.toISOString().split('T')[0]);
          }
        }
        if (filters.status_processamento) {
          query = query.eq('status_processamento', filters.status_processamento as ProcessingStatusEnum);
        }
      }

      // Order by upload date
      query = query.order('data_upload', { ascending: false });

      const { data, error: queryError } = await query;

      if (queryError) {
        console.error('Query error:', queryError);
        throw queryError;
      }

      console.log('Raw data from query:', data);

      const formattedArticles: UnifiedDocument[] = (data || []).map(doc => ({
        id: doc.id,
        tipo_documento: doc.tipo_documento as DocumentTypeEnum,
        titulo_extraido: doc.titulo_extraido || 'Título não disponível',
        palavras_chave: doc.palavras_chave || [],
        autores: doc.autores || [],
        texto_completo: doc.texto_completo || '',
        raw_text: doc.raw_text || '',
        data_upload: doc.data_upload,
        equipamento_id: doc.equipamento_id || null,
        equipamento_nome: doc.equipamentos?.nome || '',
        user_id: doc.user_id || null,
        file_path: doc.file_path || '',
        status_processamento: doc.status_processamento as ProcessingStatusEnum,
        detalhes_erro: doc.detalhes_erro || null,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        descricao: doc.texto_completo?.substring(0, 200) || '',
      }));

      console.log('Formatted articles:', formattedArticles);
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

  const fetchSemanticSearch = useCallback(async (queryText: string, limit: number = 10) => {
    setLoading(true);
    console.log(`Semantic search (unified_documents) for: "${queryText}" with limit ${limit}`);
    setLoading(false);
    return articles;
  }, [articles]);

  return {
    articles,
    loading,
    error,
    fetchScientificArticles,
    fetchSemanticSearch,
  };
};
