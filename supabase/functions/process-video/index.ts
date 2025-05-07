
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProcessVideoRequest {
  videoId: string;
  fileName: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get request body
    const requestData: ProcessVideoRequest = await req.json();
    const { videoId, fileName } = requestData;

    if (!videoId || !fileName) {
      return new Response(
        JSON.stringify({
          error: 'Missing required parameters: videoId and fileName are required.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    console.log(`Processing video ${videoId} with file name ${fileName}`);

    // Em uma implementação real, aqui teríamos:
    // 1. Download do vídeo do storage
    // 2. Uso do FFmpeg para gerar thumbnails e versões em diferentes qualidades
    // 3. Upload dos arquivos processados de volta para o storage
    // 4. Atualização do registro no banco de dados

    // Simulação do processamento com um delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Obter URLs assinados para o video
    const { data: originalUrlData } = await supabaseAdmin.storage.from('videos').createSignedUrl(fileName, 60 * 60 * 24);
    
    if (!originalUrlData?.signedUrl) {
      throw new Error("Falha ao gerar URL assinado para o vídeo original");
    }
    
    // Atualizar status do vídeo e adicionar um thumbnail e URLs assinados
    const { error: updateError } = await supabaseAdmin
      .from('videos_storage')
      .update({ 
        status: 'ready',
        thumbnail_url: 'https://placehold.co/640x360/333/FFF?text=Video+Thumbnail',
        file_urls: {
          original: originalUrlData.signedUrl,
          hd: originalUrlData.signedUrl, // Em produção, essas seriam URLs diferentes para versões transcodificadas
          sd: originalUrlData.signedUrl,
        }
      })
      .eq('id', videoId);
      
    if (updateError) {
      console.error('Erro ao atualizar registro do vídeo:', updateError);
      throw updateError;
    }

    console.log(`Video ${videoId} processed successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Video processing completed',
        videoId: videoId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error processing video:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Error processing video',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
