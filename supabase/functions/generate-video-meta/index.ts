
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { filename } = await req.json();
    
    if (!filename) {
      throw new Error('Filename is required');
    }
    
    // Limpar o nome do arquivo (remover extensão e substituir hífens e underscores por espaços)
    const cleanFilename = filename
      .replace(/\.[^.]+$/, '') // remover extensão
      .replace(/[-_]/g, ' '); // substituir hífens e underscores por espaços
    
    console.log(`Generating metadata for filename: ${cleanFilename}`);
    
    // Chamar a API da OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um especialista em estética e dermatologia. Gere um título profissional e uma descrição detalhada para um vídeo baseado no nome do arquivo fornecido. O título deve ser conciso e atrativo. A descrição deve ter 2-3 frases que expliquem o procedimento, seus benefícios e resultados esperados em linguagem profissional.'
          },
          { 
            role: 'user', 
            content: `Gere um título e descrição para um vídeo de procedimento estético com o nome: "${cleanFilename}"`
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }
    
    const generatedContent = data.choices[0].message.content;
    
    // Extrair título e descrição do texto gerado
    let title = '';
    let description = '';
    
    // Tentar extrair título e descrição usando regex
    const titleMatch = generatedContent.match(/título:?\s*(.*?)(?:\n|$)/i);
    const descriptionMatch = generatedContent.match(/descrição:?\s*([\s\S]*?)(?:\n\n|$)/i);
    
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
    } else {
      // Se não encontrar o formato esperado, usar a primeira linha como título
      const lines = generatedContent.split('\n').filter((line: string) => line.trim());
      if (lines.length > 0) {
        title = lines[0].trim();
      }
    }
    
    if (descriptionMatch && descriptionMatch[1]) {
      description = descriptionMatch[1].trim();
    } else {
      // Se não encontrar o formato esperado, usar o resto do texto como descrição
      const lines = generatedContent.split('\n').filter((line: string) => line.trim());
      if (lines.length > 1) {
        description = lines.slice(1).join('\n').trim();
      }
    }
    
    console.log('Generated title:', title);
    console.log('Generated description:', description);
    
    return new Response(
      JSON.stringify({ 
        title, 
        description,
        rawResponse: generatedContent
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error: any) {
    console.error('Error in generate-video-meta function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
