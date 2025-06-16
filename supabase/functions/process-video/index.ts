
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
    
    // Obter URL público para o vídeo
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('videos')
      .getPublicUrl(fileName);
    
    const publicUrl = publicUrlData.publicUrl;
    console.log('🔗 URL público obtido:', publicUrl);

    // Fase 2: Gerando thumbnail (simulado)
    console.log('🖼️ Fase 2: Gerando thumbnail...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Para demonstração, usar um placeholder. Em produção, você geraria uma thumbnail real
    const thumbnailUrl = 'https://via.placeholder.com/640x360/333333/FFFFFF?text=Video+Thumbnail';
    
    // Fase 3: Processamento de qualidades (simulado)
    console.log('⚙️ Fase 3: Processando qualidades...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Calcular duração total do processamento
    const processingDuration = Date.now() - startTime;
    const durationSeconds = Math.round(processingDuration / 1000);
    
    // Atualizar vídeo com URLs processados na tabela videos
    console.log('💾 Atualizando registro do vídeo...');
    const { error: updateError } = await supabaseAdmin
      .from('videos')
      .update({ 
        url_video: publicUrl,
        preview_url: thumbnailUrl,
        // Adicionar metadados de processamento se necessário
      })
      .eq('id', videoId);
      
    if (updateError) {
      console.error('❌ Erro ao atualizar registro do vídeo:', updateError);
      throw updateError;
    }

    console.log(`✅ Vídeo ${videoId} processado com sucesso em ${durationSeconds} segundos`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Video processing completed',
        videoId: videoId,
        publicUrl: publicUrl,
        thumbnailUrl: thumbnailUrl,
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
