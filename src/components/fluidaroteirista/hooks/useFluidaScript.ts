import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getElementosUniversaisByMentor, getEspecialidadesByMentor } from '@/utils/cadastrarMentores';
import { useTemplateCache } from './useTemplateCache';

interface FluidaScriptData {
  // Dados do modo Akinator/Fluida
  tipo_conteudo?: string;
  objetivo?: string;
  canal?: string;
  estilo?: string;
  equipamento?: string;
  tema?: string;
  
  // Dados do modo Rocket/Elementos Universais
  elementos_escolhidos?: Record<string, string | string[]>;
  storytelling?: string;
  copywriting?: string;
  conhecimento_publico?: string;
  equipamentos?: string;
  analises_dados?: string;
  gatilhos_mentais?: string;
  logica_argumentativa?: string;
  premissas_educativas?: string;
  mapas_empatia?: string;
  headlines?: string;
  ferramentas_especificas?: string;
  modo?: string;
}

export const useFluidaScript = () => {
  const [results, setResults] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiImproving, setAiImproving] = useState(false);
  const { getCached, setCached, generateInstantTemplate } = useTemplateCache();

  const generateScript = async (data: FluidaScriptData) => {
    console.log('🚀 [useFluidaScript] Iniciando geração INSTANTÂNEA + IA Background');
    console.log('📊 [useFluidaScript] Dados recebidos:', data);
    
    setIsGenerating(true);
    
    try {
      // 1. RESPOSTA IMEDIATA: Verificar cache ou gerar template
      const cachedScript = getCached(data.tema || '', data.equipamentos ? [data.equipamentos] : [], data.estilo);
      
      let instantScript;
      if (cachedScript) {
        console.log('💾 [useFluidaScript] Usando cache encontrado');
        instantScript = cachedScript.script;
        instantScript.from_cache = true;
      } else {
        console.log('⚡ [useFluidaScript] Gerando template instantâneo');
        instantScript = generateInstantTemplate(
          data.tema || '',
          data.equipamentos ? [data.equipamentos] : [],
          data.estilo
        );
      }

      // Mostrar resultado imediato
      setResults([instantScript]);
      setIsGenerating(false);
      
      toast.success('⚡ Roteiro pronto!', {
        description: 'Template gerado instantaneamente. IA está melhorando em segundo plano...'
      });

      // 2. IA EM BACKGROUND: Melhorar com IA (apenas se não for do cache ou se for template)
      if (!cachedScript || !cachedScript.isAiGenerated) {
        console.log('🤖 [useFluidaScript] Iniciando melhoria com IA em background');
        setAiImproving(true);
        
        // Marcar que IA está melhorando
        const improvingScript = { ...instantScript, ai_improving: true };
        setResults([improvingScript]);

        try {
          const improvedScript = await generateAiScript(data);
          
          // Substituir com versão melhorada da IA
          setResults([improvedScript]);
          setAiImproving(false);
          
          // Salvar versão IA no cache
          setCached(
            data.tema || '', 
            improvedScript, 
            true, 
            data.equipamentos ? [data.equipamentos] : [], 
            data.estilo
          );
          
          toast.success('✨ Roteiro aprimorado!', {
            description: 'IA finalizou as melhorias do seu roteiro.'
          });
          
        } catch (aiError) {
          console.error('⚠️ [useFluidaScript] IA falhou, mantendo template:', aiError);
          setAiImproving(false);
          
          // Manter template, mas remover indicador de melhoria
          const finalScript = { ...instantScript, ai_improving: false, ai_failed: true };
          setResults([finalScript]);
          
          toast.info('📝 Template mantido', {
            description: 'IA não conseguiu melhorar, mas seu roteiro está pronto para usar!'
          });
        }
      }

      return instantScript;

    } catch (error) {
      console.error('🔥 [useFluidaScript] Erro crítico:', error);
      setIsGenerating(false);
      setAiImproving(false);
      
      toast.error('❌ Erro na geração', {
        description: 'Não foi possível gerar o roteiro. Tente novamente.'
      });
      
      throw error;
    }
  };

  // Função auxiliar para geração com IA (em background)
  const generateAiScript = async (data: FluidaScriptData) => {
    console.log('🚀 [useFluidaScript] Iniciando geração de roteiro');
    console.log('📊 [useFluidaScript] Dados recebidos:', data);
    
    setIsGenerating(true);
    
    // Criar AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log('⏰ [useFluidaScript] Timeout de 60 segundos atingido');
    }, 60000); // 60 segundos timeout
    
    try {
      // Determinar qual modo está sendo usado
      const isRocketMode = data.modo === '10_elementos_universais' || data.elementos_escolhidos;
      const isFluida = !isRocketMode;
      
      console.log('🔍 [useFluidaScript] Modo detectado:', isRocketMode ? 'Rocket (10 Elementos)' : 'Fluida (Akinator)');

      // Normalizar dados para formato compatível
      const normalizedData = isRocketMode ? {
        tipo_conteudo: data.tipo_conteudo || 'carrossel',
        objetivo: data.objetivo || 'atrair',
        canal: data.canal || 'instagram',
        estilo: inferirEstiloDoElementos(data) || 'criativo',
        equipamento: data.equipamentos || data.equipamento || '',
        tema: data.tema || ''
      } : {
        tipo_conteudo: data.tipo_conteudo || 'carrossel',
        objetivo: data.objetivo || 'atrair',
        canal: data.canal || 'instagram',
        estilo: data.estilo || 'criativo',
        equipamento: data.equipamento || '',
        tema: data.tema || ''
      };

      console.log('🔄 [useFluidaScript] Dados normalizados:', normalizedData);

      // Inferir mentor baseado nos dados normalizados
      const mentorInferido = inferirMentor(normalizedData);
      const elementosUniversais = getElementosUniversaisByMentor(mentorInferido) || getDefaultElementos();
      const especialidades = getEspecialidadesByMentor(mentorInferido) || ['Criatividade', 'Inovação'];

      console.log('🧠 [useFluidaScript] Mentor inferido:', mentorInferido);
      console.log('📊 [useFluidaScript] Elementos universais:', elementosUniversais);

      // Construir prompt específico baseado no modo
      let promptData: { systemPrompt: string; userPrompt: string };
      if (isRocketMode) {
        promptData = buildRocketPrompt(data, mentorInferido, elementosUniversais, especialidades);
      } else {
        promptData = buildFluidaPrompt(normalizedData, mentorInferido, elementosUniversais, especialidades);
      }

      // CORREÇÃO: Envolver os dados na propriedade 'request' esperada pela edge function
      const requestPayload = {
        request: {
          type: 'custom',
          systemPrompt: promptData.systemPrompt,
          userPrompt: promptData.userPrompt,
          topic: normalizedData.tema,
          additionalInfo: JSON.stringify({
            tipo_de_clinica: 'estetico',
            especialidade: '',
            equipamentos: normalizedData.equipamento,
            protocolo: '',
            ticket_medio: '',
            publico_ideal: '',
            estilo_clinica: '',
            estilo_linguagem: '',
            mentor_nome: mentorInferido,
            elementos_universais: elementosUniversais,
            especialidades: especialidades,
            modo: isRocketMode ? 'rocket' : 'fluida'
          }),
          tone: normalizedData.estilo,
          marketingObjective: normalizedData.objetivo
        }
      };

      console.log('📤 [useFluidaScript] Enviando request para Supabase function');

      // Usar Supabase functions invoke
      const { data: result, error } = await supabase.functions.invoke('generate-script', {
        body: requestPayload
      });

      // Limpar timeout se chegou até aqui
      clearTimeout(timeoutId);

      if (error) {
        console.error('❌ [useFluidaScript] Erro na função Supabase:', error);
        throw new Error(`Erro na API: ${error.message}`);
      }

      if (!result) {
        console.error('❌ [useFluidaScript] Resultado vazio da API');
        throw new Error('Resultado vazio da API');
      }

      console.log('✅ [useFluidaScript] Resultado recebido:', result);

      // Tentar fazer parse do conteúdo se for JSON
      let scriptData = result;
      if (result.content) {
        try {
          const parsedContent = JSON.parse(result.content);
          scriptData = { ...result, ...parsedContent };
          console.log('🔄 [useFluidaScript] Conteúdo JSON parseado:', scriptData);
        } catch (parseError) {
          console.log('ℹ️ [useFluidaScript] Conteúdo não é JSON, usando como texto');
          scriptData = {
            ...result,
            roteiro: result.content,
            formato: normalizedData.tipo_conteudo,
            emocao_central: 'criatividade',
            intencao: normalizedData.objetivo,
            objetivo: normalizedData.tema,
            mentor: mentorInferido,
            elementos_aplicados: elementosUniversais,
            especialidades_aplicadas: especialidades
          };
        }
      }

      // Garantir que temos os campos necessários
      if (!scriptData.roteiro && !scriptData.content) {
        console.error('❌ [useFluidaScript] Roteiro vazio');
        throw new Error('Roteiro gerado está vazio');
      }

      // Adicionar elementos universais ao resultado
      scriptData.elementos_aplicados = scriptData.elementos_aplicados || elementosUniversais;
      scriptData.mentor = scriptData.mentor || mentorInferido;
      scriptData.especialidades_aplicadas = scriptData.especialidades_aplicadas || especialidades;
      scriptData.modo_usado = isRocketMode ? 'Rocket (10 Elementos Universais)' : 'Fluida (Akinator)';
      scriptData.is_template = false;
      scriptData.ai_improving = false;

      setResults([scriptData]);
      console.log('✅ [useFluidaScript] Roteiro salvo nos resultados com elementos universais');
      
      toast.success('✨ Roteiro gerado com sucesso!', {
        description: `Seu roteiro ${isRocketMode ? 'Rocket' : 'FLUIDA'} está pronto com os elementos aplicados pelo mentor ${mentorInferido}.`
      });

      return scriptData;

    } catch (error) {
      clearTimeout(timeoutId);
      console.error('🔥 [useFluidaScript] Erro ao gerar roteiro:', error);
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Erro desconhecido';
      let errorDescription = '';
      
      if (error.name === 'AbortError') {
        errorMessage = '⏰ Tempo esgotado';
        errorDescription = 'A geração está demorando mais que o esperado. Tente novamente com um tema mais simples.';
      } else if (error.message?.includes('API')) {
        errorMessage = '🔧 Problema na API';
        errorDescription = 'Erro na comunicação com o servidor. Verifique sua conexão.';
      } else if (error.message?.includes('vazio')) {
        errorMessage = '📝 Conteúdo vazio';
        errorDescription = 'O roteiro não foi gerado. Tente reformular o tema.';
      } else {
        errorMessage = '❌ Erro na geração';
        errorDescription = error instanceof Error ? error.message : 'Erro desconhecido';
      }
      
      toast.error(errorMessage, {
        description: errorDescription,
        action: {
          label: "Tentar novamente",
          onClick: () => generateScript(data)
        }
      });
      
      throw error;
    } finally {
      setIsGenerating(false);
      console.log('🏁 [useFluidaScript] Geração finalizada');
    }
  };

  const buildRocketPrompt = (data: FluidaScriptData, mentor: string, elementos: any, especialidades: string[]) => {
    const systemPrompt = `
      Você é o FLUIDAROTEIRISTA ROCKET — versão avançada com os 10 Elementos Universais.
      
      🚀 ELEMENTOS UNIVERSAIS APLICADOS:
      
      ${buildElementosPrompt(elementos, mentor, especialidades)}
      
      ELEMENTOS ESCOLHIDOS PELO USUÁRIO:
      - Storytelling: ${data.storytelling}
      - Copywriting: ${data.copywriting}
      - Público-alvo: ${data.conhecimento_publico}
      - Equipamentos: ${data.equipamentos}
      - Análise de Dados: ${data.analises_dados}
      - Gatilhos Mentais: ${data.gatilhos_mentais}
      - Lógica Argumentativa: ${data.logica_argumentativa}
      - Educação: ${data.premissas_educativas}
      - Empatia: ${data.mapas_empatia}
      - Headlines: ${data.headlines}
      - Ferramentas: ${data.ferramentas_especificas}
      
      ESTRUTURA OBRIGATÓRIA:
      1. Gancho (Headlines + Gatilhos Mentais)
      2. Conflito (Mapas de Empatia + Conhecimento do Público)
      3. Virada (Lógica Argumentativa + Premissas Educativas)
      4. CTA (Copywriting + Ferramentas Específicas)
      
      INTEGRAÇÃO DOS ELEMENTOS:
      - Use o tipo de storytelling escolhido para estruturar a narrativa
      - Aplique o estilo de copywriting na linguagem
      - Considere o público-alvo definido
      - Destaque os equipamentos mencionados
      - Use os gatilhos mentais selecionados
      - Mantenha a lógica argumentativa escolhida
      - Inclua o nível de educação desejado
      - Conecte-se emocionalmente conforme o mapa de empatia
      - Crie headlines no estilo escolhido
      - Finalize com as ferramentas específicas selecionadas
      
      IMPORTANTE: Seja CONCISO e DIRETO. Máximo 800 tokens de resposta.
      
      Retorne APENAS JSON válido:
      {
        "roteiro": "Conteúdo do roteiro estruturado com todos os 10 elementos aplicados",
        "formato": "carrossel",
        "emocao_central": "emoção detectada dos elementos",
        "intencao": "intenção principal baseada nos elementos",
        "objetivo": "Objetivo específico do roteiro",
        "mentor": "${mentor}",
        "elementos_aplicados": ${JSON.stringify(elementos)},
        "especialidades_aplicadas": ${JSON.stringify(especialidades)},
        "modo_usado": "Rocket (10 Elementos Universais)"
      }
    `;

    const userPrompt = `
      Tema: ${data.tema}
      
      Crie um roteiro ROCKET CONCISO integrando todos os 10 elementos universais escolhidos pelo usuário.
      Cada elemento deve ser aplicado de forma harmoniosa e estratégica no roteiro final.
      MÁXIMO 500 palavras no roteiro.
    `;

    return { systemPrompt, userPrompt };
  };

  const buildFluidaPrompt = (data: any, mentor: string, elementos: any, especialidades: string[]) => {
    const systemPrompt = `
      Você é o FLUIDAROTEIRISTA — roteirista oficial da plataforma para clínicas estéticas e médicas.
      
      🎯 ESTRUTURA UNIVERSAL DOS 10 ELEMENTOS (Método Leandro Ladeira adaptado):
      
      ${buildElementosPrompt(elementos, mentor, especialidades)}
      
      Contexto da clínica:
      - Tipo: estetico
      - Especialidade: 
      - Equipamentos: ${data.equipamento}
      - Protocolo mais vendido: 
      - Ticket médio: 
      - Público ideal: 
      - Estilo da clínica: 
      - Mentor: ${mentor}
      
      ESTRUTURA OBRIGATÓRIA:
      1. Gancho (Headlines + Gatilhos Mentais)
      2. Conflito (Mapas de Empatia + Conhecimento do Público)
      3. Virada (Lógica Argumentativa + Premissas Educativas)
      4. CTA (Copywriting + Ferramentas Específicas)
      
      FORMATO: ${data.tipo_conteudo}
      
      IMPORTANTE: Seja CONCISO e DIRETO. Máximo 800 tokens de resposta.
      
      Retorne APENAS JSON válido:
      {
        "roteiro": "Conteúdo do roteiro estruturado aplicando os 10 elementos",
        "formato": "carrossel/stories/imagem/video",
        "emocao_central": "esperança/confiança/urgência/etc",
        "intencao": "atrair/vender/educar/conectar",
        "objetivo": "Objetivo específico do post",
        "mentor": "${mentor}",
        "elementos_aplicados": ${JSON.stringify(elementos)},
        "especialidades_aplicadas": ${JSON.stringify(especialidades)},
        "modo_usado": "Fluida (Akinator)"
      }
    `;

    const userPrompt = `
      Tema: ${data.tema}
      Tipo de conteúdo: ${data.tipo_conteudo}
      Objetivo: ${data.objetivo}
      Canal: ${data.canal}
      Estilo: ${data.estilo}
      
      Crie um roteiro CONCISO seguindo o modelo FLUIDAROTEIRISTA com os 10 elementos universais aplicados 
      conforme a intensidade específica do mentor ${mentor}. Use as especialidades 
      ${especialidades.join(', ')} para dar personalidade única ao roteiro.
      MÁXIMO 500 palavras no roteiro.
    `;

    return { systemPrompt, userPrompt };
  };

  const inferirEstiloDoElementos = (data: FluidaScriptData): string => {
    // Inferir estilo baseado nas escolhas dos elementos
    const storytelling = data.storytelling;
    const copywriting = data.copywriting;
    
    if (copywriting === 'cientifico_tecnico' || storytelling === 'casos_reais') {
      return 'cientifico';
    }
    if (copywriting === 'emocional_envolvente' || storytelling === 'jornada_heroi') {
      return 'emocional';
    }
    if (copywriting === 'direto_objetivo') {
      return 'direto';
    }
    if (storytelling === 'metaforas' || copywriting === 'conversacional_amigavel') {
      return 'criativo';
    }
    
    return 'criativo'; // Default
  };

  const inferirMentor = (data: any): string => {
    // Verificar se os dados estão definidos antes de acessar propriedades
    const objetivo = data?.objetivo || '';
    const estilo = data?.estilo || '';
    const tipoConteudo = data?.tipo_conteudo || '';
    const canal = data?.canal || '';

    console.log('🔍 [inferirMentor] Dados para inferência:', { objetivo, estilo, tipoConteudo, canal });

    // Lógica de inferência baseada no estilo e objetivo
    if (estilo === 'direto' && objetivo.includes('vend')) {
      return 'Leandro Ladeira';
    }
    if (estilo === 'emocional' || objetivo.includes('conexão')) {
      return 'Ícaro de Carvalho';
    }
    if (estilo === 'criativo' || tipoConteudo === 'video') {
      return 'Paulo Cuenca';
    }
    if (estilo === 'didatico' || objetivo.includes('educar')) {
      return 'Camila Porto';
    }
    if (estilo === 'humoristico' || canal.includes('stories')) {
      return 'Hyeser Souza';
    }
    if (estilo === 'publicitario' || objetivo.includes('branding')) {
      return 'Washington Olivetto';
    }
    
    console.log('🎯 [inferirMentor] Mentor padrão selecionado: Pedro Sobral');
    return 'Pedro Sobral';
  };

  const getDefaultElementos = () => {
    return {
      storytelling: 7,
      copywriting: 8,
      conhecimento_publico: 6,
      analises_dados: 5,
      gatilhos_mentais: 7,
      logica_argumentativa: 6,
      premissas_educativas: 7,
      mapas_empatia: 8,
      headlines: 9,
      ferramentas_especificas: 6
    };
  };

  const buildElementosPrompt = (elementos: any, mentor: string, especialidades: string[]): string => {
    if (!elementos) return '';

    return `
1. STORYTELLING (Intensidade: ${elementos.storytelling || 7}/10)
   ${(elementos.storytelling || 7) >= 8 ? '- Narrativas envolventes e emocionais' : (elementos.storytelling || 7) >= 6 ? '- Histórias simples e diretas' : '- Elementos narrativos sutis'}

2. COPYWRITING (Intensidade: ${elementos.copywriting || 8}/10)
   ${(elementos.copywriting || 8) >= 8 ? '- Textos persuasivos e impactantes' : (elementos.copywriting || 8) >= 6 ? '- Copy clara e objetiva' : '- Linguagem simples e acessível'}

3. CONHECIMENTO DO PÚBLICO-ALVO (Intensidade: ${elementos.conhecimento_publico || 6}/10)
   ${(elementos.conhecimento_publico || 6) >= 8 ? '- Segmentação precisa e personalizada' : (elementos.conhecimento_publico || 6) >= 6 ? '- Perfil básico definido' : '- Público geral'}

4. ANÁLISES E DADOS (Intensidade: ${elementos.analises_dados || 5}/10)
   ${(elementos.analises_dados || 5) >= 8 ? '- Métricas detalhadas e otimização' : (elementos.analises_dados || 5) >= 6 ? '- Dados básicos de performance' : '- Foco na criatividade'}

5. GATILHOS MENTAIS (Intensidade: ${elementos.gatilhos_mentais || 7}/10)
   ${(elementos.gatilhos_mentais || 7) >= 8 ? '- Escassez, urgência, prova social' : (elementos.gatilhos_mentais || 7) >= 6 ? '- Gatilhos sutis' : '- Persuasão natural'}

6. LÓGICA ARGUMENTATIVA (Intensidade: ${elementos.logica_argumentativa || 6}/10)
   ${(elementos.logica_argumentativa || 6) >= 8 ? '- Argumentos estruturados e convincentes' : (elementos.logica_argumentativa || 6) >= 6 ? '- Razões claras' : '- Abordagem emocional'}

7. PREMISSAS EDUCATIVAS (Intensidade: ${elementos.premissas_educativas || 7}/10)
   ${(elementos.premissas_educativas || 7) >= 8 ? '- Educação antes da oferta' : (elementos.premissas_educativas || 7) >= 6 ? '- Informações básicas' : '- Foco na ação'}

8. MAPAS DE EMPATIA (Intensidade: ${elementos.mapas_empatia || 8}/10)
   ${(elementos.mapas_empatia || 8) >= 8 ? '- Perspectiva profunda do cliente' : (elementos.mapas_empatia || 8) >= 6 ? '- Compreensão básica' : '- Abordagem direta'}

9. HEADLINES (Intensidade: ${elementos.headlines || 9}/10)
   ${(elementos.headlines || 9) >= 8 ? '- Títulos magnéticos e irresistíveis' : (elementos.headlines || 9) >= 6 ? '- Títulos claros e atrativos' : '- Títulos simples'}

10. FERRAMENTAS ESPECÍFICAS (Intensidade: ${elementos.ferramentas_especificas || 6}/10)
    ${(elementos.ferramentas_especificas || 6) >= 8 ? '- CTAs, funis, vídeos de venda' : (elementos.ferramentas_especificas || 6) >= 6 ? '- CTAs básicos' : '- Chamadas simples'}

🎨 ESPECIALIDADES DO MENTOR ${mentor}: ${especialidades.join(', ')}
    `;
  };

  const applyDisneyMagic = async (script: any) => {
    console.log('✨ [useFluidaScript] Aplicando Disney Magic com elementos universais');
    const disneyScript = {
      ...script,
      roteiro: script.roteiro.replace(/tratamento/g, 'jornada de transformação')
        .replace(/procedimento/g, 'ritual de beleza')
        .replace(/resultado/g, 'metamorfose')
        .replace(/cliente/g, 'pessoa especial'),
      emocao_central: 'encantamento',
      mentor: 'Fluida Encantadora',
      elementos_aplicados: {
        ...script.elementos_aplicados,
        storytelling: 10,
        mapas_empatia: 10,
        headlines: 10
      }
    };
    
    setResults([disneyScript]);
    toast.success('🏰 Disney Magic aplicada!', {
      description: 'Seu roteiro agora tem a magia Disney com elementos universais potencializados.'
    });
  };

  const clearResults = () => {
    console.log('🗑️ [useFluidaScript] Limpando resultados');
    setResults([]);
    setAiImproving(false);
  };

  const generateImage = async (script: any) => {
    console.log('🖼️ [useFluidaScript] Gerando imagem para script');
    toast.info('🖼️ Geração de imagem', {
      description: 'Funcionalidade em desenvolvimento.'
    });
  };

  const generateAudio = async (script: any) => {
    console.log('🎙️ [useFluidaScript] Gerando áudio para script');
    toast.info('🎙️ Geração de áudio', {
      description: 'Funcionalidade em desenvolvimento.'
    });
  };

  return {
    results,
    isGenerating,
    aiImproving,
    generateScript,
    applyDisneyMagic,
    clearResults,
    generateImage,
    generateAudio
  };
};
