
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TechnicalDocument, DocumentType, DocumentStatus, GetDocumentsParams } from '@/types/document';
import { useToast } from '@/hooks/use-toast';

export interface ScientificArticleFilters extends GetDocumentsParams {
  keywords?: string[];
  researchers?: string[];
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
}

export const useScientificArticles = () => {
  const [articles, setArticles] = useState<TechnicalDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchScientificArticles = useCallback(async (filters?: ScientificArticleFilters) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('documentos_tecnicos')
        .select(`
          *,
          equipamentos(nome)
        `)
        .eq('tipo', 'artigo_cientifico' as DocumentType)
        .eq('status', 'ativo' as DocumentStatus);

      if (filters) {
        if (filters.search) {
          query = query.or(`titulo.ilike.%${filters.search}%,descricao.ilike.%${filters.search}%,conteudo_extraido.ilike.%${filters.search}%`);
        }
        if (filters.equipmentId) {
          query = query.eq('equipamento_id', filters.equipmentId);
        }
        if (filters.language) {
          // Simplified language filter using only original language
          query = query.eq('idioma_original', filters.language);
        }
        if (filters.limit) {
          query = query.limit(filters.limit);
        }
        if (filters.offset) {
          query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
        }

        // Simplified filters for keywords and researchers using basic text search
        if (filters.keywords && filters.keywords.length > 0) {
          const keywordSearch = filters.keywords.map(k => `keywords.cs.{${k}}`).join(',');
          query = query.or(keywordSearch);
        }
        if (filters.researchers && filters.researchers.length > 0) {
          const researcherSearch = filters.researchers.map(r => `researchers.cs.{${r}}`).join(',');
          query = query.or(researcherSearch);
        }
        if (filters.dateRange) {
          if (filters.dateRange.startDate) {
            query = query.gte('data_criacao', filters.dateRange.startDate);
          }
          if (filters.dateRange.endDate) {
            const nextDay = new Date(filters.dateRange.endDate);
            nextDay.setDate(nextDay.getDate() + 1);
            query = query.lt('data_criacao', nextDay.toISOString().split('T')[0]);
          }
        }
      }

      query = query.order('data_criacao', { ascending: false });

      const { data, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      const formattedArticles: TechnicalDocument[] = data.map(doc => ({
        id: doc.id,
        titulo: doc.titulo,
        descricao: doc.descricao || '',
        tipo: doc.tipo as DocumentType,
        status: doc.status as DocumentStatus,
        equipamento_id: doc.equipamento_id || null,
        equipamento_nome: doc.equipamentos?.nome || '',
        link_dropbox: doc.link_dropbox || '',
        arquivo_url: doc.arquivo_url || '',
        idioma_original: doc.idioma_original || '',
        idiomas_traduzidos: [], // Default empty array since column doesn't exist yet
        keywords: doc.keywords || [],
        researchers: doc.researchers || [],
        conteudo_extraido: doc.conteudo_extraido || '',
        criado_por: doc.criado_por || '',
        data_criacao: doc.data_criacao || '',
        preview_url: '', // Default empty string since column doesn't exist yet
        vetor_embeddings: doc.vetor_embeddings || null,
      }));

      setArticles(formattedArticles);

    } catch (err: any) {
      console.error('Error fetching scientific articles:', err);
      setError(err.message || 'Erro ao buscar artigos científicos');
      toast({
        variant: "destructive",
        title: "Erro ao buscar artigos",
        description: err.message || 'Ocorreu um erro ao buscar os artigos científicos.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchSemanticSearch = useCallback(async (queryText: string, limit: number = 10) => {
    setLoading(true);
    console.log(`Busca semântica por: "${queryText}" com limite ${limit}`);
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
