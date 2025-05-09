
export interface VideoFile {
  original?: string;
  hd?: string;
  sd?: string;
}

export interface StoredVideo {
  id: string;
  title?: string;
  description?: string;
  url?: string;
  file_urls?: VideoFile;
  thumbnail_url?: string;
  created_at?: string;
  updated_at?: string;
  status?: 'processing' | 'ready' | 'failed';
  duration_seconds?: number;
  downloadable?: boolean;
}
