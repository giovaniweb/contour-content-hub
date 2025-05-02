
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Get OpenAI API key from environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not found');
    }
    
    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
    
    // Verify JWT token to make sure the user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (userError || !user) {
      throw new Error('Invalid JWT token');
    }
    
    // Get content data from request
    const { title, equipment, bodyArea, purpose, description, type } = await req.json();
    
    // Prepare prompt for OpenAI
    const prompt = `
      Você é um assistente especializado em criar conteúdo para uma plataforma médica e estética.
      
      Com base nas informações abaixo, crie:
      1. Uma descrição detalhada profissional (2-3 parágrafos)
      2. Uma lista de 5-8 tags relevantes (palavras ou frases curtas)
      
      Informações:
      - Título: ${title}
      - Tipo de conteúdo: ${type === 'video' ? 'Vídeo pronto' : type === 'raw' ? 'Take bruto' : 'Imagem'}
      - Equipamento: ${equipment || 'Não especificado'}
      - Área do corpo: ${bodyArea || 'Não especificada'}
      - Finalidade: ${purpose || 'Não especificada'}
      - Descrição breve: ${description || 'Não fornecida'}
      
      A descrição detalhada deve ser profissional, informativa e útil para profissionais da área de estética e medicina.
      As tags devem ser relevantes para busca e categorização do conteúdo.
      
      Responda apenas com a descrição detalhada e as tags, sem introduções ou explicações adicionais.
      Formate como JSON com as chaves "detailedDescription" e "suggestedTags" (array).
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
          { role: 'system', content: 'You are a professional content creator for aesthetic and medical professionals.' },
          { role: 'user', content: prompt }
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
    
    // Try to parse the response as JSON
    let result;
    try {
      // First try to parse the generated content directly as JSON
      const content = data.choices[0].message.content.trim();
      result = JSON.parse(content);
    } catch (parseError) {
      // If direct parsing fails, try to extract JSON from the response
      console.error('Failed to parse response as JSON directly:', parseError);
      
      const content = data.choices[0].message.content.trim();
      
      // Look for JSON-like structure
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0]);
        } catch (secondParseError) {
          console.error('Failed to parse extracted JSON:', secondParseError);
          
          // Fallback: extract text manually
          const detailedDescriptionMatch = content.match(/detailedDescription["\s:]+([^"]+)/);
          const tagsMatch = content.match(/suggestedTags["\s:]+\[([\s\S]*?)\]/);
          
          result = {
            detailedDescription: detailedDescriptionMatch ? detailedDescriptionMatch[1] : 'Não foi possível gerar uma descrição.',
            suggestedTags: tagsMatch ? 
              tagsMatch[1].split(',').map(tag => tag.trim().replace(/['"]/g, '')) : 
              []
          };
        }
      } else {
        // Last resort: return reasonable defaults
        result = {
          detailedDescription: 'Não foi possível gerar uma descrição detalhada automaticamente. Por favor, adicione manualmente.',
          suggestedTags: []
        };
      }
    }
    
    // Log user action
    await supabase
      .from('logs_uso')
      .insert({
        usuario_id: user.id,
        acao: 'generate_ai_content',
        detalhe: `Generated content for: ${title}`
      })
      .select();
      
    // Return the result
    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error('Error in generate-content-description:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while generating content' 
      }),
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
