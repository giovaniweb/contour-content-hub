import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TechnicalDocument, DocumentType, DocumentStatus, GetDocumentsParams } from '@/types/document'; // Supondo que GetDocumentsParams esteja em types/document
import { useToast } from '@/hooks/use-toast';

// Definir uma interface para os filtros específicos de artigos científicos
export interface ScientificArticleFilters extends GetDocumentsParams {
  keywords?: string[]; // Array de keywords para filtrar
  researchers?: string[]; // Array de pesquisadores para filtrar
  dateRange?: { // Intervalo de datas de publicação
    startDate?: string; // Formato YYYY-MM-DD
    endDate?: string;   // Formato YYYY-MM-DD
  };
  // Adicionar aqui futuramente: busca semântica, etc.
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
        .eq('tipo', 'artigo_cientifico' as DocumentType) // Sempre filtra por tipo 'artigo_cientifico'
        .eq('status', 'ativo' as DocumentStatus);       // Sempre filtra por status 'ativo'

      // Aplicar filtros básicos de GetDocumentsParams (search, equipmentId, language, limit, offset)
      if (filters) {
        if (filters.search) {
          query = query.or(`titulo.ilike.%${filters.search}%,descricao.ilike.%${filters.search}%,conteudo_extraido.ilike.%${filters.search}%`);
        }
        if (filters.equipmentId) {
          query = query.eq('equipamento_id', filters.equipmentId);
        }
        if (filters.language) {
          // Assumindo que 'idiomas_traduzidos' é um array de strings no DB
          query = query.or(`idioma_original.eq.${filters.language},idiomas_traduzidos.cs.{${filters.language}}`);
        }
        if (filters.limit) {
          query = query.limit(filters.limit);
        }
        if (filters.offset) {
          query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
        }

        // Aplicar filtros específicos de ScientificArticleFilters
        if (filters.keywords && filters.keywords.length > 0) {
          // Filtrar se o array 'keywords' no DB contém todos os keywords fornecidos
          query = query.cs('keywords', filters.keywords);
        }
        if (filters.researchers && filters.researchers.length > 0) {
          // Para pesquisadores, podemos fazer uma busca 'ilike' em um campo de texto que concatena os pesquisadores
          // ou se 'researchers' for um array no DB, usar 'cs' (contém) ou 'ov' (sobrepõe)
          // Por simplicidade, vamos assumir que 'researchers' é um array de strings e usamos 'cs'
           filters.researchers.forEach(researcher => {
            query = query.filter('researchers', 'cs', `{${researcher}}`);
          });
          // Alternativa para pesquisadores (se for um campo de texto simples com nomes separados por vírgula):
          // filters.researchers.forEach(researcher => {
          //   query = query.ilike('researchers_text_field', `%${researcher}%`);
          // });
        }
        if (filters.dateRange) {
          if (filters.dateRange.startDate) {
            query = query.gte('data_criacao', filters.dateRange.startDate);
          }
          if (filters.dateRange.endDate) {
            // Adicionar 1 dia ao endDate para incluir todo o dia
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
        idiomas_traduzidos: doc.idiomas_traduzidos || [],
        keywords: doc.keywords || [],
        researchers: doc.researchers || [],
        conteudo_extraido: doc.conteudo_extraido || '',
        criado_por: doc.criado_por || '',
        data_criacao: doc.data_criacao || '',
        preview_url: doc.preview_url || '',
        vetor_embeddings: doc.vetor_embeddings || null, // Incluindo vetor_embeddings
        // Adicionar outros campos conforme a definição em types/document.ts
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

  // Função para busca semântica (placeholder)
  const fetchSemanticSearch = useCallback(async (queryText: string, limit: number = 10) => {
    setLoading(true);
    // Lógica de busca semântica (ex: chamar uma Supabase Edge Function que usa embeddings)
    console.log(`Busca semântica por: "${queryText}" com limite ${limit}`);
    // Exemplo:
    // const { data, error } = await supabase.functions.invoke('semantic-search-articles', {
    //   body: { queryText, limit }
    // });
    // if (error) setError(error.message);
    // else setArticles(data);
    setLoading(false);
    // Retornar um array vazio por enquanto ou os artigos atuais para não quebrar a UI
    return articles;
  }, [articles]);

  // Lógica de cache inteligente (placeholder)
  // Poderia usar localStorage ou sessionStorage para guardar resultados recentes
  // e retornar dados cacheados se os filtros forem os mesmos em um curto período.

  return {
    articles,
    loading,
    error,
    fetchScientificArticles,
    fetchSemanticSearch, // Expor a função de busca semântica
  };
};

// Assegure-se que a interface GetDocumentsParams está definida ou importada corretamente.
// Se não estiver em '@/types/document', pode ser necessário defini-la aqui ou ajustar o import.
// Exemplo de GetDocumentsParams se não existir:
// interface GetDocumentsParams {
//   type?: DocumentType;
//   equipmentId?: string;
//   language?: string;
//   search?: string;
//   limit?: number;
//   offset?: number;
// }
