
import { supabase } from '@/integrations/supabase/client';
import { generateUniqueFileName, generateUniqueThumbnailName, validateVideoFile, validateImageFile, extractVideoMetadata } from '@/utils/fileUtils';
import { VideoUploadProgress, VideoQueueItem, VideoUploadResult, VideoBatchUploadResult } from '@/types/video-storage';

interface UploadMetadata {
  title?: string;
  description?: string;
  equipmentId?: string;
  tags?: string[];
  thumbnailFile?: File;
  category?: string;
}

export async function uploadVideo(
  file: File,
  metadata: UploadMetadata = {},
  onProgress?: (progress: VideoUploadProgress) => void
): Promise<VideoUploadResult> {
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
    
    // Update progress - starting upload
    if (onProgress) {
      onProgress({
        loaded: 0,
        total: file.size,
        percentage: 0,
        status: 'uploading',
        stage: 'uploading',
        fileName: file.name,
        message: 'Preparando upload...'
      });
    }
    
    // Generate sanitized unique filename
    const sanitizedFileName = generateUniqueFileName(file.name);
    const filePath = `${userData.user.id}/${sanitizedFileName}`;
    
    console.log('📤 Fazendo upload para:', filePath);
    
    // Extract video metadata
    const videoMetadata = await extractVideoMetadata(file);
    console.log('📊 Metadados extraídos:', videoMetadata);
    
    // Upload file to storage with real progress tracking
    const uploadResult = await uploadFileWithProgress(file, filePath, onProgress);
    
    if (!uploadResult.success) {
      throw new Error(uploadResult.error || 'Erro no upload do arquivo');
    }
    
    // Update progress - processing
    if (onProgress) {
      onProgress({
        loaded: file.size,
        total: file.size,
        percentage: 90,
        status: 'processing',
        stage: 'processing',
        fileName: file.name,
        message: 'Processando vídeo...'
      });
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);
    
    console.log('🔗 URL pública gerada:', publicUrlData.publicUrl);
    
    // Handle thumbnail upload if provided
    let thumbnailUrl = null;
    if (metadata.thumbnailFile) {
      const thumbnailValidation = validateImageFile(metadata.thumbnailFile);
      if (thumbnailValidation.valid) {
        const thumbnailFileName = generateUniqueThumbnailName(sanitizedFileName);
        const thumbnailPath = `${userData.user.id}/thumbnails/${thumbnailFileName}`;
        
        const { error: thumbError } = await supabase.storage
          .from('videos')
          .upload(thumbnailPath, metadata.thumbnailFile);
        
        if (!thumbError) {
          const { data: thumbUrlData } = supabase.storage
            .from('videos')
            .getPublicUrl(thumbnailPath);
          thumbnailUrl = thumbUrlData.publicUrl;
          console.log('🖼️ Thumbnail uploaded:', thumbnailUrl);
        } else {
          console.warn('⚠️ Erro no upload da thumbnail:', thumbError);
        }
      } else {
        console.warn('⚠️ Thumbnail inválida:', thumbnailValidation.error);
      }
    }
    
    // Update progress - creating record
    if (onProgress) {
      onProgress({
        loaded: file.size,
        total: file.size,
        percentage: 95,
        status: 'processing',
        stage: 'creating_record',
        fileName: file.name,
        message: 'Criando registro do vídeo...'
      });
    }
    
    // Create video record in the videos table
    const videoData = {
      titulo: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
      descricao_curta: metadata.description || '',
      descricao_detalhada: metadata.description || '',
      tipo_video: 'video_pronto' as const,
      categoria: metadata.category || null,
      equipamentos: metadata.equipmentId ? [metadata.equipmentId] : [],
      tags: metadata.tags || [],
      url_video: publicUrlData.publicUrl,
      preview_url: publicUrlData.publicUrl,
      thumbnail_url: thumbnailUrl,
      duracao: videoMetadata.duration ? `${Math.floor(videoMetadata.duration)}s` : null,
      downloads_count: 0,
      favoritos_count: 0,
      curtidas: 0,
      compartilhamentos: 0,
      data_upload: new Date().toISOString()
    };
    
    const { data: createdVideo, error: videoError } = await supabase
      .from('videos')
      .insert(videoData)
      .select()
      .single();
    
    if (videoError || !createdVideo) {
      console.error('❌ Erro ao criar registro do vídeo:', videoError);
      
      // Cleanup uploaded files if video record creation failed
      await supabase.storage.from('videos').remove([filePath]);
      if (thumbnailUrl) {
        const thumbnailPath = thumbnailUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('videos').remove([thumbnailPath]);
      }
      
      throw new Error(videoError?.message || 'Falha ao criar registro do vídeo');
    }
    
    console.log('✅ Registro do vídeo criado:', createdVideo.id);
    
    // Final progress update
    if (onProgress) {
      onProgress({
        loaded: file.size,
        total: file.size,
        percentage: 100,
        status: 'complete',
        stage: 'complete',
        fileName: file.name,
        message: 'Upload concluído com sucesso!',
        videoId: createdVideo.id
      });
    }
    
    return { 
      success: true, 
      videoId: createdVideo.id,
      uploadedUrl: publicUrlData.publicUrl,
      thumbnailUrl
    };
    
  } catch (error) {
    console.error('💥 Erro geral no upload:', error);
    
    if (onProgress) {
      onProgress({
        loaded: 0,
        total: file.size,
        percentage: 0,
        status: 'error',
        fileName: file.name,
        error: error.message || 'Erro desconhecido no upload'
      });
    }
    
    return { 
      success: false, 
      error: error.message || 'Erro desconhecido no upload' 
    };
  }
}

async function uploadFileWithProgress(
  file: File, 
  filePath: string, 
  onProgress?: (progress: VideoUploadProgress) => void
): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    
    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const percentage = Math.round((event.loaded / event.total) * 85); // Reserve 15% for processing
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage,
          status: 'uploading',
          stage: 'uploading',
          fileName: file.name,
          message: `Enviando... ${percentage}%`
        });
      }
    });
    
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ success: true });
      } else {
        resolve({ 
          success: false, 
          error: `Upload failed with status ${xhr.status}` 
        });
      }
    };
    
    xhr.onerror = () => {
      resolve({ 
        success: false, 
        error: 'Network error during upload' 
      });
    };
    
    // Get upload URL from Supabase
    supabase.storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
      .then(({ error }) => {
        if (error) {
          resolve({ success: false, error: error.message });
        } else {
          resolve({ success: true });
        }
      })
      .catch((error) => {
        resolve({ success: false, error: error.message });
      });
  });
}

export async function batchUploadVideos(
  queue: VideoQueueItem[],
  onProgress: (index: number, progress: VideoUploadProgress) => void,
  onComplete: (index: number, success: boolean, videoId?: string, error?: string) => void
): Promise<VideoBatchUploadResult> {
  let completed = 0;
  let failed = 0;
  const results: Array<{ success: boolean; videoId?: string; error?: string; fileName: string }> = [];
  
  console.log(`🚀 Iniciando upload em lote de ${queue.length} vídeos`);
  
  // Process videos one by one to avoid overwhelming the system
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    console.log(`📤 Processando vídeo ${i + 1}/${queue.length}: ${item.file.name}`);
    
    try {
      const result = await uploadVideo(
        item.file, 
        {
          title: item.title,
          description: item.description,
          equipmentId: item.equipmentId,
          tags: item.tags,
          thumbnailFile: item.thumbnailFile,
          category: item.category
        },
        (progress) => onProgress(i, progress)
      );
      
      if (result.success && result.videoId) {
        completed++;
        results.push({
          success: true,
          videoId: result.videoId,
          fileName: item.file.name
        });
        onComplete(i, true, result.videoId);
        console.log(`✅ Vídeo ${i + 1} concluído com sucesso`);
      } else {
        failed++;
        results.push({
          success: false,
          error: result.error,
          fileName: item.file.name
        });
        onComplete(i, false, undefined, result.error);
        console.log(`❌ Vídeo ${i + 1} falhou:`, result.error);
      }
      
    } catch (error) {
      failed++;
      const errorMessage = error.message || 'Erro desconhecido';
      results.push({
        success: false,
        error: errorMessage,
        fileName: item.file.name
      });
      onComplete(i, false, undefined, errorMessage);
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
    failed,
    results
  };
}
