
import { supabase } from '@/integrations/supabase/client';
import { generateUniqueFileName, validateVideoFile } from '@/utils/fileUtils';

interface VideoQueueItem {
  file: File;
  title?: string;
  description?: string;
  equipmentId?: string;
  tags?: string[];
}

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
    
    // Upload file to storage with user folder structure
    const filePath = `${userData.user.id}/${sanitizedFileName}`;
    
    console.log('📤 Fazendo upload para:', filePath);
    
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
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
    
    // Generate placeholder thumbnail URL
    const thumbnailUrl = `https://via.placeholder.com/640x360/333333/FFFFFF?text=${encodeURIComponent(metadata.title || file.name)}`;
    
    // Create video record in the videos table
    const videoData = {
      titulo: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
      descricao_curta: metadata.description || '',
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
