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
    
    const { messages, currentPath, userProfile } = requestData;
    
    console.log('🧠 [mestre-da-beleza-ai] Consulta iniciada:', {
      messagesCount: messages?.length || 0,
      currentPath: currentPath || 'inicio',
      userProfile: userProfile || 'detectando...'
    });

    // 1. BUSCAR EQUIPAMENTOS RELEVANTES
    console.log('🔍 Buscando equipamentos no banco de dados...');
    const { data: equipamentos, error: equipError } = await supabase
      .from('equipamentos')
      .select('*')
      .eq('ativo', true)
      .eq('akinator_enabled', true);

    if (equipError) {
      console.error('❌ Erro ao buscar equipamentos:', equipError);
    }

    // 2. BUSCAR ARTIGOS CIENTÍFICOS RELEVANTES
    console.log('📚 Buscando artigos científicos...');
    const { data: artigos, error: artigosError } = await supabase
      .from('unified_documents')
      .select('titulo_extraido, texto_completo, palavras_chave, autores, equipamento_id')
      .eq('status_processamento', 'concluido')
      .eq('tipo_documento', 'artigo_cientifico')
      .limit(10);

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
- Faça perguntas inteligentes para direcionar o diagnóstico
- Use metáforas místicas mas mantenha base científica

🎯 MISSÃO PRINCIPAL:
- Conduzir consulta rápida e precisa
- Fazer perguntas diretas para diagnóstico
- Recomendar equipamentos específicos com base científica
- Ser conciso e objetivo

🔮 REGRAS DE CONDUTA:
- SEMPRE baseie recomendações nos equipamentos e artigos disponíveis
- Seja específico sobre protocolos e equipamentos
- Mantenha tom científico mas acessível
- **MÁXIMO 120 palavras por resposta**
- Use formatação simples e direta
- Faça UMA pergunta objetiva por vez
- Use bullets (•) para listas
- Destaque equipamentos com **negrito**

${baseKnowledge}

🔬 PROTOCOLOS DE DIAGNÓSTICO:
- Foque em: área, histórico, expectativas
- Considere contraindicações
- Sugira 1-2 equipamentos principais
- Seja direto e prático

FORMATO DA RESPOSTA:
- Use bullets (•) para pontos principais
- **Negrito** para equipamentos
- Máximo 3-4 bullets por resposta
- Uma pergunta direta no final

IMPORTANTE: Use APENAS os equipamentos e informações científicas fornecidas acima. NÃO invente equipamentos ou estudos.`
      },
      ...messages
    ];

    // 5. CHAMAR OPENAI
    console.log('🤖 Enviando para OpenAI...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: contextualMessages,
        temperature: 0.7,
        max_tokens: 400
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Erro na API OpenAI: ${data.error.message}`);
    }
    
    const assistantReply = data.choices[0].message.content;
    
    console.log('✨ Resposta do Mestre da Beleza gerada com sucesso');

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
        artigosConsultados: artigosInfo.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('💥 Erro na função mestre-da-beleza-ai:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});