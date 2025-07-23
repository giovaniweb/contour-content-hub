import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ScriptFormData {
  topic: string;
  format: string;
  objective: string;
  style: string;
  equipment?: string;
  additionalInfo?: string;
}

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

  const fetchScientificInsights = useCallback(async (topic: string, equipment?: string): Promise<ScientificInsight[]> => {
    try {
      // Buscar artigos científicos relacionados ao tópico e equipamento
      let query = supabase
        .from('unified_documents')
        .select('id, titulo_extraido, palavras_chave, autores, texto_completo')
        .eq('status_processamento', 'concluido')
        .limit(5);

      // Filtrar por equipamento se fornecido
      if (equipment) {
        const { data: equipmentData } = await supabase
          .from('equipamentos')
          .select('id')
          .eq('nome', equipment)
          .single();

        if (equipmentData?.id) {
          query = query.eq('equipamento_id', equipmentData.id);
        }
      }

      const { data: documents, error } = await query;

      if (error) {
        console.error('Erro ao buscar artigos científicos:', error);
        return [];
      }

      // Converter documentos em insights
      const insights: ScientificInsight[] = (documents || []).map(doc => ({
        id: doc.id,
        title: doc.titulo_extraido || 'Documento Científico',
        summary: doc.texto_completo?.substring(0, 200) + '...' || 'Resumo não disponível',
        relevanceScore: Math.random() * 100, // TODO: Implementar score real baseado em similaridade
        keywords: doc.palavras_chave || [],
        source: doc.autores?.join(', ') || 'Autor não informado'
      }));

      return insights;
    } catch (error) {
      console.error('Erro ao processar insights científicos:', error);
      return [];
    }
  }, []);

  const generateScript = useCallback(async (formData: ScriptFormData): Promise<void> => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);

    try {
      // Etapa 1: Buscar insights científicos (20%)
      setProgress(20);
      const insights = await fetchScientificInsights(formData.topic, formData.equipment);
      setScientificInsights(insights);

      // Etapa 2: Preparar contexto científico (40%)
      setProgress(40);
      const scientificContext = insights
        .map(insight => `${insight.title}: ${insight.summary}`)
        .join('\n\n');

      // Etapa 3: Gerar roteiro com IA (70%)
      setProgress(70);
      
      // Preparar prompt enriquecido com base científica
      const enrichedPrompt = `
        CONTEXTO CIENTÍFICO:
        ${scientificContext}

        SOLICITAÇÃO:
        Tópico: ${formData.topic}
        Formato: ${formData.format}
        Objetivo: ${formData.objective}
        Estilo: ${formData.style}
        ${formData.equipment ? `Equipamento: ${formData.equipment}` : ''}
        ${formData.additionalInfo ? `Informações Adicionais: ${formData.additionalInfo}` : ''}

        INSTRUÇÕES:
        1. Use as informações científicas fornecidas para fundamentar o roteiro
        2. Cite evidências científicas quando relevante
        3. Mantenha a linguagem adequada ao estilo solicitado
        4. Estruture o conteúdo conforme o formato escolhido
        5. Integre naturalmente as informações técnicas
      `;

      const response = await fetch('/api/generate-script-enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          type: 'fluidaroteirista_enhanced',
          prompt: enrichedPrompt,
          formData,
          scientificContext: insights
        })
      });

      if (!response.ok) {
        throw new Error('Falha na geração do roteiro');
      }

      const result = await response.json();

      // Etapa 4: Processar resultado (90%)
      setProgress(90);

      // Processar e limpar o conteúdo do roteiro
      const processContent = (data: any): string => {
        if (typeof data === 'string') {
          try {
            // Tentar parsear se for JSON string
            const parsed = JSON.parse(data);
            return parsed.roteiro || parsed.content || data;
          } catch {
            // Se não for JSON, retornar como string limpa
            return data;
          }
        }
        
        if (data && typeof data === 'object') {
          // Se for objeto, extrair o roteiro
          return data.roteiro || data.content || JSON.stringify(data, null, 2);
        }
        
        return 'Roteiro gerado com sucesso';
      };

      const cleanContent = processContent(result);

      const scriptResult: ScriptResult = {
        id: Date.now().toString(),
        content: cleanContent,
        format: formData.format,
        scientificBasis: insights.map(i => i.title),
        qualityScore: Math.min(95, 60 + insights.length * 5), // Score baseado em insights científicos
        improvements: result.improvements || []
      };

      setResults([scriptResult]);
      
      // Finalizar (100%)
      setProgress(100);

    } catch (error) {
      console.error('Erro na geração do roteiro:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsGenerating(false);
    }
  }, [fetchScientificInsights]);

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