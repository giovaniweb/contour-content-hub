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

// Function to generate thumbnail from video
async function generateVideoThumbnail(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    let resolved = false;
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');

    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.error('Timeout ao gerar thumbnail do vídeo após 15 segundos.');
        if (video.src && typeof video.src === 'string' && video.src.startsWith('blob:')) {
          URL.revokeObjectURL(video.src);
        }
        video.onerror = null; // Prevent further error handling
        video.onseeked = null; // Prevent further seeked handling
        video.onloadedmetadata = null; // Prevent further metadata handling
        resolve(null);
      }
    }, 15000); // 15 segundos de timeout

    const ctx = canvas.getContext('2d');
    
    video.onloadedmetadata = () => {
      if (resolved) return; // Already timed out
      // Set canvas dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Seek to 1 second or 10% of video duration, whichever is smaller
      const seekTime = Math.min(1, video.duration * 0.1);
      video.currentTime = seekTime;
    };
    
    video.onseeked = () => {
      if (resolved) return; // Already timed out

      if (!ctx) {
        console.error('Contexto 2D do canvas não pôde ser obtido.');
        if (video.src && typeof video.src === 'string' && video.src.startsWith('blob:')) {
          URL.revokeObjectURL(video.src);
        }
        clearTimeout(timeoutId);
        if (!resolved) {
          resolved = true;
          resolve(null);
        }
        return;
      }

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (video.src && typeof video.src === 'string' && video.src.startsWith('blob:')) {
          URL.revokeObjectURL(video.src);
        }
        clearTimeout(timeoutId);
        if (!resolved) {
          resolved = true;
          resolve(blob);
        }
      }, 'image/jpeg', 0.8);
    };
    
    video.onerror = () => {
      if (resolved) return; // Already timed out
      console.error('Erro durante o processamento do vídeo para thumbnail:', video.error);
      if (video.src && typeof video.src === 'string' && video.src.startsWith('blob:')) {
        URL.revokeObjectURL(video.src);
      }
      clearTimeout(timeoutId);
      if (!resolved) {
        resolved = true;
        resolve(null);
      }
    };
    
    try {
      video.src = URL.createObjectURL(file);
    } catch (error) {
      console.error('Erro ao criar Object URL para o vídeo:', error);
      clearTimeout(timeoutId);
      if (!resolved) {
        resolved = true;
        resolve(null);
      }
    }
  });
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
    
    // Upload video file first
    if (onProgress) {
      onProgress({
        loaded: 0,
        total: file.size,
        percentage: 10,
        status: 'uploading',
        stage: 'uploading',
        fileName: file.name,
        message: 'Enviando vídeo...'
      });
    }
    
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);
    
    console.log('🔗 URL pública gerada:', publicUrlData.publicUrl);
    
    // Generate thumbnail
    if (onProgress) {
      onProgress({
        loaded: file.size * 0.7,
        total: file.size,
        percentage: 70,
        status: 'processing',
        stage: 'processing',
        fileName: file.name,
        message: 'Gerando thumbnail...'
      });
    }
    
    let thumbnailUrl = null;
    
    // Try to use provided thumbnail first, otherwise generate from video
    let thumbnailToUpload: File | Blob | null = metadata.thumbnailFile;
    
    if (!thumbnailToUpload) {
      console.log('🖼️ Gerando thumbnail automaticamente...');
      thumbnailToUpload = await generateVideoThumbnail(file);
    }
    
    if (thumbnailToUpload) {
      const thumbnailFileName = generateUniqueThumbnailName(sanitizedFileName);
      const thumbnailPath = `${userData.user.id}/thumbnails/${thumbnailFileName}`;
      
      const { error: thumbError } = await supabase.storage
        .from('videos')
        .upload(thumbnailPath, thumbnailToUpload, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (!thumbError) {
        const { data: thumbUrlData } = supabase.storage
          .from('videos')
          .getPublicUrl(thumbnailPath);
        thumbnailUrl = thumbUrlData.publicUrl;
        console.log('🖼️ Thumbnail gerada/enviada:', thumbnailUrl);
      } else {
        console.warn('⚠️ Erro no upload da thumbnail:', thumbError);
      }
    }
    
    // Update progress - creating record
    if (onProgress) {
      onProgress({
        loaded: file.size * 0.9,
        total: file.size,
        percentage: 90,
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
        const thumbnailPathParts = thumbnailUrl.split('/videos/');
        if (thumbnailPathParts.length > 1) {
          await supabase.storage.from('videos').remove([thumbnailPathParts[1]]);
        }
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
