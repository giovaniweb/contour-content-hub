
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GetDocumentsParams, TechnicalDocument, DocumentType, ProcessingStatusEnum } from '@/types/document';
import { useToast } from '@/hooks/use-toast';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<TechnicalDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Otimizamos a função fetchDocuments para evitar renderizações desnecessárias
  const fetchDocuments = useCallback(async (params?: GetDocumentsParams) => {
    try {
      setLoading(true);
      setError(null);
      
      // Start building query
      let query = supabase
        .from('documentos_tecnicos')
        .select(`
          *,
          equipamentos(nome)
        `)
        .eq('status', 'ativo');
      
      // Apply filters if provided
      if (params) {
        if (params.type || params.tipo_documento) {
          query = query.eq('tipo', params.type || params.tipo_documento);
        }
        
        if (params.equipmentId) {
          query = query.eq('equipamento_id', params.equipmentId);
        }
        
        if (params.language) {
          if (params.language === 'original') {
            // No filter, show all original languages
          } else {
            // Filter by specific language, either original or translated
            query = query.or(`idioma_original.eq.${params.language},idiomas_traduzidos.cs.{${params.language}}`);
          }
        }
        
        if (params.search) {
          query = query.or(`titulo.ilike.%${params.search}%,descricao.ilike.%${params.search}%`);
        }
        
        // Pagination
        if (params.limit) {
          query = query.limit(params.limit);
        }
        
        if (params.offset) {
          query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
        }
      }
      
      // Execute query
      const { data, error } = await query.order('data_criacao', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform data to match TechnicalDocument type
      const formattedDocuments: TechnicalDocument[] = data.map(doc => {
        // Use type assertion to access all properties
        const documentData = {
          id: doc.id,
          titulo: doc.titulo,
          descricao: doc.descricao || '',
          tipo: doc.tipo as DocumentType,
          status: doc.status as ProcessingStatusEnum,
          equipamento_id: doc.equipamento_id || '',
          equipamento_nome: doc.equipamentos?.nome || '',
          idioma_original: doc.idioma_original || '',
          idiomas_traduzidos: [] as string[],
          criado_por: doc.criado_por || '',
          data_criacao: doc.data_criacao || '',
          conteudo_extraido: doc.conteudo_extraido || '',
          link_dropbox: doc.link_dropbox || '',
          preview_url: (doc as any).preview_url || '' // Using type assertion for preview_url
        };
        
        // Handle idiomas_traduzidos if it exists in the database record
        if ('idiomas_traduzidos' in doc && doc.idiomas_traduzidos) {
          documentData.idiomas_traduzidos = doc.idiomas_traduzidos as string[];
        }

        return documentData;
      });
      
      setDocuments(formattedDocuments);
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err.message || 'Erro ao buscar documentos');
      toast({
        variant: "destructive",
        title: "Erro ao buscar documentos",
        description: err.message || 'Ocorreu um erro ao buscar os documentos.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getDocumentById = useCallback(async (id: string): Promise<TechnicalDocument | null> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('documentos_tecnicos')
        .select(`
          *,
          equipamentos(nome)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      // Create a properly typed document with all required fields
      const formattedDocument: TechnicalDocument = {
        id: data.id,
        titulo: data.titulo,
        descricao: data.descricao || '',
        tipo: data.tipo as DocumentType,
        equipamento_id: data.equipamento_id || '',
        equipamento_nome: data.equipamentos?.nome || '',
        link_dropbox: data.link_dropbox || '',
        idioma_original: data.idioma_original || '',
        idiomas_traduzidos: [] as string[],
        status: data.status as ProcessingStatusEnum,
        criado_por: data.criado_por || '',
        data_criacao: data.data_criacao || '',
        conteudo_extraido: data.conteudo_extraido || '',
        preview_url: (data as any).preview_url || ''  // Using type assertion for preview_url
      };
      
      // Add idiomas_traduzidos if it exists in the database record
      if ('idiomas_traduzidos' in data && data.idiomas_traduzidos) {
        formattedDocument.idiomas_traduzidos = data.idiomas_traduzidos as string[];
      }

      return formattedDocument;
    } catch (err: any) {
      console.error('Error fetching document:', err);
      setError(err.message || 'Erro ao buscar o documento');
      toast({
        variant: "destructive",
        title: "Erro ao buscar documento",
        description: err.message || 'Ocorreu um erro ao buscar o documento.',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    getDocumentById
  };
};
