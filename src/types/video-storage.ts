
export interface VideoFile {
  original?: string;
  hd?: string;
  sd?: string;
  web_optimized?: string;
}

export interface VideoMetadata {
  equipment_id?: string;
  equipment_name?: string;
  processing_progress?: string | object;
  duration?: string;
  fileSize?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  original_filename?: string;
  upload_source?: 'individual' | 'batch';
  user_agent?: string;
}

export type VideoStatus = "processing" | "ready" | "failed" | "uploading" | "error" | "queued" | "complete";
export type VideoQuality = "original" | "hd" | "sd";

export interface VideoUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  status?: VideoStatus;
  fileName?: string;
  progress?: number;
  message?: string;
  error?: string;
  videoId?: string;
  stage?: 'uploading' | 'processing' | 'creating_record' | 'complete';
}

export interface VideoQueueItem {
  id: string;
  file: File;
  progress?: VideoUploadProgress;
  error?: string;
  status: VideoStatus;
  title?: string;
  description?: string;
  equipmentId?: string;
  tags?: string[];
  videoId?: string;
  thumbnailFile?: File;
  category?: string;
}

export interface VideoMetadataSchema {
  equipment_id?: string;
  equipment_name?: string;
  upload_metadata?: {
    original_filename: string;
    file_size: number;
    upload_date: string;
    user_agent?: string;
  };
}

export interface VideoDownloadFile {
  quality: string;
  link: string;
}

export interface StoredVideo {
  id: string;
  title?: string;
  description?: string;
  url?: string;
  file_urls?: VideoFile;
  download_files?: VideoDownloadFile[];
  thumbnail_url?: string;
  created_at?: string;
  updated_at?: string;
  status?: VideoStatus;
  duration_seconds?: number;
  downloadable?: boolean;
  metadata?: VideoMetadata;
  tags?: string[];
  public?: boolean;
  duration?: string;
  size?: number;
  owner_id?: string;
}

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

// Additional types needed for services
export type VideoFilterOptions = {
  search?: string;
  tags?: string[];
  status?: VideoStatus[];
  startDate?: Date;
  endDate?: Date;
  owner?: string;
  category?: string;
  equipment?: string[];
};

export type VideoSortOptions = {
  field: string;
  direction: 'asc' | 'desc';
};

export interface VideoDownloadLog {
  id: string;
  videoId: string;
  userId: string;
  quality: VideoQuality;
  downloadedAt: string;
  ip_address?: string;
  user_agent?: string;
}

export interface VideoUploadResult {
  success: boolean;
  videoId?: string;
  error?: string;
  uploadedUrl?: string;
  thumbnailUrl?: string;
}

export interface VideoBatchUploadResult {
  success: boolean;
  completed: number;
  failed: number;
  results: Array<{
    success: boolean;
    videoId?: string;
    error?: string;
    fileName: string;
  }>;
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
