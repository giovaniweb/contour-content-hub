
// Export all video storage services from this index file
export {
  uploadVideo,
  batchUploadVideos
} from './videoUploadService';

export {
  getVideos,
  getVideoById,
  updateVideo,
  updateVideos,
  deleteVideo,
  deleteVideos,
  downloadVideo,
  copyVideoLink,
  getVideoStatistics,
  removeMockupVideos
} from './videoManagementService';

// Re-export types - only export VideoStatistics from videoService to avoid ambiguity
export type { 
  Video,
  VideoStatistics
} from './videoService';

export type * from '@/types/video-storage';

// Common constants
export const VIDEO_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 500 * 1024 * 1024, // 500MB
  SUPPORTED_FORMATS: [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/mkv',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska'
  ],
  THUMBNAIL_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  THUMBNAIL_FORMATS: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ]
};
