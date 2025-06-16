
import { supabase } from '@/integrations/supabase/client';
import { VideoQueueItem } from '@/types/video-storage';
import { generateUniqueFileName, validateVideoFile } from '@/utils/fileUtils';

export async function uploadVideo(
  file: File,
  metadata: {
    title?: string;
    description?: string;
    equipmentId?: string;
    tags?: string[];
  } = {}
): Promise<{
  success: boolean;
  videoId?: string;
  error?: string;
}> {
  try {
    console.log('🚀 Iniciando upload do vídeo:', file.name);
    
    // Validate file
    const validation = validateVideoFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    // Get authenticated user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error('Usuário não autenticado');
    }
    
    console.log('✅ Usuário autenticado:', userData.user.id);
    
    // Generate sanitized unique filename
    const sanitizedFileName = generateUniqueFileName(file.name);
    console.log('📝 Nome do arquivo sanitizado:', sanitizedFileName);
    
    // Create video record first in the videos table (not videos_storage)
    const videoData = {
      titulo: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
      descricao_curta: metadata.description || '',
      tipo_video: 'video_pronto',
      equipment_id: metadata.equipmentId || null,
      tags: metadata.tags || [],
      url_video: '', // Will be updated after upload
      preview_url: '', // Will be generated later
      data_upload: new Date().toISOString()
    };
    
    const { data: createdVideo, error: videoError } = await supabase
      .from('videos')
      .insert(videoData)
      .select()
      .single();
    
    if (videoError || !createdVideo) {
      console.error('❌ Erro ao criar registro do vídeo:', videoError);
      throw new Error(videoError?.message || 'Falha ao criar registro do vídeo');
    }
    
    console.log('✅ Registro do vídeo criado:', createdVideo.id);
    
    // Upload file to storage with sanitized name
    const filePath = `videos/${sanitizedFileName}`;
    
    console.log('📤 Fazendo upload para:', filePath);
    
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      
      // Delete the video record if upload failed
      await supabase
        .from('videos')
        .delete()
        .eq('id', createdVideo.id);
      
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }
    
    console.log('✅ Upload concluído com sucesso');
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);
    
    console.log('🔗 URL pública gerada:', publicUrlData.publicUrl);
    
    // Update video record with file URL
    const { error: updateError } = await supabase
      .from('videos')
      .update({
        url_video: publicUrlData.publicUrl,
        preview_url: publicUrlData.publicUrl // Temporary, will be replaced with actual thumbnail
      })
      .eq('id', createdVideo.id);
    
    if (updateError) {
      console.error('⚠️ Erro ao atualizar URL do vídeo:', updateError);
      // Don't throw error here, upload was successful
    }
    
    // Call process-video edge function to generate thumbnail and process
    try {
      console.log('🔄 Iniciando processamento do vídeo...');
      
      const { error: processError } = await supabase.functions.invoke('process-video', {
        body: { 
          videoId: createdVideo.id, 
          fileName: sanitizedFileName 
        }
      });
      
      if (processError) {
        console.error('⚠️ Erro no processamento (não crítico):', processError);
        // Don't throw error, upload was successful even if processing failed
      } else {
        console.log('✅ Processamento iniciado com sucesso');
      }
    } catch (processError) {
      console.error('⚠️ Erro ao iniciar processamento:', processError);
      // Don't throw error, upload was successful
    }
    
    return { success: true, videoId: createdVideo.id };
  } catch (error) {
    console.error('💥 Erro geral no upload:', error);
    return { success: false, error: error.message || 'Erro desconhecido no upload' };
  }
}

export async function batchUploadVideos(
  queue: VideoQueueItem[],
  onProgress: (index: number, progress: number) => void,
  onComplete: (index: number, success: boolean, videoId?: string, error?: string) => void
): Promise<{
  success: boolean;
  completed: number;
  failed: number;
}> {
  let completed = 0;
  let failed = 0;
  
  console.log(`🚀 Iniciando upload em lote de ${queue.length} vídeos`);
  
  // Process videos one by one
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    console.log(`📤 Processando vídeo ${i + 1}/${queue.length}: ${item.file.name}`);
    
    try {
      // Report start
      onProgress(i, 0);
      
      // Upload file
      const { success, videoId, error } = await uploadVideo(item.file, {
        title: item.title,
        description: item.description,
        equipmentId: item.equipmentId,
        tags: item.tags
      });
      
      // Update status
      if (success && videoId) {
        completed++;
        onComplete(i, true, videoId);
        console.log(`✅ Vídeo ${i + 1} concluído com sucesso`);
      } else {
        failed++;
        onComplete(i, false, undefined, error);
        console.log(`❌ Vídeo ${i + 1} falhou:`, error);
      }
      
      // Report completion
      onProgress(i, 100);
    } catch (error) {
      failed++;
      onComplete(i, false, undefined, error.message);
      console.log(`💥 Erro no vídeo ${i + 1}:`, error);
    }
    
    // Small delay between uploads to avoid API rate limits
    if (i < queue.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`🏁 Upload em lote concluído: ${completed} sucessos, ${failed} falhas`);
  
  return {
    success: failed === 0,
    completed,
    failed
  };
}
