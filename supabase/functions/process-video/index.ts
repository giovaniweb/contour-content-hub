
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

    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Autenticação necessária');
    }

    // Extrair token JWT
    const token = authHeader.replace('Bearer ', '');
    
    // Verificar o usuário
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }

    // Verificar se o usuário é administrador
    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from('perfis')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (perfilError) {
      throw new Error('Erro ao verificar permissões');
    }
    
    // Apenas administradores podem processar vídeos
    if (perfil?.role !== 'admin') {
      return new Response(
        JSON.stringify({
          error: 'Permissão negada. Apenas administradores podem processar vídeos.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      );
    }

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

    console.log(`Iniciando processamento do vídeo ${videoId} com nome de arquivo ${fileName}`);

    // Registrar tempo de início para calcular duração total
    const startTime = Date.now();
    
    // Verificar se o vídeo existe
    const { data: videoData, error: videoError } = await supabaseAdmin
      .from('videos_storage')
      .select('*')
      .eq('id', videoId)
      .single();
      
    if (videoError || !videoData) {
      throw new Error(`Vídeo não encontrado: ${videoId}`);
    }
    
    // Atualizar o status inicial para processamento
    await supabaseAdmin
      .from('videos_storage')
      .update({ 
        status: 'processing',
        metadata: { 
          processing_start_time: new Date().toISOString(),
          processing_progress: 'Iniciando processamento...',
          processing_estimated_time: '1-2 minutos'
        }
      })
      .eq('id', videoId);

    // Simular processamento com um delay
    // Reduzido para 2 segundos para melhorar a experiência do usuário
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Registre o progresso do processamento - Fase 1: Thumbnails
    console.log(`[${videoId}] Processamento: Gerando thumbnails...`);
    await Promise.all([
      supabaseAdmin
        .from('videos_storage')
        .update({ 
          metadata: { 
            processing_progress: 'Gerando miniaturas...',
            processing_percent: 20,
            processing_stage: 1,
            processing_estimated_time: 'Aproximadamente 1 minuto restante'
          }
        })
        .eq('id', videoId),
      new Promise(resolve => setTimeout(resolve, 500))
    ]);

    // Obter URLs assinados para o video
    console.log(`[${videoId}] Processamento: Gerando URLs assinados...`);
    const { data: originalUrlData, error: urlError } = await supabaseAdmin.storage.from('videos').createSignedUrl(fileName, 60 * 60 * 24);
    
    if (urlError || !originalUrlData?.signedUrl) {
      console.error("Erro ao gerar URL assinado:", urlError);
      throw new Error("Falha ao gerar URL assinado para o vídeo original");
    }

    // Obter URL público para o vídeo
    const publicUrl = supabaseAdmin.storage.from('videos').getPublicUrl(fileName).data.publicUrl;

    // Simular processamento de qualidade HD - Fase 2
    console.log(`[${videoId}] Processamento: Gerando versão HD...`);
    await Promise.all([
      supabaseAdmin
        .from('videos_storage')
        .update({ 
          metadata: { 
            processing_progress: 'Gerando versão HD...',
            processing_percent: 50,
            processing_stage: 2, 
            processing_estimated_time: 'Aproximadamente 40 segundos restantes'
          }
        })
        .eq('id', videoId),
      new Promise(resolve => setTimeout(resolve, 500))
    ]);

    // Simulação do processamento de qualidade SD - Fase 3
    console.log(`[${videoId}] Processamento: Gerando versão SD...`);
    await Promise.all([
      supabaseAdmin
        .from('videos_storage')
        .update({ 
          metadata: { 
            processing_progress: 'Gerando versão SD...',
            processing_percent: 80,
            processing_stage: 3,
            processing_estimated_time: 'Aproximadamente 15 segundos restantes'
          }
        })
        .eq('id', videoId),
      new Promise(resolve => setTimeout(resolve, 500))
    ]);
    
    // Calcular duração total do processamento
    const processingDuration = Date.now() - startTime;
    const durationSeconds = Math.round(processingDuration / 1000);
    
    // CORREÇÃO: Atualizar vídeo para status 'ready' com todas as URLs necessárias
    console.log(`[${videoId}] Processamento: Finalizando...`);
    const { error: updateError } = await supabaseAdmin
      .from('videos_storage')
      .update({ 
        status: 'ready',
        thumbnail_url: 'https://placehold.co/640x360/333/FFF?text=Video+Thumbnail',
        file_urls: {
          original: publicUrl, // Usar URL público em vez de URL assinado
          hd: publicUrl,
          sd: publicUrl,
        },
        metadata: { 
          processing_progress: 'Concluído',
          processing_percent: 100,
          processing_stage: 4,
          processing_completed_at: new Date().toISOString(),
          processing_duration_seconds: durationSeconds
        }
      })
      .eq('id', videoId);
      
    if (updateError) {
      console.error('Erro ao atualizar registro do vídeo:', updateError);
      throw updateError;
    }

    // Atualizar também a tabela videos se existir um registro correspondente
    try {
      const { error: videoUpdateError } = await supabaseAdmin
        .from('videos')
        .update({
          url_video: publicUrl,
          preview_url: 'https://placehold.co/640x360/333/FFF?text=Video+Thumbnail'
        })
        .eq('id', videoId);
        
      if (videoUpdateError) {
        console.warn('Aviso: Não foi possível atualizar a tabela videos:', videoUpdateError);
      }
    } catch (err) {
      console.warn('Tabela videos pode não existir ou não ter este registro:', err);
    }

    console.log(`Vídeo ${videoId} processado com sucesso em ${durationSeconds} segundos`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Video processing completed',
        videoId: videoId,
        publicUrl: publicUrl,
        processingTime: `${durationSeconds} segundos`
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
