
import { useState } from 'react';
import { toast } from 'sonner';
import { generateScript } from '@/services/supabaseService';
import { useEquipmentData } from '@/hooks/useEquipmentData';

export interface FluidaScriptResult {
  roteiro: string;
  formato: string;
  emocao_central: string;
  intencao: string;
  objetivo: string;
  mentor: string;
  elementos_aplicados?: any;
  especialidades_aplicadas?: string[];
  modo_usado?: string;
  disney_applied?: boolean;
  equipamentos_utilizados?: any[];
}

export const useFluidaScript = () => {
  const [results, setResults] = useState<FluidaScriptResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { getEquipmentDetails } = useEquipmentData();

  const buildSystemPrompt = (equipmentDetails: any[], modo: string, mentor: string) => {
    const equipmentContext = equipmentDetails.length > 0 
      ? equipmentDetails.map(eq => `
        - ${eq.nome}: ${eq.tecnologia}
        - Indicações: ${eq.indicacoes}
        - Benefícios: ${eq.beneficios}
        - Diferenciais: ${eq.diferenciais}
      `).join('\n')
      : '';

    return `
      Você é o FLUIDAROTEIRISTA — roteirista oficial da plataforma para clínicas estéticas e médicas.
      
      🎯 RESTRIÇÃO TEMPORAL OBRIGATÓRIA: MÁXIMO 60 SEGUNDOS DE LEITURA
      - Limite: ~150 palavras (velocidade de leitura média)
      - Seja CONCISO e DIRETO
      - Cada palavra deve ter impacto
      
      📋 EQUIPAMENTOS DISPONÍVEIS:
      ${equipmentContext}
      
      ESTRUTURA OBRIGATÓRIA (em 60 segundos):
      1. Gancho (5-10 segundos) - Capturar atenção
      2. Conflito (15-20 segundos) - Apresentar problema
      3. Virada (25-30 segundos) - Mostrar solução com equipamentos
      4. CTA (5-10 segundos) - Chamada para ação
      
      MENTOR: ${mentor}
      MODO: ${modo}
      
      IMPORTANTE: 
      - Mencione especificamente os equipamentos e suas tecnologias
      - Conecte os benefícios dos equipamentos com o problema apresentado
      - Mantenha o tempo de 60 segundos rigorosamente
      
      Retorne APENAS JSON válido:
      {
        "roteiro": "Conteúdo do roteiro (máximo 150 palavras)",
        "formato": "carrossel/stories/imagem",
        "emocao_central": "emoção detectada",
        "intencao": "intenção principal",
        "objetivo": "Objetivo específico do roteiro",
        "mentor": "${mentor}",
        "equipamentos_utilizados": ${JSON.stringify(equipmentDetails)}
      }
    `;
  };

  const buildDisneyPrompt = (originalScript: string) => {
    return `
      PARTE 1 - Análise Walt Disney 1928:
      Assuma a identidade de Walt Disney em seu estúdio em 1928.
      Analise este SCRIPT: "${originalScript}"
      
      Identifique:
      - Qual a emoção escondida nessa história?
      - Que sonho universal isso toca?
      - Onde está a magia que ninguém mais vê?
      - Qual transformação isso promete?
      
      PARTE 2 - Construção do Mundo:
      Como Walt Disney, construa:
      - Quem é nosso 'Mickey Mouse'? (O elemento único)
      - Qual o momento cativante de abertura?
      - Onde está nosso 'Castelo'? (O elemento aspiracional)
      
      PARTE 3 - Estrutura Disney:
      Reestruture usando os elementos Disney:
      - Momento de IDENTIFICAÇÃO
      - Ponto de CONFLITO
      - JORNADA de transformação
      - Final INESQUECÍVEL
      
      PARTE 4 - Elementos Disney:
      Adicione:
      - Momento de surpresa inesperado
      - Virada emocional que toca o coração
      - Lição que todos precisam aprender
      - Final que faz as pessoas sorrirem
      - Elemento inesquecível
      
      PARTE 5 - Revisão Final:
      Questione como Walt:
      - Isso faz as pessoas SONHAREM?
      - Tem o momento de MAGIA?
      - Gera sorriso INVOLUNTÁRIO?
      - As pessoas vão compartilhar?
      - É digno do padrão DISNEY?
      
      RESTRIÇÕES:
      - Se carrossel: Card 1 até 13 palavras
      - Se reels: TAKE 1 até 14 palavras
      - MÁXIMO 60 segundos de leitura
      - NÃO use "Era uma vez"
      - Mantenha sutileza Disney
      
      Retorne apenas o roteiro transformado em JSON:
      {
        "roteiro": "Roteiro com magia Disney sutil",
        "disney_applied": true
      }
    `;
  };

  const generateScript = async (data: any) => {
    console.log('🎬 [useFluidaScript] Iniciando geração de roteiro:', data);
    
    // Validações básicas
    if (!data.tema || !data.tema.trim()) {
      toast.error('❌ Erro de validação', {
        description: 'Por favor, informe um tema para o roteiro'
      });
      return [];
    }

    if (isGenerating) {
      console.warn('⚠️ [useFluidaScript] Geração já em andamento, ignorando nova solicitação');
      return [];
    }
    
    setIsGenerating(true);
    
    try {
      console.log('🔧 [useFluidaScript] Buscando dados dos equipamentos...');
      // Buscar dados dos equipamentos se disponíveis
      const equipmentNames = data.equipamentos || [];
      const equipmentDetails = await getEquipmentDetails(equipmentNames);
      console.log('✅ [useFluidaScript] Equipamentos carregados:', equipmentDetails.length);
      
      const systemPrompt = buildSystemPrompt(equipmentDetails, data.modo || 'rocket', data.mentor || 'Criativo');
      
      const userPrompt = `
        Tema: ${data.tema}
        Objetivo: ${data.objetivo || 'Atrair novos clientes'}
        Equipamentos: ${equipmentNames.join(', ')}
        
        Crie um roteiro CONCISO de MÁXIMO 60 segundos integrando os equipamentos e suas características específicas.
      `;

      console.log('🤖 [useFluidaScript] Chamando API OpenAI...');
      const response = await generateScript({
        type: 'custom',
        systemPrompt,
        userPrompt,
        topic: data.tema,
        additionalInfo: JSON.stringify({ equipmentDetails, modo: data.modo }),
        tone: 'professional',
        marketingObjective: data.objetivo as any
      });

      console.log('📝 [useFluidaScript] Resposta recebida da API');

      let scriptResult: FluidaScriptResult;
      try {
        scriptResult = JSON.parse(response.content);
        console.log('✅ [useFluidaScript] JSON parseado com sucesso');
      } catch (parseError) {
        console.warn('⚠️ [useFluidaScript] Erro ao parsear JSON, usando fallback:', parseError);
        scriptResult = {
          roteiro: response.content,
          formato: 'carrossel',
          emocao_central: 'confiança',
          intencao: 'atrair',
          objetivo: data.objetivo || 'Atrair novos clientes',
          mentor: data.mentor || 'Criativo',
          equipamentos_utilizados: equipmentDetails
        };
      }

      console.log('🎯 [useFluidaScript] Script resultado criado:', scriptResult);
      setResults([scriptResult]);
      
      toast.success('🎬 Roteiro FLUIDA gerado!', {
        description: `Criado em 60 segundos com ${equipmentNames.length} equipamento(s)`
      });

      return [scriptResult];

    } catch (error) {
      console.error('🔥 [useFluidaScript] Erro na geração:', error);
      toast.error('❌ Erro ao gerar roteiro', {
        description: error instanceof Error ? error.message : 'Tente novamente em alguns instantes'
      });
      return [];
    } finally {
      console.log('🏁 [useFluidaScript] Finalizando geração');
      setIsGenerating(false);
    }
  };

  const applyDisneyMagic = async (script: FluidaScriptResult) => {
    console.log('✨ [useFluidaScript] Aplicando Disney Magic...');
    
    if (isGenerating) {
      console.warn('⚠️ [useFluidaScript] Operação já em andamento');
      return;
    }

    setIsGenerating(true);
    
    try {
      const disneyPrompt = buildDisneyPrompt(script.roteiro);
      
      const response = await generateScript({
        type: 'custom',
        systemPrompt: disneyPrompt,
        userPrompt: `Transforme este roteiro com a magia Disney de 1928: ${script.roteiro}`,
        topic: 'Disney Magic Transformation',
        additionalInfo: 'Disney Magic Applied',
        tone: 'magical',
        marketingObjective: 'Criar Conexão' as any
      });

      let disneyResult;
      try {
        disneyResult = JSON.parse(response.content);
      } catch {
        disneyResult = {
          roteiro: response.content,
          disney_applied: true
        };
      }

      const updatedScript = {
        ...script,
        roteiro: disneyResult.roteiro,
        disney_applied: true,
        emocao_central: 'encantamento',
        mentor: 'Walt Disney 1928'
      };

      setResults([updatedScript]);
      
      toast.success('✨ Disney Magic Aplicada!', {
        description: 'Roteiro transformado com a magia de Walt Disney'
      });

    } catch (error) {
      console.error('🔥 [useFluidaScript] Erro no Disney Magic:', error);
      toast.error('❌ Erro ao aplicar Disney Magic', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async (script: FluidaScriptResult) => {
    console.log('🖼️ [useFluidaScript] Gerando imagem...');
    toast.info('🖼️ Gerando imagem...', {
      description: 'Aguarde enquanto criamos a arte perfeita'
    });
  };

  const generateAudio = async (script: FluidaScriptResult) => {
    console.log('🎙️ [useFluidaScript] Gerando áudio...');
    toast.info('🎙️ Gerando áudio...', {
      description: 'Preparando narração do roteiro'
    });
  };

  const clearResults = () => {
    console.log('🧹 [useFluidaScript] Limpando resultados');
    setResults([]);
  };

  return {
    results,
    isGenerating,
    generateScript,
    applyDisneyMagic,
    generateImage,
    generateAudio,
    clearResults
  };
};
