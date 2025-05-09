
export interface VideoFile {
  original?: string;
  hd?: string;
  sd?: string;
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
}

export type VideoStatus = "processing" | "ready" | "failed" | "uploading" | "error";
export type VideoQuality = "original" | "hd" | "sd";

export interface VideoUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface VideoQueueItem {
  id: string;
  file: File;
  progress?: VideoUploadProgress;
  error?: string;
  status: "queued" | "uploading" | "complete" | "error";
}

export interface VideoMetadataSchema {
  equipment_id?: string;
  equipment_name?: string;
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
  status?: VideoStatus;
  duration_seconds?: number;
  downloadable?: boolean;
  metadata?: VideoMetadata;
  tags?: string[];
  public?: boolean;
  duration?: string;
  size?: number;
}
