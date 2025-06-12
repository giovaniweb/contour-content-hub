
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    console.log("🖼️ FLUIDAROTEIRISTA - Geração de imagem iniciada");
    
    // Validate OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY não configurada');
    }
    
    // Parse request
    const { script, customPrompt } = await req.json();
    
    if (!script && !customPrompt) {
      throw new Error('Script ou prompt customizado é obrigatório');
    }

    // Generate image prompt based on script content
    let imagePrompt = customPrompt;
    
    if (!imagePrompt && script) {
      // Extract key elements from script for image generation
      const tema = script.objetivo || script.roteiro?.substring(0, 100) || '';
      const formato = script.formato || 'carrossel';
      const emocao = script.emocao_central || 'profissional';
      
      imagePrompt = `Professional aesthetic clinic social media post for ${formato}, 
        theme: ${tema}, 
        emotion: ${emocao}, 
        modern design, clean aesthetics, beauty treatment, 
        high quality, professional photography style, 
        elegant typography space for text overlay, 
        pastel colors, minimalist, Instagram-ready`;
    }

    console.log("🎨 Prompt gerado:", imagePrompt);

    // Call OpenAI Image API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: imagePrompt,
        n: 1,
        size: '1024x1024',
        quality: 'high',
        output_format: 'png'
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Erro OpenAI Image API:', error);
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const result = await response.json();
    console.log("✅ Imagem gerada com sucesso");

    return new Response(JSON.stringify({
      success: true,
      imageUrl: result.data[0].url,
      prompt: imagePrompt
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("🔥 Erro na geração de imagem:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
