
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { buildPrompt } from "./prompt-builder.ts";
import { formatScriptResponse } from "./response-formatter.ts";
import { saveScriptToDatabase, getUserFromToken } from "./database-operations.ts";

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
      console.error("OPENAI_API_KEY não encontrado");
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY não encontrado' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Edge function iniciada");
    
    // Parse request
    let requestData;
    try {
      requestData = await req.json();
      console.log("Dados recebidos:", JSON.stringify(requestData));
    } catch (parseError) {
      console.error("Erro ao processar JSON da requisição:", parseError);
      return new Response(
        JSON.stringify({ error: "Formato de requisição inválido: não foi possível processar JSON" }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { request } = requestData;
    if (!request) {
      return new Response(
        JSON.stringify({ error: 'Formato de requisição inválido: "request" não encontrado' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { type, topic, equipment, bodyArea, purpose, additionalInfo, tone, language, marketingObjective } = request;
    
    if (!type) {
      return new Response(
        JSON.stringify({ error: '"type" é obrigatório na requisição' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Processando requisição para tipo: ${type}, tópico: ${topic}, objetivo: ${marketingObjective}`);

    // Create prompts based on script type
    const { systemPrompt, userPrompt } = buildPrompt({
      type,
      topic,
      equipment,
      bodyArea,
      purpose,
      additionalInfo,
      tone,
      language,
      marketingObjective
    });

    console.log("Enviando requisição para OpenAI");
    
    // Call OpenAI API
    let response;
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
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
    } catch (fetchError) {
      console.error("Erro na chamada à API OpenAI:", fetchError);
      return new Response(
        JSON.stringify({ error: `Erro ao conectar com API OpenAI: ${fetchError.message}` }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get response from OpenAI
    console.log("Status da resposta OpenAI:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na API OpenAI:", errorText);
      return new Response(
        JSON.stringify({ error: `Erro na API OpenAI: Status ${response.status} - ${errorText}` }), 
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    let data;
    try {
      data = await response.json();
      console.log("Resposta OpenAI recebida:", JSON.stringify(data).substring(0, 200) + "...");
    } catch (parseError) {
      console.error("Erro ao processar resposta da OpenAI:", parseError);
      return new Response(
        JSON.stringify({ error: "Resposta inválida da API OpenAI" }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (data.error) {
      console.error("Erro retornado pela API OpenAI:", data.error);
      return new Response(
        JSON.stringify({ error: `Erro na API OpenAI: ${data.error.message}` }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const content = data.choices[0].message.content;
    console.log("Conteúdo gerado com sucesso:", content.substring(0, 200) + "...");
    
    // Format the response
    const scriptResponse = formatScriptResponse({
      content, 
      type, 
      topic, 
      equipment, 
      bodyArea
    });

    // Save to database if authenticated
    try {
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL') || '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
        );
        
        const user = await getUserFromToken(supabaseAdmin, token);
        
        if (user) {
          await saveScriptToDatabase(supabaseAdmin, {
            usuario_id: user.id,
            tipo: type,
            titulo: scriptResponse.title,
            conteudo: content,
            status: 'gerado',
            objetivo_marketing: marketingObjective || null
          });
        }
      }
    } catch (dbError) {
      console.error('Erro ao salvar no banco:', dbError);
      // Continue even if db save fails
    }

    console.log("Enviando resposta para o cliente");
    
    // Return the response
    return new Response(JSON.stringify(scriptResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-script function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
