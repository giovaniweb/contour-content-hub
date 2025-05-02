
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    console.log("Edge function de validação iniciada");
    
    // Parse request
    let requestData;
    try {
      requestData = await req.json();
      console.log("Dados recebidos:", JSON.stringify(requestData));
    } catch (parseError) {
      console.error("Erro ao processar JSON da requisição:", parseError);
      return new Response(
        JSON.stringify({ error: "Formato de requisição inválido" }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { content, type, title } = requestData;
    
    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Conteúdo é obrigatório' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar prompt para análise do roteiro
    const systemPrompt = `
      Você é um especialista em marketing e comunicação.
      Sua tarefa é avaliar o roteiro fornecido e atribuir pontuações de 0 a 10 para os seguintes critérios:
      
      1. Gancho: O roteiro possui um gancho de abertura atraente e cativante?
      2. Clareza: A mensagem é clara e fácil de entender?
      3. CTA (Call-to-Action): Existe um chamado à ação efetivo?
      4. Emoção/Conexão: O roteiro estabelece conexão emocional com o público?
      
      Além disso, forneça sugestões específicas para melhorar o roteiro.
      
      Responda em formato JSON com as seguintes propriedades:
      {
        "gancho": número de 0 a 10,
        "clareza": número de 0 a 10,
        "cta": número de 0 a 10,
        "emocao": número de 0 a 10,
        "total": média das pontuações (número de 0 a 10),
        "sugestoes": "Sugestões de melhoria no roteiro"
      }
    `;

    const userPrompt = `
      Título do roteiro: ${title}
      Tipo de roteiro: ${type}
      
      Conteúdo:
      ${content}
      
      Por favor, avalie este roteiro segundo os critérios estabelecidos.
    `;

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
          temperature: 0.5
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
    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: `Erro na API OpenAI: Status ${response.status}` }), 
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: "Resposta inválida da API OpenAI" }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    try {
      const content = data.choices[0].message.content;
      // Tentar parsear o JSON da resposta
      const validationData = JSON.parse(content);
      
      return new Response(JSON.stringify(validationData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (jsonError) {
      console.error("Erro ao processar resposta:", jsonError);
      return new Response(
        JSON.stringify({ error: "Formato de resposta inválido da IA" }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Erro na função validate-script:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
