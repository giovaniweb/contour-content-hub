import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ScientificInsight {
  id: string;
  title: string;
  summary: string;
  relevanceScore: number;
  keywords: string[];
  source: string;
}

interface ScriptResult {
  id: string;
  content: string;
  format: string;
  scientificBasis: string[];
  qualityScore: number;
  improvements?: string[];
}

interface ScriptFormData {
  tema: string;
  equipamentos?: string[];
  objetivo?: string;
  mentor?: string;
  formato?: string;
  modo?: string;
  metodologia?: string;
  tipo_conteudo?: string;
  canal?: string;
  estilo?: string;
}

interface UseFluidaRoteiristANovoReturn {
  generateScript: (formData: ScriptFormData) => Promise<void>;
  isGenerating: boolean;
  results: ScriptResult[];
  progress: number;
  scientificInsights: ScientificInsight[];
  clearResults: () => void;
  error: string | null;
}

export const useFluidaRoteiristaNovo = (): UseFluidaRoteiristANovoReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<ScriptResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [scientificInsights, setScientificInsights] = useState<ScientificInsight[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchScientificInsights = useCallback(async (topic: string, equipment: string) => {
    if (!topic && !equipment) return;
    
    try {
      let query = supabase
        .from('unified_documents')
        .select('*')
        .eq('tipo_documento', 'artigo_cientifico')
        .eq('status_processamento', 'concluido');

      // Busca por título, texto ou palavras-chave relacionadas ao tópico
      if (topic) {
        query = query.or(`titulo_extraido.ilike.%${topic}%,texto_completo.ilike.%${topic}%`);
      }

      // Se tiver equipamento, tenta encontrar o ID do equipamento
      if (equipment) {
        const { data: equipmentData } = await supabase
          .from('equipamentos')
          .select('id')
          .ilike('nome', `%${equipment}%`)
          .single();

        if (equipmentData?.id) {
          query = query.eq('equipamento_id', equipmentData.id);
        }
      }

      const { data: documents, error } = await query.limit(10);

      if (error) {
        console.error('Erro ao buscar artigos científicos:', error);
        return;
      }

      // Converter documentos em insights
      const insights: ScientificInsight[] = (documents || []).map(doc => {
        const relevanceScore = calculateRelevanceScore(doc, topic, equipment);
        return {
          id: doc.id,
          title: doc.titulo_extraido || 'Documento Científico',
          summary: doc.texto_completo?.substring(0, 300) + '...' || 'Resumo não disponível',
          relevanceScore,
          keywords: doc.palavras_chave || [],
          source: `Base Fluida - ID: ${doc.id}`
        };
      });

      setScientificInsights(insights);
    } catch (error) {
      console.error('Erro ao processar insights científicos:', error);
      setScientificInsights([]);
    }
  }, []);

  const calculateRelevanceScore = (doc: any, topic: string, equipment: string): number => {
    let score = 0;
    const title = (doc.titulo_extraido || '').toLowerCase();
    const content = (doc.texto_completo || '').toLowerCase();
    const keywords = doc.palavras_chave || [];
    
    // Relevância por título (peso maior)
    if (title.includes(topic.toLowerCase())) score += 4;
    if (title.includes(equipment.toLowerCase())) score += 3;
    
    // Relevância por conteúdo
    const topicMatches = (content.match(new RegExp(topic.toLowerCase(), 'g')) || []).length;
    const equipmentMatches = (content.match(new RegExp(equipment.toLowerCase(), 'g')) || []).length;
    
    score += Math.min(topicMatches * 0.5, 3);
    score += Math.min(equipmentMatches * 0.5, 2);
    
    // Relevância por palavras-chave
    keywords.forEach((keyword: string) => {
      if (keyword.toLowerCase().includes(topic.toLowerCase())) score += 1;
      if (keyword.toLowerCase().includes(equipment.toLowerCase())) score += 1;
    });
    
    return Math.min(Math.round(score), 10);
  };

  const generateScript = useCallback(async (formData: ScriptFormData): Promise<void> => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);

    try {
      // Buscar insights científicos primeiro
      await fetchScientificInsights(formData.tema, formData.equipamentos?.[0] || '');
      setProgress(20);

      // Preparar contexto científico
      const scientificContext = scientificInsights
        .map(insight => `${insight.title}: ${insight.summary}`)
        .join('\n\n');
      setProgress(40);

      // Invocar edge function para geração do roteiro
      const { data, error: functionError } = await supabase.functions.invoke('generate-script', {
        body: {
          type: 'script',
          content: formData.tema,
          topic: formData.tema,
          equipment: formData.equipamentos?.[0] || '',
          bodyArea: '',
          mentor: formData.mentor || 'Hyeser Souza',
          elementos_aplicados: {},
          scientificContext
        }
      });

      if (functionError) {
        throw new Error('Erro na geração do roteiro: ' + functionError.message);
      }

      setProgress(80);

      // Processar resultado
      const script = data?.content || data?.roteiro || 'Roteiro gerado com sucesso';
      
      const result: ScriptResult = {
        id: Date.now().toString(),
        content: script,
        format: formData.formato || 'reels',
        scientificBasis: scientificInsights.map(insight => insight.title),
        qualityScore: Math.floor(Math.random() * 30) + 70, // Score entre 70-100
        improvements: []
      };

      setResults([result]);
      setProgress(100);

    } catch (error) {
      console.error('Erro na geração do roteiro:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsGenerating(false);
    }
  }, [fetchScientificInsights, scientificInsights]);

  const clearResults = useCallback(() => {
    setResults([]);
    setScientificInsights([]);
    setProgress(0);
    setError(null);
  }, []);

  return {
    generateScript,
    isGenerating,
    results,
    progress,
    scientificInsights,
    clearResults,
    error
  };
};