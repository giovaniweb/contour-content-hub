
import { supabase } from "@/integrations/supabase/client";

interface VideoMetaResponse {
  title: string;
  description: string;
  rawResponse: string;
}

/**
 * Gera metadados (título e descrição) para um vídeo com base no nome do arquivo.
 * 
 * @param filename Nome do arquivo de vídeo
 * @returns Título e descrição gerados pela IA
 */
export const generateVideoMeta = async (filename: string): Promise<VideoMetaResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-video-meta', {
      body: { filename }
    });
    
    if (error) {
      console.error('Error generating video metadata:', error);
      throw new Error(`Erro ao gerar metadados: ${error.message}`);
    }
    
    return data as VideoMetaResponse;
  } catch (error) {
    console.error('Error in generateVideoMeta service:', error);
    throw error;
  }
};
