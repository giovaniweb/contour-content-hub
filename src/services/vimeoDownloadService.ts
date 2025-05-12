
import { supabase } from "@/integrations/supabase/client";
import { VideoFile, StoredVideo } from "@/types/video-storage";

/**
 * Busca os links de download disponíveis para um vídeo do Vimeo
 * @param vimeoId ID do vídeo no Vimeo
 * @returns Objeto com os links de download em várias resoluções e metadados do vídeo
 */
export const getVimeoDownloadLinks = async (vimeoId: string): Promise<{
  success: boolean;
  data?: StoredVideo;
  error?: string;
}> => {
  try {
    console.log(`Buscando links de download para o vídeo ${vimeoId}`);
    
    const { data, error } = await supabase.functions.invoke('vimeo-get-downloads', {
      method: 'POST',
      body: { vimeoId }
    });
    
    if (error) {
      console.error('Erro ao chamar a função vimeo-get-downloads:', error);
      return {
        success: false,
        error: error.message || 'Erro ao buscar links de download'
      };
    }
    
    if (!data.success) {
      console.error('A função retornou erro:', data.error);
      return {
        success: false,
        error: data.error || 'Erro ao processar links de download'
      };
    }
    
    console.log('Links de download obtidos com sucesso');
    return {
      success: true,
      data: data.data as StoredVideo
    };
  } catch (error) {
    console.error('Erro ao buscar links de download:', error);
    return {
      success: false,
      error: error.message || 'Erro inesperado ao buscar links de download'
    };
  }
};

/**
 * Verifica se o URL do vídeo é do Vimeo e extrai o ID
 * @param url URL do vídeo do Vimeo
 * @returns ID do vídeo ou null se não for uma URL válida do Vimeo
 */
export const extractVimeoId = (url: string): string | null => {
  const regexes = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
    /vimeo\.com\/channels\/[^/]+\/(\d+)/,
    /vimeo\.com\/groups\/[^/]+\/videos\/(\d+)/
  ];
  
  for (const regex of regexes) {
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

/**
 * Atualiza um vídeo existente com os links de download do Vimeo
 * @param videoId ID do vídeo no banco de dados
 * @param vimeoUrl URL do vídeo no Vimeo
 * @returns Resultado da operação
 */
export const updateVideoWithDownloadLinks = async (
  videoId: string,
  vimeoUrl: string
): Promise<{
  success: boolean;
  data?: StoredVideo;
  error?: string;
}> => {
  try {
    // Extrair o ID do vídeo do Vimeo
    const vimeoId = extractVimeoId(vimeoUrl);
    
    if (!vimeoId) {
      return {
        success: false,
        error: 'URL do Vimeo inválida'
      };
    }
    
    // Buscar os links de download
    const { success, data, error } = await getVimeoDownloadLinks(vimeoId);
    
    if (!success || !data) {
      return {
        success: false,
        error: error || 'Não foi possível obter os links de download'
      };
    }
    
    // Atualizar o vídeo no banco de dados com os links de download
    const updateData: any = {
      downloadable: true,
      updated_at: new Date().toISOString()
    };
    
    // Formatar os dados para o campo download_files
    if (data.file_urls) {
      // Converter o objeto file_urls para um array de objetos {quality, link}
      const downloadFiles = [];
      
      if (data.file_urls.original) {
        downloadFiles.push({ quality: 'Original', link: data.file_urls.original });
      }
      
      if (data.file_urls.hd) {
        downloadFiles.push({ quality: 'HD (720p)', link: data.file_urls.hd });
      }
      
      if (data.file_urls.sd) {
        downloadFiles.push({ quality: 'SD (480p)', link: data.file_urls.sd });
      }
      
      if (data.file_urls.web_optimized) {
        downloadFiles.push({ quality: 'Web (Otimizado)', link: data.file_urls.web_optimized });
      }
      
      updateData.download_files = downloadFiles;
    }
    
    const { error: updateError } = await supabase
      .from('videos_storage')
      .update(updateData)
      .eq('id', videoId);
      
    if (updateError) {
      console.error('Erro ao atualizar vídeo com links de download:', updateError);
      return {
        success: false,
        error: 'Erro ao salvar links de download no banco de dados'
      };
    }
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Erro ao atualizar vídeo com links:', error);
    return {
      success: false,
      error: error.message || 'Erro inesperado ao atualizar vídeo'
    };
  }
};

/**
 * Interface para o resultado da consulta de vídeos no Supabase
 */
export type VideoStorageRow = {
  id: string;
  title: string;
  download_files?: {
    quality: string;
    link: string;
  }[];
};

/**
 * Verifica se os vídeos no banco de dados possuem links de download configurados corretamente
 * @returns Estatísticas sobre os vídeos e seus links de download
 */
export const checkVideoDownloadLinks = async (): Promise<{
  total: number;
  withLinks: number;
  missingLinks: number;
  videos: {
    id: string;
    title: string;
    hasLinks: boolean;
    linkTypes: string[];
  }[];
}> => {
  try {
    const { data: videos, error } = await supabase
      .from('videos_storage')
      .select('id, title, download_files');
      
    if (error) {
      console.error('Erro ao buscar vídeos:', error);
      throw error;
    }
    
    // Se não houver vídeos ou erro, retornamos estatísticas vazias
    if (!videos || videos.length === 0) {
      return {
        total: 0,
        withLinks: 0,
        missingLinks: 0,
        videos: []
      };
    }
    
    const stats = {
      total: videos.length,
      withLinks: 0,
      missingLinks: 0,
      videos: [] as {
        id: string;
        title: string;
        hasLinks: boolean;
        linkTypes: string[];
      }[]
    };
    
    // Tratamos cada vídeo como VideoStorageRow
    (videos as VideoStorageRow[]).forEach(video => {
      const linkTypes: string[] = [];
      let hasLinks = false;
      
      if (video.download_files && Array.isArray(video.download_files) && video.download_files.length > 0) {
        hasLinks = true;
        
        // Extract all the quality types from the download_files array
        video.download_files.forEach(file => {
          if (file.quality && file.link) {
            linkTypes.push(file.quality);
          }
        });
      }
      
      if (hasLinks) {
        stats.withLinks++;
      } else {
        stats.missingLinks++;
      }
      
      stats.videos.push({
        id: video.id,
        title: video.title || 'Sem título',
        hasLinks,
        linkTypes
      });
    });
    
    return stats;
  } catch (error) {
    console.error('Erro ao verificar links de download:', error);
    throw error;
  }
};
