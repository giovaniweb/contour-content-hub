
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
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Mensagens são obrigatórias' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Adicionar informações de contexto às mensagens
    const contextualMessages = [...messages];
    
    if (scriptContent) {
      contextualMessages.splice(1, 0, {
        role: "system", 
        content: `Informações sobre o roteiro atual:\n${scriptContent}`
      });
    }
    
    if (validationResult) {
      contextualMessages.splice(1, 0, {
        role: "system", 
        content: `
          Avaliação do roteiro:
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
