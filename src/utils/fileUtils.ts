
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
    'video/mkv',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska'
  ];
  
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de arquivo inválido: ${file.type}. Apenas vídeos são aceitos.`
    };
  }
  
  // Check file size (500MB limit to match storage bucket)
  const maxSize = 500 * 1024 * 1024; // 500MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Arquivo muito grande: ${formatFileSize(file.size)}. O tamanho máximo é 500MB.`
    };
  }

  // Check minimum size
  const minSize = 1024; // 1KB minimum
  if (file.size < minSize) {
    return {
      valid: false,
      error: 'Arquivo muito pequeno. Tamanho mínimo é 1KB.'
    };
  }
  
  return { valid: true };
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ];
  
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de imagem inválido: ${file.type}. Use JPEG, PNG, WebP ou GIF.`
    };
  }
  
  // 10MB limit for images
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Imagem muito grande: ${formatFileSize(file.size)}. O tamanho máximo é 10MB.`
    };
  }
  
  return { valid: true };
}

export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop()?.toLowerCase() || 'mp4';
  
  // Sanitize filename - remove special characters and spaces
  const baseName = originalName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-zA-Z0-9-_]/g, '_') // Replace special chars with underscore
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .substring(0, 50) // Limit length
    .toLowerCase();
  
  return `${baseName}_${timestamp}_${random}.${extension}`;
}

/**
 * Formata o nome do arquivo seguindo o padrão específico
 * Converte de: aplicação_abdominal_cryorfmax_do_unyquepro-_1 (2160p)-2
 * Para: Aplicação abdominal Cryo Rf Max do Unyque Pro Cod:XXX
 */
export function formatFileNameToTitle(fileName: string): string {
  // Remove extensão e informações de resolução
  let cleanName = fileName
    .replace(/\.[^/.]+$/, '') // Remove extensão (.mp4, .avi, etc.)
    .replace(/\s*\(\d+p\).*$/, '') // Remove resolução e tudo depois dela (2160p)-2
    .replace(/-+$/, '') // Remove hífens no final
    .trim();
  
  // Quebra por underscores e hífens, depois formata cada palavra
  const words = cleanName
    .split(/[_-]+/)
    .filter(word => word.length > 0)
    .map(word => {
      // Capitaliza primeira letra de cada palavra
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  
  // Junta as palavras com espaços
  let formattedTitle = words.join(' ');
  
  // Aplica correções específicas para nomes conhecidos
  formattedTitle = formattedTitle
    .replace(/\bCryo\s*rf\s*max\b/gi, 'Cryo Rf Max')
    .replace(/\bUnyque\s*pro\b/gi, 'Unyque Pro')
    .replace(/\bdo\s+/gi, 'do ')
    .replace(/\bda\s+/gi, 'da ')
    .replace(/\bde\s+/gi, 'de ');
  
  // Adiciona código se não existir
  if (!formattedTitle.toLowerCase().includes('cod:')) {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    formattedTitle += ` Cod:${randomCode}`;
  }
  
  return formattedTitle;
}

export function generateUniqueThumbnailName(videoFileName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  
  // Extract base name from video file
  const baseName = videoFileName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .substring(0, 30); // Limit length
  
  return `thumb_${baseName}_${timestamp}_${random}.jpg`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function extractVideoMetadata(file: File): Promise<{
  duration?: number;
  width?: number;
  height?: number;
}> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    
    video.onloadedmetadata = () => {
      const metadata = {
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      };
      URL.revokeObjectURL(url);
      resolve(metadata);
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({});
    };
    
    video.src = url;
  });
}
