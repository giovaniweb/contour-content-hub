
import { supabase } from '@/integrations/supabase/client';
import { VideoQuality } from '@/types/video-storage';

/**
 * Generate a download URL for a video with the specified quality
 */
export async function generateDownloadUrl(
  videoId: string, 
  quality: VideoQuality = 'original'
): Promise<{ url?: string; filename?: string; error?: string }> {
  try {
    // 1. Verificar se o vídeo existe e o usuário tem acesso
    const { data: video, error: videoError } = await supabase
      .from('videos_storage')
      .select('*')
      .eq('id', videoId)
      .single();

    if (videoError || !video) {
      return { error: 'Vídeo não encontrado ou acesso negado.' };
    }

    // 2. Determinar o path do arquivo baseado na qualidade
    const fileUrls = video.file_urls as Record<VideoQuality, string>;
    const qualityUrl = fileUrls[quality];
    
    if (!qualityUrl) {
      return { error: `Versão ${quality} do vídeo não está disponível.` };
    }

    // Extrair o path do storage a partir da URL pública
    const storageUrl = supabase.storage.from('videos').getPublicUrl('').data.publicUrl;
    const path = qualityUrl.replace(storageUrl, '');

    // 3. Gerar URL assinada para download
    const { data: signedUrlData, error: signUrlError } = await supabase.storage
      .from('videos')
      .createSignedUrl(path, 60, {
        download: video.title
      });

    if (signUrlError) {
      console.error('Erro ao gerar URL assinada:', signUrlError);
      return { error: 'Não foi possível gerar o link de download.' };
    }

    // 4. Registrar log de download
    await supabase.from('video_downloads').insert({
      video_id: videoId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      quality: quality,
      user_agent: navigator.userAgent
    });

    return { 
      url: signedUrlData.signedUrl,
      filename: `${video.title.replace(/[^a-zA-Z0-9]/g, '_')}_${quality}.mp4`
    };
    
  } catch (error) {
    console.error('Erro ao gerar URL de download:', error);
    return { error: 'Ocorreu um erro inesperado. Por favor, tente novamente.' };
  }
}
