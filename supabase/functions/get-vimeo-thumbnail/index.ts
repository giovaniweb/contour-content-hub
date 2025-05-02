
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

    const oembedData = await oembedResponse.json();
    
    // Try to get more detailed information including duration from the Vimeo API
    let duration = null;
    let description = oembedData.description || null;
    
    try {
      // Use Vimeo's video data API to get duration
      const videoApiUrl = `https://vimeo.com/api/v2/video/${videoId}.json`;
      const videoApiResponse = await fetch(videoApiUrl);
      
      if (videoApiResponse.ok) {
        const videoData = await videoApiResponse.json();
        if (videoData && videoData[0]) {
          duration = videoData[0].duration; // Duration in seconds
          
          // If we didn't get a description from oEmbed, try the API
          if (!description && videoData[0].description) {
            description = videoData[0].description;
          }
        }
      }
    } catch (apiError) {
      console.error("Erro ao buscar duração do vídeo:", apiError);
      // Continue without duration if this fails
    }
    
    // Format duration as MM:SS if available
    let formattedDuration = null;
    if (duration) {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        thumbnail_url: oembedData.thumbnail_url,
        title: oembedData.title,
        duration: formattedDuration,
        description: description
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
