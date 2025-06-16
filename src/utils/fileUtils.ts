
/**
 * Utility functions for file handling and sanitization
 */

export function sanitizeFileName(fileName: string): string {
  // Remove extension temporarily
  const extension = fileName.split('.').pop();
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
  
  // Sanitize the name:
  // 1. Replace spaces and special characters with underscores
  // 2. Remove accents and special characters
  // 3. Convert to lowercase
  // 4. Remove consecutive underscores
  // 5. Remove leading/trailing underscores
  const sanitized = nameWithoutExtension
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-zA-Z0-9]/g, '_') // Replace special chars with underscore
    .toLowerCase()
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
  
  // If name becomes empty, use a default
  const finalName = sanitized || 'video';
  
  return extension ? `${finalName}.${extension}` : finalName;
}

export function generateUniqueFileName(originalName: string): string {
  const sanitized = sanitizeFileName(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  
  const extension = sanitized.split('.').pop();
  const nameWithoutExtension = sanitized.replace(/\.[^/.]+$/, "");
  
  return `${nameWithoutExtension}_${timestamp}_${random}.${extension}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('video/')) {
    return { valid: false, error: 'Arquivo deve ser um vídeo' };
  }
  
  // Check file size (max 500MB)
  const maxSize = 500 * 1024 * 1024; // 500MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Arquivo muito grande (máximo 500MB)' };
  }
  
  // Check supported formats
  const supportedFormats = ['video/mp4', 'video/quicktime', 'video/avi', 'video/mov'];
  if (!supportedFormats.includes(file.type)) {
    return { valid: false, error: 'Formato não suportado. Use MP4, MOV ou AVI' };
  }
  
  return { valid: true };
}
