
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
    // Get the vimeo video ID from the request
    const { vimeoId } = await req.json();
    
    if (!vimeoId) {
      throw new Error('Vimeo ID is required');
    }
    
    console.log(`Fetching Vimeo video with ID: ${vimeoId}`);
    
    // Fetch video data from Vimeo's oEmbed API (public API that doesn't require authentication)
    // Adicionando cache-busting parameter para prevenir problemas de cache
    const vimeoResponse = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}&_=${Date.now()}`);
    
    if (!vimeoResponse.ok) {
      const errorText = await vimeoResponse.text();
      console.error(`Vimeo API error: ${vimeoResponse.status}`, errorText);
      throw new Error(`Failed to fetch Vimeo video: ${vimeoResponse.status}`);
    }
    
    const vimeoData = await vimeoResponse.json();
    
    console.log("Successfully fetched Vimeo data:", JSON.stringify(vimeoData).substring(0, 200) + "...");
    
    // Extract useful information
    const videoMetadata = {
      title: vimeoData.title || '',
      description: vimeoData.description || '',
      thumbnailUrl: vimeoData.thumbnail_url || '',
      authorName: vimeoData.author_name || '',
      videoUrl: `https://vimeo.com/${vimeoId}`,
      vimeoId,
      width: vimeoData.width,
      height: vimeoData.height,
      // Campos adicionais para evitar erros no processamento
      upload_date: vimeoData.upload_date || new Date().toISOString().split('T')[0],
      duration: vimeoData.duration || 0
    };

    return new Response(JSON.stringify({ 
      success: true, 
      data: videoMetadata 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error in vimeo-import function:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to import video from Vimeo'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
