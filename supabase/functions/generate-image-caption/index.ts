import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const { imageUrl, style = 'criativo', audience = 'geral', equipments = [] } = await req.json();

    if (!imageUrl) {
      throw new Error('imageUrl is required');
    }

    // Prompts personalizados baseados no estilo e audiência
    const stylePrompts = {
      criativo: "Crie uma legenda criativa e envolvente",
      profissional: "Escreva uma legenda profissional e informativa", 
      casual: "Faça uma legenda descontraída e amigável",
      inspiracional: "Elabore uma legenda motivacional e inspiradora"
    };

    const audiencePrompts = {
      geral: "para o público geral",
      jovem: "direcionada para jovens (18-30 anos)",
      corporativo: "para ambiente corporativo e B2B",
      lifestyle: "para audiência interessada em estilo de vida"
    };

    // Construir prompt adicional para equipamentos
    let equipmentContext = '';
    if (equipments && equipments.length > 0) {
      equipmentContext = `
      
CONTEXTO IMPORTANTE: Esta imagem está relacionada aos seguintes equipamentos estéticos/médicos:
${equipments.map((eq: string) => `- ${eq}`).join('\n')}

Ao criar a legenda:
- Mencione os benefícios específicos desses equipamentos quando relevante
- Use terminologia técnica apropriada para o público
- Inclua hashtags relacionadas aos equipamentos e procedimentos
- Foque nos resultados e transformações que esses equipamentos proporcionam
`;
    }

    const systemPrompt = `Você é um especialista em marketing digital e criação de conteúdo para Instagram especializado em estética e equipamentos médicos. 
    Analise a imagem fornecida e ${stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.criativo} 
    ${audiencePrompts[audience as keyof typeof audiencePrompts] || audiencePrompts.geral}.${equipmentContext}

    Regras importantes:
    - Máximo 150 palavras na legenda
    - Inclua 8-12 hashtags relevantes (misture hashtags gerais e específicas dos equipamentos)
    - Use emojis apropriados para o contexto estético/médico
    - Seja autêntico e engajante
    - Inclua uma call-to-action sutil (ex: "Agende sua consulta", "Saiba mais nos comentários")
    - Se houver equipamentos mencionados, destaque os benefícios e resultados
    
    Formato da resposta:
    [LEGENDA]
    
    [HASHTAGS]`;

    console.log('Analyzing image:', imageUrl);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analise esta imagem e crie uma legenda para Instagram seguindo as instruções.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    const generatedContent = data.choices[0].message.content;
    
    // Parse the response to separate caption and hashtags
    const parts = generatedContent.split('[HASHTAGS]');
    const caption = parts[0].replace('[LEGENDA]', '').trim();
    const hashtags = parts[1] ? parts[1].trim() : '';

    console.log('Caption generated successfully');

    return new Response(JSON.stringify({ 
      success: true,
      caption,
      hashtags,
      full_content: generatedContent,
      usage: data.usage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-image-caption function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});