import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY não encontrada' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Inicializar Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request
    let requestData;
    try {
      requestData = await req.json();
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: "Formato de requisição inválido" }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { messages, currentPath, userProfile, intent } = requestData;
    
    console.log('🧠 [mestre-da-beleza-ai] Consulta iniciada:', {
      messagesCount: messages?.length || 0,
      currentPath: currentPath || 'inicio',
      userProfile: userProfile || 'detectando...',
      intent: intent?.intencao || 'não detectada'
    });

    // 0. RATE LIMIT - por IP ou usuário
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('cf-connecting-ip') || 'anonymous';
    try {
      const { data: rateData } = await supabase.rpc('check_rate_limit', {
        p_identifier: userProfile?.id || ip,
        p_endpoint: 'mestre-da-beleza-ai',
        p_max_requests: 30,
        p_window_minutes: 1
      });
      if (rateData && rateData.allowed === false) {
        return new Response(JSON.stringify({ error: 'Limite de requisições excedido', ...rateData }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    } catch (rateErr) {
      console.warn('Falha no rate limit:', rateErr);
    }

    // 1. BUSCAR EQUIPAMENTOS RELEVANTES (filtrados por área quando possível)
    console.log('🔍 Buscando equipamentos no banco de dados...');
    let equipamentosQuery = supabase
      .from('equipamentos')
      .select('*')
      .eq('ativo', true)
      .eq('akinator_enabled', true);
    const area = userProfile?.area_problema;
    if (area) {
      // filtra por sobreposição de áreas
      // @ts-ignore - método overlaps é suportado pelo supabase-js
      equipamentosQuery = (equipamentosQuery as any).overlaps('area_aplicacao', [area]);
    }
    const { data: equipamentos, error: equipError } = await equipamentosQuery;

    if (equipError) {
      console.error('❌ Erro ao buscar equipamentos:', equipError);
    }

    // 2. BUSCAR ARTIGOS CIENTÍFICOS RELEVANTES (contextualizados)
    console.log('📚 Buscando artigos científicos...');
    const keywords: string[] = [];
    if (userProfile?.problema_identificado) keywords.push(userProfile.problema_identificado);
    if (userProfile?.area_problema) keywords.push(userProfile.area_problema);
    const lastUserMsg = Array.isArray(messages) ? (messages[messages.length - 1]?.content as string) : '';
    if (lastUserMsg) {
      const hint = lastUserMsg.split(/[\s,.;:!?]/).slice(0, 5).join(' ');
      if (hint) keywords.push(hint);
    }
    let artigosQuery = supabase
      .from('unified_documents')
      .select('titulo_extraido, texto_completo, palavras_chave, autores, equipamento_id')
      .eq('status_processamento', 'concluido')
      .eq('tipo_documento', 'artigo_cientifico');
    if (keywords.length > 0) {
      // restringe por interseção de palavras-chave
      // @ts-ignore contains para arrays
      artigosQuery = (artigosQuery as any).contains('palavras_chave', [keywords[0]]);
    }
    const { data: artigos, error: artigosError } = await artigosQuery.limit(10);

    if (artigosError) {
      console.error('❌ Erro ao buscar artigos:', artigosError);
    }

    // 3. PREPARAR CONHECIMENTO BASE
    const equipamentosInfo = (equipamentos || []).map(eq => ({
      nome: eq.nome,
      categoria: eq.categoria,
      tecnologia: eq.tecnologia,
      indicacoes: eq.indicacoes,
      beneficios: eq.beneficios,
      diferenciais: eq.diferenciais,
      contraindicacoes: eq.contraindicacoes,
      area_aplicacao: eq.area_aplicacao,
      perfil_ideal_paciente: eq.perfil_ideal_paciente,
      nivel_investimento: eq.nivel_investimento
    }));

    const artigosInfo = (artigos || []).slice(0, 5).map(art => ({
      titulo: art.titulo_extraido,
      resumo: art.texto_completo?.substring(0, 500) + '...',
      keywords: art.palavras_chave,
      autores: art.autores
    }));

    const userContext = `
🧾 CONTEXTO DO ATENDIMENTO:
- Perfil: ${userProfile?.perfil || 'não informado'}
- Idade est.: ${userProfile?.idade_estimada ?? 'N/D'}
- Área principal: ${userProfile?.area_problema || 'N/D'}
- Problema: ${userProfile?.problema_identificado || 'N/D'}
- Respostas acumuladas: ${Object.keys(userProfile?.responses || {}).length}
`;


    // 4. CRIAR PROMPT CIENTÍFICO AVANÇADO
    const baseKnowledge = `
📚 BASE DE CONHECIMENTO CIENTÍFICO:

🔬 EQUIPAMENTOS DISPONÍVEIS (${equipamentosInfo.length} equipamentos):
${equipamentosInfo.map(eq => `
• ${eq.nome} (${eq.categoria})
  - Tecnologia: ${eq.tecnologia}
  - Indicações: ${eq.indicacoes}
  - Benefícios: ${eq.beneficios}
  - Nível investimento: ${eq.nivel_investimento}
  - Perfil ideal: ${Array.isArray(eq.perfil_ideal_paciente) ? eq.perfil_ideal_paciente.join(', ') : eq.perfil_ideal_paciente}
`).join('\n')}

📖 ARTIGOS CIENTÍFICOS RELEVANTES (${artigosInfo.length} estudos):
${artigosInfo.map(art => `
• "${art.titulo}"
  - Autores: ${Array.isArray(art.autores) ? art.autores.join(', ') : art.autores}
  - Keywords: ${Array.isArray(art.keywords) ? art.keywords.join(', ') : art.keywords}
  - Resumo: ${art.resumo}
`).join('\n')}`;

    const contextualMessages = [
      {
        role: "system",
        content: `Você é o MESTRE DA BELEZA, um gênio da estética com acesso a uma vasta base de conhecimento científico e equipamentos de última geração.

        🧙‍♂️ PERSONALIDADE:
        - Místico mas cientificamente preciso
        - Use emojis e linguagem envolvente
        - Seja confiante e misterioso
        - Responda diretamente às perguntas do usuário
        - Use metáforas místicas mas mantenha base científica

        ${userContext}

        ${intent ? `🎯 INTENÇÃO DETECTADA: ${intent.intencao} (${intent.categoria})
        - Ação recomendada: ${intent.acao_recomendada}
        - Foque sua resposta nesta intenção específica
        ` : ''}

        🎯 MISSÃO PRINCIPAL:
        - Responder diretamente à pergunta do usuário
        - Seja um ChatGPT especializado em estética
        - Recomendar equipamentos específicos com base científica
        - Fornecer informações práticas e aplicáveis
        - Ser conciso e objetivo
        
        🔮 REGRAS DE CONDUTA:
        - SEMPRE baseie recomendações nos equipamentos e artigos disponíveis
        - Seja específico sobre protocolos e equipamentos
        - Mantenha tom científico mas acessível
        - **MÁXIMO 150 palavras por resposta**
        - Use formatação simples e direta
        - Responda diretamente sem fazer perguntas desnecessárias
        - Use bullets (•) para listas
        - Destaque equipamentos com **negrito**
        - Forneça informações práticas e aplicáveis
        
        ${baseKnowledge}
        
        🔬 COMO RESPONDER:
        - Responda diretamente à pergunta feita
        - Se perguntam sobre roteiro, explique como fazer
        - Se perguntam sobre artigos, cite estudos relevantes
        - Se perguntam sobre tratamento, sugira protocolos específicos
        - Se perguntam sobre equipamento, explique funcionamento e benefícios
        
        FORMATO DA RESPOSTA:
        - Use bullets (•) para pontos principais
        - **Negrito** para equipamentos e conceitos importantes
        - Máximo 4-5 bullets por resposta
        - Seja prático e aplicável
        
        IMPORTANTE: Use APENAS os equipamentos e informações científicas fornecidas acima. NÃO invente equipamentos ou estudos.`
      },
      ...messages
    ];

    // 5. CHAMAR OPENAI com roteamento por tier
    console.log('🤖 Enviando para OpenAI...');
    const startTime = Date.now();
    
    // Determinar modelo baseado no tier (defaulting to gpt-4o-mini)
    const modelTier = requestData.modelTier || 'standard';
    const usedModel = modelTier === 'gpt5' ? 'gpt-4o' : 'gpt-4o-mini';
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: usedModel,
        messages: contextualMessages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(`Erro na API OpenAI: ${data.error.message}`);
    }
    const assistantReply = data.choices?.[0]?.message?.content ?? '';
    const responseTime = Date.now() - startTime;
    const promptTokens = data.usage?.prompt_tokens ?? 0;
    const completionTokens = data.usage?.completion_tokens ?? 0;
    const totalTokens = promptTokens + completionTokens;
    console.log('✨ Resposta do Mestre da Beleza gerada com sucesso');

    // 5.1 Registrar métricas de uso de IA (se possível)
    try {
      const inputCost = (promptTokens / 1000) * 0.00015; // gpt-4o-mini input
      const outputCost = (completionTokens / 1000) * 0.00060; // gpt-4o-mini output
      const estimatedCost = Number((inputCost + outputCost).toFixed(6));
      await supabase.from('ai_usage_metrics' as any).insert({
        service_name: 'mestre-da-beleza-ai',
        endpoint: 'chat',
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
        estimated_cost: estimatedCost,
        model: usedModel,
        user_id: requestData.user_id || null,
        response_time_ms: responseTime
      } as any);
    } catch (metricsErr) {
      console.warn('⚠️ Falha ao salvar métricas de IA:', metricsErr);
    }

    // 6. SALVAR INTERAÇÃO PARA APRENDIZADO
    try {
      await supabase.from('intent_history').insert({
        user_id: requestData.user_id || null,
        mensagem_usuario: messages[messages.length - 1]?.content || '',
        intencao_detectada: currentPath || 'consulta_mestre',
        acao_executada: 'resposta_ia_personalizada'
      });
    } catch (intentError) {
      console.error('⚠️ Erro ao salvar intent history:', intentError);
    }

    return new Response(
      JSON.stringify({ 
        content: assistantReply,
        equipamentosUsados: equipamentosInfo.length,
        artigosConsultados: artigosInfo.length,
        tokens: { promptTokens, completionTokens, totalTokens },
        intent: intent ? {
          detected: intent.intencao,
          category: intent.categoria,
          action: intent.acao_recomendada,
          confidence: 0.8
        } : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('💥 Erro na função mestre-da-beleza-ai:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});