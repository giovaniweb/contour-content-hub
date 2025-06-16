
export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/mkv'
  ];
  
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de arquivo inválido. Apenas vídeos são aceitos.'
    };
  }
  
  // Check file size (100MB limit)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Arquivo muito grande. O tamanho máximo é 100MB.'
    };
  }
  
  return { valid: true };
}

export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const extension = originalName.split('.').pop() || 'mp4';
  
  // Sanitize filename
  const baseName = originalName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9-_]/g, '_') // Replace special chars
    .substring(0, 50); // Limit length
  
  return `${baseName}_${timestamp}_${random}.${extension}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
