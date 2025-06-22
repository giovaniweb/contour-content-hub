
import { useState, useCallback } from 'react';
import { UnifiedDocument, GetDocumentsParams } from '@/types/document';
import { unifiedDocumentService } from '@/services/unifiedDocuments';

export const useScientificArticles = () => {
  const [articles, setArticles] = useState<UnifiedDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScientificArticles = useCallback(async (params?: GetDocumentsParams) => {
    try {
      setLoading(true);
      setError(null);
      
      // Always filter for scientific articles
      const searchParams = {
        ...params,
        tipo_documento: 'artigo_cientifico' as const
      };
      
      const data = await unifiedDocumentService.fetchDocuments(searchParams);
      setArticles(data);
    } catch (err: any) {
      console.error('Error fetching scientific articles:', err);
      setError(err.message || 'Erro ao carregar artigos científicos');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getArticleById = useCallback(async (id: string) => {
    try {
      const article = await unifiedDocumentService.getDocumentById(id);
      return article;
    } catch (err: any) {
      console.error('Error fetching article by ID:', err);
      throw err;
    }
  }, []);

  const deleteArticle = useCallback(async (id: string) => {
    try {
      await unifiedDocumentService.deleteDocument(id);
      // Remove from local state
      setArticles(prev => prev.filter(article => article.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error deleting article:', err);
      throw err;
    }
  }, []);

  const processArticle = useCallback(async (id: string) => {
    try {
      await unifiedDocumentService.processDocument(id);
      // Refresh the article data
      await fetchScientificArticles();
      return true;
    } catch (err: any) {
      console.error('Error processing article:', err);
      throw err;
    }
  }, [fetchScientificArticles]);

  return {
    articles,
    loading,
    error,
    fetchScientificArticles,
    getArticleById,
    deleteArticle,
    processArticle
  };
};
