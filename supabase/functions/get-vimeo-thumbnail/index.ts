
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
    // Parse request body
    const { url } = await req.json();
    
    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ error: 'URL inválida' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract Vimeo video ID
    const vimeoIdMatch = url.match(/vimeo\.com\/(\d+)|player\.vimeo\.com\/video\/(\d+)/);
    if (!vimeoIdMatch) {
      return new Response(
        JSON.stringify({ error: 'URL do Vimeo inválida' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the ID from whichever group matched
    const videoId = vimeoIdMatch[1] || vimeoIdMatch[2];

    // Use Vimeo oEmbed API to get video information
    const oembedUrl = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`;
    const oembedResponse = await fetch(oembedUrl);
    
    if (!oembedResponse.ok) {
      throw new Error(`Erro ao buscar informações do vídeo: ${oembedResponse.statusText}`);
    }

    const videoData = await oembedResponse.json();
    
    return new Response(
      JSON.stringify({
        success: true,
        thumbnail_url: videoData.thumbnail_url,
        title: videoData.title,
        duration: null, // Vimeo oEmbed doesn't provide duration
        description: videoData.description || null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Erro:", error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
