
// Unified Video interface for the main videos table
export interface Video {
  id: string;
  titulo: string;
  descricao_curta?: string;
  descricao_detalhada?: string;
  tipo_video: 'video_pronto' | 'take';
  categoria?: string;
  equipamentos: string[];
  tags: string[];
  url_video: string;
  preview_url?: string;
  thumbnail_url?: string;
  duracao?: string;
  area_corpo?: string;
  finalidade?: string[];
  downloads_count: number;
  favoritos_count: number;
  curtidas: number;
  compartilhamentos: number;
  data_upload: string;
  created_at?: string;
  updated_at?: string;
}

export interface VideoStatistics {
  totalViews: number;
  totalDownloads: number;
  totalShares: number;
  averageRating: number;
  uploadDate: string;
  fileSize?: string;
  duration?: string;
}

// Re-export common types from video-storage
export type { StoredVideo, VideoFilterOptions, VideoSortOptions } from '@/types/video-storage';
