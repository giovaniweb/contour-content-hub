
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    
    const { messages, scriptContent, validationResult } = requestData;
    
    console.log('📥 [chat-assistant] Dados recebidos:', {
      messagesCount: messages?.length || 0,
      scriptContentLength: scriptContent?.length || 0,
      scriptContentPreview: scriptContent ? scriptContent.substring(0, 200) + '...' : 'Sem conteúdo',
      hasValidationResult: !!validationResult
    });
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Mensagens são obrigatórias' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sistema anti-alucinação e contexto científico
    const contextualMessages = [
      {
        role: "system",
        content: `Você é um assistente científico especializado em análise de documentos médicos e estéticos. 

REGRAS CRÍTICAS ANTI-ALUCINAÇÃO:
1. RESPONDA APENAS com base no conteúdo do documento fornecido
2. NUNCA invente marcas, equipamentos ou produtos que não estejam explicitamente mencionados no documento
3. Quando não souber algo específico, responda: "Baseado no conteúdo fornecido, não encontro informações detalhadas sobre [tópico solicitado]. O documento menciona [o que realmente está disponível]."
4. JAMAIS cite equipamentos específicos que não estejam no texto original
5. Mantenha-se estritamente dentro do contexto do documento científico
6. Quando perguntado sobre metodologia, analise cuidadosamente todo o conteúdo em busca de informações sobre métodos, procedimentos, critérios de seleção, coleta de dados, análise estatística, etc.

EQUIPAMENTOS PRIORITÁRIOS DO SISTEMA:
Quando mencionar tratamentos, sempre priorize e sugira os equipamentos cadastrados no sistema Fluida como alternativas baseadas em evidências científicas.

FORMATO DE RESPOSTA:
- Máximo 300 palavras
- Use markdown para formatação
- Seja conciso e objetivo
- Baseie-se apenas no conteúdo científico fornecido
- Se for uma pergunta sobre metodologia, procure por: métodos, procedimentos, critérios, análise estatística, participantes, instrumentos usados`
      },
      ...messages
    ];
    
    if (scriptContent) {
      contextualMessages.splice(1, 0, {
        role: "system", 
        content: `DOCUMENTO CIENTÍFICO PARA ANÁLISE:\n${scriptContent}\n\nIMPORTANTE: Baseie suas respostas EXCLUSIVAMENTE neste conteúdo. Não invente informações.`
      });
    }
    
    if (validationResult) {
      contextualMessages.splice(1, 0, {
        role: "system", 
        content: `
          Avaliação do documento:
          Gancho: ${validationResult.gancho}/10
          Clareza: ${validationResult.clareza}/10
          CTA: ${validationResult.cta}/10
          Conexão Emocional: ${validationResult.emocao}/10
          Score Total: ${validationResult.total || validationResult.nota_geral || 0}/10
          
          Sugestões: ${validationResult.sugestoes || 
            (Array.isArray(validationResult.sugestoes_gerais) ? 
              validationResult.sugestoes_gerais.join('; ') : '')}
        `
      });
    }

    // Call OpenAI API
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
        max_tokens: 800
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Erro na API OpenAI: ${data.error.message}`);
    }
    
    const assistantReply = data.choices[0].message.content;
    
    // Return the assistant's reply
    return new Response(
      JSON.stringify({ content: assistantReply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro na função chat-assistant:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
