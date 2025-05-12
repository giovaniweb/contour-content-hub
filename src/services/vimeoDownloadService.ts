
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
    const { error: updateError } = await supabase
      .from('videos')
      .update({
        file_urls: data.file_urls,
        downloadable: true,
        updated_at: new Date().toISOString()
      })
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
