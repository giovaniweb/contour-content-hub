
export type VideoStatus = 'uploading' | 'processing' | 'ready' | 'error';
export type VideoQuality = 'sd' | 'hd' | 'original';

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
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    codec?: string;
    fps?: number;
  };
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
