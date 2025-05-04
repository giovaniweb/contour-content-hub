
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get OpenAI API key from environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not found');
    }

    // Get video data and equipment info from request
    const { 
      videoMetadata, 
      equipmentData 
    } = await req.json();
    
    if (!videoMetadata || !equipmentData) {
      throw new Error('Both video metadata and equipment data are required');
    }
    
    console.log("Processing content generation for video:", videoMetadata.title);
    console.log("With equipment data:", JSON.stringify(equipmentData).substring(0, 200) + "...");
    
    // Build the prompt for OpenAI
    const systemPrompt = `
      Você é uma IA que auxilia o sistema Fluida a completar os dados de um vídeo importado do Vimeo. 
      O vídeo está relacionado a um equipamento estético utilizado em clínicas. 
      O conteúdo precisa ser adaptado para o público leigo e otimizado para redes sociais.
      
      Com base nos dados fornecidos, gere os seguintes campos:
      1. Descrição curta do vídeo (máx. 150 caracteres)
      2. Descrição longa com linguagem simples, emocional e informativa
      3. Finalidade do tratamento abordado no vídeo (ex: flacidez, rugas, gordura localizada, lipedema, sarcopenia)
      4. Área do corpo tratada (ex: rosto, abdômen, glúteos, braços)
      5. Tipo de vídeo: \`take\` (bruto) ou \`vídeo pronto\`
      6. Tags (máx. 5 palavras-chave relevantes)
      7. Legenda para Instagram com tom de influenciador + gancho forte
      8. Título otimizado para o vídeo
      
      Adapte o texto como se estivesse falando com o cliente final (público leigo).
      Escreva com leveza, mas de forma persuasiva e criativa.
      Legenda do Instagram deve ser curta, com impacto e tom de influenciador estético.
      
      Retorne um objeto JSON estruturado exatamente como no exemplo abaixo:
      
      {
        "descricao_curta": "...",
        "descricao_longa": "...",
        "finalidade": ["..."],
        "area_tratada": ["..."],
        "tipo_video": "...",
        "tags": ["...", "..."],
        "legenda_instagram": "...",
        "titulo_otimizado": "..."
      }
    `;
    
    const userPrompt = `
      VÍDEO DO VIMEO:
      - Título original: ${videoMetadata.title}
      - Descrição original: ${videoMetadata.description || 'N/A'}
      - Link: ${videoMetadata.videoUrl}
      
      DADOS DO EQUIPAMENTO:
      - Nome: ${equipmentData.nome || 'N/A'}
      - Tecnologia: ${equipmentData.tecnologia || 'N/A'}
      - Indicações: ${equipmentData.indicacoes?.join(', ') || 'N/A'}
      - Benefícios: ${equipmentData.beneficios?.join(', ') || 'N/A'}
      - Áreas de aplicação: ${equipmentData.areas?.join(', ') || 'N/A'}
      
      Se a descrição do Vimeo estiver vazia ou for genérica, baseie-se no nome do equipamento e nas indicações para gerar as informações.
    `;
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    // Parse the JSON response
    let enhancedMetadata;
    try {
      enhancedMetadata = JSON.parse(generatedContent);
      console.log("Successfully generated enhanced content");
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // Try to extract JSON from the response using regex
      const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          enhancedMetadata = JSON.parse(jsonMatch[0]);
          console.log("Successfully extracted JSON from AI response");
        } catch (secondParseError) {
          throw new Error("Failed to parse AI response");
        }
      } else {
        throw new Error("AI response did not contain valid JSON");
      }
    }

    // Return the video data and the enhanced metadata
    return new Response(JSON.stringify({
      success: true,
      data: {
        videoMetadata,
        enhancedMetadata
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error in generate-video-content function:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'An error occurred while generating content' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
