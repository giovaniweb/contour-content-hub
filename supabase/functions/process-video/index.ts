
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProcessVideoRequest {
  videoId: string;
  fileName: string;
}

// Nova função para simular a geração de thumbnail
async function generateActualThumbnail(videoBlob: Blob, videoId: string): Promise<string | null> {
  console.log(`💡 Tentando gerar thumbnail real para o vídeo ID: ${videoId}...`);
  // Simulação: Aqui ocorreria a lógica real de extração de frame com FFmpeg ou similar
  console.log('[SIMULAÇÃO] Geração real de thumbnail ocorreria aqui usando uma ferramenta como FFmpeg.');

  // Para simular sucesso ou falha, podemos adicionar uma lógica aleatória ou fixa
  // Por enquanto, vamos retornar um placeholder de sucesso para testar o fluxo
  // Em um cenário real, se a geração falhar, retorne null
  // return null;
  return `https://via.placeholder.com/640x360/00FF00/000000?text=Generated+Thumbnail+Attempt-${videoId}`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Iniciando função process-video');
    
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

    console.log('✅ Usuário autenticado:', user.id);

    // Verificar se o usuário é administrador
    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from('perfis')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (perfilError) {
      console.error('❌ Erro ao verificar perfil:', perfilError);
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

    console.log('✅ Usuário autorizado como admin');

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

    console.log(`📝 Processando vídeo ID: ${videoId}, Arquivo: ${fileName}`);

    // Registrar tempo de início para calcular duração total
    const startTime = Date.now();
    
    // Verificar se o vídeo existe na tabela videos (não videos_storage)
    const { data: videoData, error: videoError } = await supabaseAdmin
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();
      
    if (videoError || !videoData) {
      console.error('❌ Vídeo não encontrado:', videoError);
      throw new Error(`Vídeo não encontrado: ${videoId}`);
    }
    
    console.log('✅ Vídeo encontrado na base de dados');
    
    // Simular processamento com progresso
    console.log('🔄 Iniciando processamento...');
    
    // Fase 1: Verificação do arquivo
    console.log('📋 Fase 1: Verificando arquivo...');
    
    // Verificar se o arquivo existe no storage
    const { data: fileData, error: fileError } = await supabaseAdmin.storage
      .from('videos')
      .list('', {
        search: fileName
      });
    
    if (fileError || !fileData?.find(f => f.name === fileName)) {
      console.error('❌ Arquivo não encontrado no storage:', fileError);
      throw new Error(`Arquivo não encontrado no storage: ${fileName}`);
    }
    
    console.log('✅ Arquivo verificado no storage');

    let thumbnailUrlToUpdate = videoData.thumbnail_url; // Presume que vamos manter a existente
    let skipThumbnailGeneration = false;

    const knownPlaceholderPatterns = [
      "https://via.placeholder.com/640x360/FF0000/", // Base para falhas (Generation Failed, Upload Failed, Process Error)
      "https://via.placeholder.com/640x360/333333/FFFFFF?text=Video+Thumbnail" // Placeholder antigo original
    ];

    if (videoData.thumbnail_url &&
        videoData.thumbnail_url.trim() !== '' &&
        !knownPlaceholderPatterns.some(pattern => videoData.thumbnail_url.startsWith(pattern))) {

      console.log(`Thumbnail válida já existe para o vídeo ID ${videoId}: ${videoData.thumbnail_url}. Pulando geração de nova thumbnail.`);
      skipThumbnailGeneration = true;
    } else {
      console.log(`Não foi encontrada thumbnail válida ou é um placeholder para o vídeo ID ${videoId} (URL atual: ${videoData.thumbnail_url}). Tentando gerar uma nova.`);
      // thumbnailUrlToUpdate será definida pela lógica de geração abaixo
    }

    if (!skipThumbnailGeneration) {
      console.log('💡 Iniciando tentativa de geração de thumbnail real...');
      try {
        console.log(`⬇️ Baixando vídeo ${fileName} do storage...`);
        const { data: videoBlob, error: downloadError } = await supabaseAdmin.storage
          .from('videos')
          .download(fileName);

        if (downloadError || !videoBlob) {
          console.error('❌ Erro ao baixar vídeo do storage:', downloadError);
          throw new Error(`Falha ao baixar vídeo: ${fileName}`);
        }
        console.log('✅ Vídeo baixado com sucesso.');

        const generatedThumbnailUrl = await generateActualThumbnail(videoBlob, videoId);

        if (generatedThumbnailUrl) {
          console.log('🖼️ Thumbnail (simulada) gerada/tentada:', generatedThumbnailUrl);
          const thumbnailFileName = `thumbnails/${videoId}-thumbnail.png`;
          const simulatedThumbnailBlob = new Blob(["simulated thumbnail content"], { type: "image/png" });

          console.log(`⬆️ Fazendo upload da thumbnail simulada para: ${thumbnailFileName}`);
          const { error: uploadThumbError } = await supabaseAdmin.storage
            .from('videos')
            .upload(thumbnailFileName, simulatedThumbnailBlob, {
              contentType: 'image/png',
              upsert: true,
            });

          if (uploadThumbError) {
            console.error('❌ Erro ao fazer upload da thumbnail simulada:', uploadThumbError);
            thumbnailUrlToUpdate = `https://via.placeholder.com/640x360/FF0000/FFFFFF?text=Thumbnail+Upload+Failed`;
          } else {
            const { data: publicThumbUrlData } = supabaseAdmin.storage
              .from('videos')
              .getPublicUrl(thumbnailFileName);
            thumbnailUrlToUpdate = publicThumbUrlData.publicUrl;
            console.log('✅ Thumbnail simulada enviada e URL pública obtida:', thumbnailUrlToUpdate);
          }
        } else {
          console.log('⚠️ Geração de thumbnail real retornou null (simulando falha).');
          thumbnailUrlToUpdate = `https://via.placeholder.com/640x360/FF0000/FFFFFF?text=Thumbnail+Generation+Failed`;
        }
      } catch (thumbError) {
        console.error('💥 Erro durante o processo de geração de thumbnail:', thumbError);
        thumbnailUrlToUpdate = `https://via.placeholder.com/640x360/FF0000/FFFFFF?text=Thumbnail+Process+Error`;
      }
    }
    
    // Obter URL público para o vídeo principal
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('videos')
      .getPublicUrl(fileName);
    const publicUrl = publicUrlData.publicUrl;
    console.log('🔗 URL público do vídeo obtido:', publicUrl);
    
    // Fase de Processamento de qualidades (simulado)
    console.log('⚙️ Processando qualidades (simulado)...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Calcular duração total do processamento
    const processingDuration = Date.now() - startTime;
    const durationSeconds = Math.round(processingDuration / 1000);
    
    // Atualizar vídeo com URLs processados na tabela videos
    console.log(`💾 Atualizando registro do vídeo ${videoId} com thumbnail: ${thumbnailUrlToUpdate}`);
    const { error: updateError } = await supabaseAdmin
      .from('videos')
      .update({ 
        url_video: publicUrl, // URL do vídeo principal
        preview_url: thumbnailUrlToUpdate, // URL da thumbnail existente ou nova/falha
        thumbnail_url: thumbnailUrlToUpdate, // Garantir que thumbnail_url também seja atualizado
        // Adicionar metadados de processamento se necessário
      })
      .eq('id', videoId);
      
    if (updateError) {
      console.error(`❌ Erro ao atualizar registro do vídeo ${videoId}:`, updateError);
      throw updateError;
    }

    console.log(`✅ Vídeo ${videoId} processado com sucesso em ${durationSeconds} segundos`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Video processing completed',
        videoId: videoId,
        publicUrl: publicUrl,
        thumbnailUrl: thumbnailUrlToUpdate, // Retornar a URL da thumbnail que foi usada
        processingTime: `${durationSeconds} segundos`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('💥 Erro no processamento do vídeo:', error);
    
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
