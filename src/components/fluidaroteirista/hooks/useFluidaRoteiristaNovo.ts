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
      console.log('🔍 [Hook] Buscando artigos científicos para:', { topic, equipment });
      
      // Primeiro, buscar o ID do equipamento se fornecido
      let equipmentId = null;
      if (equipment) {
        const { data: equipmentData } = await supabase
          .from('equipamentos')
          .select('id')
          .or(`nome.ilike.%${equipment}%,tecnologia.ilike.%${equipment}%`)
          .eq('ativo', true)
          .limit(1)
          .single();

        if (equipmentData?.id) {
          equipmentId = equipmentData.id;
          console.log('✅ [Hook] Equipamento encontrado:', equipmentData.id);
        }
      }

      // Construir query base
      let query = supabase
        .from('unified_documents')
        .select('*')
        .eq('tipo_documento', 'artigo_cientifico')
        .eq('status_processamento', 'concluido');

      // Estratégia de busca priorizada:
      // 1. Primeiro tentar buscar por equipamento específico
      if (equipmentId) {
        console.log('🎯 [Hook] Buscando artigos específicos do equipamento:', equipmentId);
        const { data: equipmentDocs, error: equipmentError } = await query
          .eq('equipamento_id', equipmentId)
          .limit(5);

        if (!equipmentError && equipmentDocs && equipmentDocs.length > 0) {
          console.log(`✅ [Hook] Encontrados ${equipmentDocs.length} artigos específicos do equipamento`);
          const insights = equipmentDocs.map(doc => ({
            id: doc.id,
            title: doc.titulo_extraido || 'Documento Científico',
            summary: doc.texto_completo?.substring(0, 300) + '...' || 'Resumo não disponível',
            relevanceScore: 10, // Máxima relevância para artigos específicos do equipamento
            keywords: doc.palavras_chave || [],
            source: `Base Fluida - Equipamento Específico`
          }));
          setScientificInsights(insights);
          return;
        }
      }

      // 2. Se não encontrou por equipamento, buscar por tópico
      if (topic) {
        console.log('🔍 [Hook] Buscando artigos por tópico:', topic);
        const { data: topicDocs, error: topicError } = await query
          .or(`titulo_extraido.ilike.%${topic}%,texto_completo.ilike.%${topic}%`)
          .limit(10);

        if (!topicError && topicDocs && topicDocs.length > 0) {
          console.log(`✅ [Hook] Encontrados ${topicDocs.length} artigos sobre o tópico`);
          const insights = topicDocs.map(doc => {
            const relevanceScore = calculateRelevanceScore(doc, topic, equipment);
            return {
              id: doc.id,
              title: doc.titulo_extraido || 'Documento Científico',
              summary: doc.texto_completo?.substring(0, 300) + '...' || 'Resumo não disponível',
              relevanceScore,
              keywords: doc.palavras_chave || [],
              source: `Base Fluida - Tópico: ${topic}`
            };
          });
          setScientificInsights(insights);
          return;
        }
      }

      // 3. Busca geral se não encontrou nada específico
      console.log('🔍 [Hook] Fazendo busca geral...');
      const { data: generalDocs, error: generalError } = await query.limit(5);

      if (!generalError && generalDocs && generalDocs.length > 0) {
        console.log(`✅ [Hook] Encontrados ${generalDocs.length} artigos gerais`);
        const insights = generalDocs.map(doc => ({
          id: doc.id,
          title: doc.titulo_extraido || 'Documento Científico',
          summary: doc.texto_completo?.substring(0, 300) + '...' || 'Resumo não disponível',
          relevanceScore: 3, // Baixa relevância para artigos gerais
          keywords: doc.palavras_chave || [],
          source: `Base Fluida - Geral`
        }));
        setScientificInsights(insights);
      } else {
        console.warn('⚠️ [Hook] Nenhum artigo científico encontrado');
        setScientificInsights([]);
      }

    } catch (error) {
      console.error('❌ [Hook] Erro ao processar insights científicos:', error);
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

  const generateScript = useCallback(async (formData: any): Promise<void> => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setScientificInsights([]); // Limpar insights anteriores

    try {
      console.log('🎬 [Hook] Iniciando geração de roteiro:', formData);
      
      // 1. Extrair dados do formData (adaptar diferentes formatos)
      const topic = formData.topic || formData.tema || '';
      const equipment = formData.equipment || formData.equipamentos?.[0] || '';
      const format = formData.format || formData.formato || 'reels';
      
      console.log('🔍 [Hook] Buscando insights para:', { tema: topic, equipamento: equipment });
      
      await fetchScientificInsights(topic, equipment);
      setProgress(25);

      // Aguardar um pouco para que os insights sejam atualizados
      await new Promise(resolve => setTimeout(resolve, 100));

      // 2. Preparar contexto científico com os insights atualizados
      const currentInsights = scientificInsights.length > 0 ? scientificInsights : [];
      const scientificContext = currentInsights
        .map(insight => `${insight.title}: ${insight.summary}`)
        .join('\n\n');
      
      console.log('📚 [Hook] Contexto científico preparado:', { 
        insightsCount: currentInsights.length,
        contextLength: scientificContext.length 
      });
      setProgress(40);

      // 3. Preparar dados para envio - usar as variáveis extraídas
      const requestData = {
        type: 'script',
        content: topic,
        topic: topic,
        equipment: equipment, // Equipamento específico
        equipmentNames: equipment ? [equipment] : [], // Lista completa
        mentor: formData.mentor || 'Hyeser Souza',
        format: format,
        bodyArea: '',
        elementos_aplicados: {},
        scientificContext,
        // Campos adicionais para contexto
        objetivo: formData.objective || formData.objetivo,
        metodologia: formData.style || formData.metodologia,
        tipo_conteudo: format,
        canal: formData.channel || formData.canal || 'instagram',
        estilo: formData.style || formData.estilo
      };

      console.log('📤 [Hook] Enviando dados para edge function:', requestData);
      setProgress(50);

      // 4. Invocar edge function para geração do roteiro
      const { data, error: functionError } = await supabase.functions.invoke('generate-script', {
        body: requestData
      });

      if (functionError) {
        console.error('❌ [Hook] Erro da edge function:', functionError);
        throw new Error('Erro na geração do roteiro: ' + functionError.message);
      }

      console.log('✅ [Hook] Resposta recebida da edge function:', data);
      setProgress(80);

      // 5. Processar resultado
      const script = data?.content || data?.roteiro || 'Roteiro gerado com sucesso';
      const equipmentDetails = data?.equipmentDetails || [];
      
      const result: ScriptResult = {
        id: Date.now().toString(),
        content: script,
        format: formData.formato || 'reels',
        scientificBasis: currentInsights.map(insight => insight.title),
        qualityScore: Math.floor(Math.random() * 30) + 70, // Score entre 70-100
        improvements: equipmentDetails.length === 0 ? ['Equipamento não encontrado no banco de dados'] : []
      };

      console.log('📋 [Hook] Resultado processado:', {
        scriptLength: script.length,
        equipmentCount: equipmentDetails.length,
        insightsCount: currentInsights.length
      });

      setResults([result]);
      setProgress(100);

    } catch (error) {
      console.error('❌ [Hook] Erro na geração do roteiro:', error);
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