
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

    const { prompt } = await req.json();

    if (!prompt) {
      throw new Error("Prompt é obrigatório");
    }

    console.log("Gerando descrição de imagem com prompt:", prompt);

    // Call OpenAI to generate image description
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "Você é um especialista em criação de conteúdo visual para redes sociais. Gere descrições detalhadas e criativas para imagens baseadas no roteiro fornecido. Sempre responda em português brasileiro." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const imageDescription = data.choices[0].message.content;

    console.log("Descrição gerada:", imageDescription);

    // Log the request for monitoring
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    try {
      await supabaseAdmin.from('logs_uso').insert({
        acao: 'generate_image_description',
        detalhe: 'Geração de descrição de imagem baseada em roteiro',
        usuario_id: null // This would ideally be the user ID from the request
      });
    } catch (logError) {
      console.error("Error logging usage:", logError);
      // Continue even if logging fails
    }

    // Return the generated image description
    return new Response(
      JSON.stringify({ 
        imageDescription,
        success: true 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
