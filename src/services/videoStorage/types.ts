// Re-export video types to keep them accessible
export type { 
  VideoStatus, 
  VideoQuality, 
  VideoQueueStatus,
  VideoMetadata,
  StoredVideo,
  VideoDownloadLog,
  VideoUploadProgress,
  VideoQueueItem,
  VideoFilterOptions,
  VideoSortOptions 
} from '@/types/video-storage';

// Common constants for video services
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const ALLOWED_MIME_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
