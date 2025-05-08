
import { supabase } from '@/integrations/supabase/client';
import { 
  VideoMetadata, 
  VideoStatus, 
  VideoQuality,
  StoredVideo 
} from '@/types/video-storage';
import { MAX_FILE_SIZE, ALLOWED_MIME_TYPES } from './types';

/**
 * Uploads a single video file to storage
 */
export async function uploadVideo(
  file: File,
  title: string,
  description: string,
  tags: string[],
  onProgress?: (progress: number) => void,
  isPublic: boolean = false
): Promise<{ success: boolean; videoId?: string; error?: string; metadata?: VideoMetadata }> {
  try {
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: `O arquivo excede o tamanho máximo permitido (100MB)` };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { success: false, error: 'Formato de arquivo não suportado. Use MP4, MOV, AVI ou MKV.' };
    }

    // Extract equipment tag if present (assuming equipment names are in the tags)
    const equipmentTag = tags.length > 0 ? tags[tags.length - 1] : null;
    
    // 1. Criar entrada no banco para o vídeo com status 'uploading'
    const { data: videoData, error: dbError } = await supabase
      .from('videos_storage')
      .insert({
        title,
        description,
        owner_id: (await supabase.auth.getUser()).data.user?.id,
        status: 'uploading' as VideoStatus,
        size: file.size,
        tags,
        public: isPublic,
        metadata: {
          original_filename: file.name,
          upload_started_at: new Date().toISOString(),
          file_type: file.type,
          processing_status: 'iniciando upload'
        }
      })
      .select()
      .single();

    if (dbError || !videoData) {
      console.error('Erro ao criar registro do vídeo:', dbError);
      return { success: false, error: 'Erro ao iniciar upload. Por favor, tente novamente.' };
    }

    // 2. Upload do arquivo para o Storage
    const fileName = `${videoData.id}/original_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Atualizando status durante upload
    await supabase
      .from('videos_storage')
      .update({ 
        metadata: { 
          ...videoData.metadata as object,
          processing_status: 'enviando arquivo para storage' 
        } 
      })
      .eq('id', videoData.id);
    
    // Implementar um mecanismo de acompanhamento de progresso mais preciso
    let uploadProgress = 0;
    const uploadStartTime = Date.now();
    
    // Simular atualizações regulares de progresso enquanto o upload estiver em andamento
    const progressInterval = setInterval(() => {
      if (uploadProgress < 90) {
        uploadProgress += 10;
        if (onProgress) {
          onProgress(uploadProgress);
        }
      }
    }, 1000);

    // Agora faz o upload real do arquivo
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        
        // Atualizar status para erro em caso de falha
        await supabase
          .from('videos_storage')
          .update({ 
            status: 'error' as VideoStatus,
            metadata: { 
              ...videoData.metadata as object,
              error_message: uploadError.message,
              processing_status: 'falha no upload' 
            } 
          })
          .eq('id', videoData.id);
        
        return { success: false, error: 'Falha no upload do arquivo.' };
      }

      // Upload completo
      if (onProgress) {
        onProgress(100);
      }

      // Atualizar status sobre o upload
      await supabase
        .from('videos_storage')
        .update({ 
          metadata: { 
            ...videoData.metadata as object,
            upload_completed_at: new Date().toISOString(),
            upload_duration_ms: Date.now() - uploadStartTime,
            processing_status: 'iniciando processamento' 
          } 
        })
        .eq('id', videoData.id);
    }
    catch (error) {
      clearInterval(progressInterval);
      throw error;
    }

    // 3. Iniciar processamento de video (thumbnail e codificação)
    try {
      const { error: processingError } = await supabase.functions.invoke('process-video', {
        body: { videoId: videoData.id, fileName }
      });

      if (processingError) {
        console.error('Erro ao iniciar processamento:', processingError);
        throw processingError;
      }
    } catch (processError) {
      console.error('Falha ao chamar função de processamento:', processError);
      
      // Se falhar a chamada da função, ainda permitir que o upload seja considerado bem-sucedido
      // mas atualizar o status para indicar o problema
      await supabase
        .from('videos_storage')
        .update({ 
          metadata: { 
            ...videoData.metadata as object,
            processing_warning: 'Falha ao iniciar processamento automatizado',
            processing_status: 'processamento não iniciado' 
          } 
        })
        .eq('id', videoData.id);
    }

    // 4. Atualizar status para 'processing'
    await supabase
      .from('videos_storage')
      .update({ 
        status: 'processing' as VideoStatus,
        file_urls: { original: supabase.storage.from('videos').getPublicUrl(fileName).data.publicUrl }
      })
      .eq('id', videoData.id);

    // 5. Se o vídeo está associado a um equipamento, também registre na tabela videos
    const metadata = videoData.metadata as VideoMetadata | null;
    if (metadata?.equipment_id) {
      try {
        // Buscar detalhes do equipamento
        const { data: equipmentData } = await supabase
          .from('equipamentos')
          .select('nome')
          .eq('id', metadata.equipment_id)
          .single();
          
        if (equipmentData) {
          await supabase.from('videos').insert({
            id: videoData.id,
            titulo: title,
            descricao: description,
            url_video: supabase.storage.from('videos').getPublicUrl(fileName).data.publicUrl,
            equipamentos: [equipmentData.nome],
            equipment_id: metadata.equipment_id,
            tags: tags
          });
        }
      } catch (error) {
        console.error('Erro ao criar registro na tabela videos:', error);
        // Não falhar o upload se esta etapa falhar
      }
    }

    return { 
      success: true, 
      videoId: videoData.id,
      metadata: videoData.metadata as VideoMetadata
    };
    
  } catch (error) {
    console.error('Erro no processo de upload:', error);
    return { success: false, error: 'Ocorreu um erro inesperado. Por favor, tente novamente.' };
  }
}
