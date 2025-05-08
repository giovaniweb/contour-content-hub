
import { z } from 'zod';

// Define Zod schema for VideoMetadata
export const VideoMetadataSchema = z.object({
  equipment_id: z.string().optional().nullable(),
  original_filename: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  codec: z.string().optional(),
  fps: z.number().optional(),
  area_corpo: z.string().optional(),
  categoria: z.string().optional(),
  compartilhamentos: z.number().optional(),
  curtidas: z.number().optional(),
  data_upload: z.string().optional(),
  descricao: z.string().optional(),
  descricao_curta: z.string().optional(),
  descricao_detalhada: z.string().optional(),
  duracao: z.string().optional(),
  vimeo_id: z.string().optional(),
}).catchall(z.unknown()); // Allow additional properties

// Export types for VideoMetadata
export type VideoMetadata = z.infer<typeof VideoMetadataSchema>;

export type VideoStatus = 'uploading' | 'processing' | 'ready' | 'error';
export type VideoQuality = 'sd' | 'hd' | 'original';
export type VideoQueueStatus = 'pending' | 'uploading' | 'completed' | 'error';

export interface StoredVideo {
  id: string;
  title: string;
  description?: string;
  owner_id: string;
  status: VideoStatus;
  size: number;
  duration?: string; // Changed from number to string to match database
  created_at: string;
  updated_at: string;
  tags: string[];
  thumbnail_url?: string;
  file_urls: {
    [key in VideoQuality]?: string;
  };
  public: boolean;
  metadata?: VideoMetadata;
}

export interface VideoDownloadLog {
  id: string;
  video_id: string;
  user_id: string;
  downloaded_at: string;
  quality: VideoQuality;
  ip_address?: string;
  user_agent?: string;
}

export interface VideoUploadProgress {
  fileName: string;
  progress: number;
  status: VideoStatus;
  message?: string;
  id?: string;
  error?: string;
}

export interface VideoQueueItem {
  file: File;
  title: string;
  description: string;
  tags: string[];
  equipmentId: string;
  status: VideoQueueStatus;
  progress?: number;
  videoId?: string;
  error?: string;
}

export interface VideoFilterOptions {
  search?: string;
  tags?: string[];
  status?: VideoStatus[];
  startDate?: Date;
  endDate?: Date;
  owner?: string;
}

export interface VideoSortOptions {
  field: 'title' | 'size' | 'created_at' | 'updated_at';
  direction: 'asc' | 'desc';
}
