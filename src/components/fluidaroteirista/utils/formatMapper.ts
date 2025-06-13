
/**
 * Mapeamento centralizado de formatos para garantir consistência
 * entre geração e exibição de roteiros
 */

export type FormatsFluidaRoteirista = 'carrossel' | 'imagem' | 'stories' | 'reels' | 'tiktok' | 'youtube_shorts' | 'youtube_video' | 'ads_estatico' | 'ads_video' | 'stories_10x' | 'post_estatico';

export type FormatsCompatible = 'carrossel' | 'imagem' | 'stories';

export type FormatsForDisplay = 'carrossel' | 'imagem' | 'stories_10x' | 'post_estatico' | 'reels' | 'tiktok' | 'youtube_shorts' | 'youtube_video' | 'ads_estatico' | 'ads_video';

/**
 * Converte formato do gerador para formato compatível com API
 */
export const getCompatibleFormat = (format: FormatsFluidaRoteirista): FormatsCompatible => {
  switch (format) {
    case 'stories_10x':
      return 'stories';
    case 'reels':
    case 'tiktok':
    case 'youtube_shorts':
    case 'youtube_video':
    case 'ads_video':
      return 'stories'; // Todos formatos de vídeo usam stories na API
    case 'ads_estatico':
    case 'post_estatico':
      return 'imagem';
    case 'carrossel':
    case 'imagem':
    case 'stories':
      return format;
    default:
      return 'imagem';
  }
};

/**
 * Determina qual formatter usar baseado no formato
 */
export const getFormatterType = (format: string): 'carrossel' | 'stories_10x' | 'post_estatico' | 'reels' | 'default' => {
  const normalizedFormat = format.toLowerCase();
  
  if (normalizedFormat === 'carrossel') {
    return 'carrossel';
  }
  
  if (normalizedFormat === 'stories_10x') {
    return 'stories_10x';
  }
  
  if (['post_estatico', 'ads_estatico', 'imagem'].includes(normalizedFormat)) {
    return 'post_estatico';
  }
  
  if (['reels', 'tiktok', 'youtube_shorts', 'youtube_video', 'ads_video'].includes(normalizedFormat)) {
    return 'reels';
  }
  
  return 'default';
};

/**
 * Verifica se formato deve mostrar métricas de tempo
 */
export const shouldShowTimeMetrics = (format: string): boolean => {
  const staticFormats = ['post_estatico', 'carrossel', 'stories_10x', 'ads_estatico', 'imagem'];
  return !staticFormats.includes(format.toLowerCase());
};

/**
 * Mapeia formato para exibição amigável
 */
export const getFormatDisplayName = (format: string): string => {
  const displayNames: Record<string, string> = {
    carrossel: 'Carrossel',
    imagem: 'Post Estático',
    stories_10x: 'Stories 10x',
    post_estatico: 'Post Estático',
    reels: 'Reels',
    tiktok: 'TikTok',
    youtube_shorts: 'YouTube Shorts',
    youtube_video: 'Vídeo YouTube',
    ads_estatico: 'Anúncio Estático',
    ads_video: 'Anúncio em Vídeo'
  };
  
  return displayNames[format.toLowerCase()] || format;
};
