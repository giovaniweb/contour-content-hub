
import { supabase } from '@/integrations/supabase/client';
import { generateUniqueFileName, validateVideoFile } from '@/utils/fileUtils';

interface VideoQueueItem {
  file: File;
  title?: string;
  description?: string;
  equipmentId?: string;
  tags?: string[];
  thumbnailFile?: File;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export async function uploadVideo(
  file: File,
  metadata: {
    title?: string;
    description?: string;
    equipmentId?: string;
    tags?: string[];
    thumbnailFile?: File;
  } = {},
  onProgress?: (progress: UploadProgress) => void
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
    const filePath = `${userData.user.id}/${sanitizedFileName}`;
    
    console.log('📤 Fazendo upload para:', filePath);
    
    // Upload file to storage with progress tracking
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        onUploadProgress: (progress) => {
          if (onProgress) {
            const percentage = Math.round((progress.loaded / progress.total) * 100);
            onProgress({
              loaded: progress.loaded,
              total: progress.total,
              percentage
            });
          }
        }
      });
    
    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }
    
    console.log('✅ Upload concluído com sucesso');
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);
    
    console.log('🔗 URL pública gerada:', publicUrlData.publicUrl);
    
    // Handle thumbnail upload if provided
    let thumbnailUrl = null;
    if (metadata.thumbnailFile) {
      const thumbnailFileName = `${userData.user.id}/thumbnails/${Date.now()}_${metadata.thumbnailFile.name}`;
      const { error: thumbError } = await supabase.storage
        .from('videos')
        .upload(thumbnailFileName, metadata.thumbnailFile);
      
      if (!thumbError) {
        const { data: thumbUrlData } = supabase.storage
          .from('videos')
          .getPublicUrl(thumbnailFileName);
        thumbnailUrl = thumbUrlData.publicUrl;
      }
    }
    
    // Create video record in the videos table
    const videoData = {
      titulo: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
      descricao_curta: metadata.description || '',
      descricao_detalhada: metadata.description || '',
      tipo_video: 'video_pronto',
      equipamentos: metadata.equipmentId ? [metadata.equipmentId] : [],
      tags: metadata.tags || [],
      url_video: publicUrlData.publicUrl,
      preview_url: publicUrlData.publicUrl,
      thumbnail_url: thumbnailUrl,
      downloads_count: 0,
      data_upload: new Date().toISOString()
    };
    
    const { data: createdVideo, error: videoError } = await supabase
      .from('videos')
      .insert(videoData)
      .select()
      .single();
    
    if (videoError || !createdVideo) {
      console.error('❌ Erro ao criar registro do vídeo:', videoError);
      
      // Delete uploaded file if video record creation failed
      await supabase.storage
        .from('videos')
        .remove([filePath]);
      
      throw new Error(videoError?.message || 'Falha ao criar registro do vídeo');
    }
    
    console.log('✅ Registro do vídeo criado:', createdVideo.id);
    
    return { success: true, videoId: createdVideo.id };
  } catch (error) {
    console.error('💥 Erro geral no upload:', error);
    return { success: false, error: error.message || 'Erro desconhecido no upload' };
  }
}

export async function batchUploadVideos(
  queue: VideoQueueItem[],
  onProgress: (index: number, progress: UploadProgress) => void,
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
      const { success, videoId, error } = await uploadVideo(
        item.file, 
        {
          title: item.title,
          description: item.description,
          equipmentId: item.equipmentId,
          tags: item.tags,
          thumbnailFile: item.thumbnailFile
        },
        (progress) => onProgress(i, progress)
      );
      
      if (success && videoId) {
        completed++;
        onComplete(i, true, videoId);
        console.log(`✅ Vídeo ${i + 1} concluído com sucesso`);
      } else {
        failed++;
        onComplete(i, false, undefined, error);
        console.log(`❌ Vídeo ${i + 1} falhou:`, error);
      }
      
    } catch (error) {
      failed++;
      onComplete(i, false, undefined, error.message);
      console.log(`💥 Erro no vídeo ${i + 1}:`, error);
    }
    
    // Small delay between uploads to avoid API rate limits
    if (i < queue.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`🏁 Upload em lote concluído: ${completed} sucessos, ${failed} falhas`);
  
  return {
    success: failed === 0,
    completed,
    failed
  };
}
