
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    if (!openAIApiKey) {
      throw new Error("OPENAI_API_KEY não está configurada");
    }

    const { linha, equipamento, categoria, formato, objetivo, impedimento, prioridade } = await req.json();

    // Build the prompt
    const systemPrompt = `Você é um especialista em marketing para clínicas de estética que oferece ideias de conteúdo estratégico. 
Seu objetivo é criar descrições de conteúdo que contenham ideias criativas, adaptadas ao formato solicitado.`;

    const userPrompt = `Crie uma descrição detalhada de conteúdo com as seguintes características:
${linha ? `- Linha/Marca: ${linha}` : ''}
${equipamento ? `- Equipamento: ${equipamento}` : ''}
- Categoria de conteúdo: ${categoria || 'Não especificado'}
- Formato desejado: ${formato || 'Não especificado'}
- Objetivo de marketing: ${objetivo || 'Não especificado'}
${impedimento ? `- Considerações especiais: ${impedimento}` : ''}
- Prioridade: ${prioridade || 'Média'}

Forneça uma descrição clara e atraente para este conteúdo, incluindo ideias para hooks, pontos principais a abordar e uma conclusão com chamada para ação.
Use linguagem persuasiva e focada em resultados.
Limite-se a no máximo 300 palavras.`;

    // Call OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Log the request for monitoring
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    try {
      await supabaseAdmin.from('logs_uso').insert({
        acao: 'generate_content',
        detalhe: `Geração de descrição de conteúdo para ${formato || 'não especificado'}`,
        usuario_id: null // This would ideally be the user ID from the request
      });
    } catch (logError) {
      console.error("Error logging usage:", logError);
      // Continue even if logging fails
    }

    // Return the generated content
    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
