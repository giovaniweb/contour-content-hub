
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
    
    const { content, validationResult, prompt } = requestData;
    
    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Conteúdo é obrigatório' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construir o prompt para melhorar o roteiro
    let systemPrompt = prompt || `
      Você é um especialista em copywriting e roteiros de vídeo usando o método Disney.
      Sua tarefa é melhorar o roteiro fornecido mantendo a mesma mensagem principal, mas aprimorando:
      
      1. O gancho (início): Torne mais impactante e atraente
      2. O conflito: Deixe o problema mais claro e relevante
      3. A virada: Torne a solução mais convincente
      4. O CTA (call-to-action): Torne mais persuasivo e direto
      
      Mantenha o tom original e não altere informações técnicas ou específicas do produto.
      Retorne APENAS o roteiro melhorado, sem explicações adicionais.
    `;
    
    let userPrompt = `
      Roteiro original:
      ${content}
      
      ${validationResult ? `
      Resultados da validação:
      Gancho: ${validationResult.gancho}/10
      Clareza: ${validationResult.clareza}/10 
      CTA: ${validationResult.cta}/10
      Conexão Emocional: ${validationResult.emocao}/10
      
      Sugestões: ${validationResult.sugestoes || (validationResult.sugestoes_gerais ? validationResult.sugestoes_gerais.join('; ') : '')}
      ` : ''}
      
      Melhore o roteiro focando nos pontos fracos identificados. Retorne apenas o texto melhorado.
    `;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Erro na API OpenAI: ${data.error.message}`);
    }
    
    const improvedContent = data.choices[0].message.content;
    
    // Return the improved script
    return new Response(
      JSON.stringify({ improved: improvedContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro na função improve-script:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
