
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const { folderPath, limit = 20, page = 1 } = await req.json();

    // Create a Supabase client to fetch Vimeo configuration
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get Vimeo configuration from database
    const { data: vimeoConfigData, error: configError } = await supabase
      .from('integracao_configs')
      .select('config')
      .eq('tipo', 'vimeo')
      .maybeSingle();
      
    if (configError || !vimeoConfigData?.config?.access_token) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Configuração do Vimeo não encontrada. Por favor, configure o token de acesso." 
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    const vimeoToken = vimeoConfigData.config.access_token;
    
    // Determine folder path - if specified in request, use it, otherwise use from config
    const folderPathToUse = folderPath || vimeoConfigData.config.folder_id || null;
    
    // Base API URL for Vimeo
    let apiUrl = 'https://api.vimeo.com/me/videos';
    
    // If a folder path is specified, use the folders endpoint
    if (folderPathToUse) {
      apiUrl = `https://api.vimeo.com/me/folders/${folderPathToUse}/videos`;
    }
    
    // Add pagination params
    apiUrl += `?per_page=${limit}&page=${page}`;
    
    // Fetch videos from Vimeo API
    const vimeoResponse = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${vimeoToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!vimeoResponse.ok) {
      const errorData = await vimeoResponse.text();
      console.error(`Vimeo API error: ${vimeoResponse.status}`, errorData);
      throw new Error(`Falha ao buscar vídeos do Vimeo: ${vimeoResponse.status}`);
    }
    
    const vimeoData = await vimeoResponse.json();
    
    // Map Vimeo response to our format
    const videos = vimeoData.data.map((video: any) => ({
      id: video.uri.split('/').pop(),
      title: video.name,
      description: video.description,
      thumbnail_url: video.pictures?.sizes?.[3]?.link || null,
      duration: video.duration,
      upload_date: video.created_time.split('T')[0],
      video_url: video.link
    }));
    
    const responseData = {
      success: true,
      data: {
        videos,
        pagination: {
          total: vimeoData.total,
          page: vimeoData.page,
          per_page: vimeoData.per_page,
          total_pages: Math.ceil(vimeoData.total / vimeoData.per_page)
        }
      }
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error in vimeo-batch-import function:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Falha ao importar vídeos do Vimeo'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
