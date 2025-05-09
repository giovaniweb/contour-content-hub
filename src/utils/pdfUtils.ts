
/**
 * Inicia o download de um arquivo PDF
 * @param url URL do arquivo PDF a ser baixado
 * @param filename Nome do arquivo para download
 */
export const downloadPdf = async (url: string, filename: string): Promise<void> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao baixar o arquivo: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Limpar
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Erro durante o download:', error);
    throw error;
  }
};

/**
 * Valida se uma URL é um PDF válido testando o tipo de conteúdo
 * @param url URL a ser validada
 * @returns Promise<boolean> indicando se é PDF válido
 */
export const validatePdfUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) return false;
    
    const contentType = response.headers.get('content-type');
    return contentType?.includes('application/pdf') || false;
  } catch (error) {
    console.error('Erro ao validar URL do PDF:', error);
    return false;
  }
};

/**
 * Processa uma URL de PDF para garantir que ela é válida
 * @param url URL do PDF a ser processada
 * @returns Objeto contendo a URL processada ou null se inválida
 */
export const processPdfUrl = (url: string | null | undefined): { processedUrl: string | null } => {
  if (!url) return { processedUrl: null };
  return { processedUrl: url.trim() };
};

/**
 * Abre um PDF em uma nova aba do navegador
 * @param url URL do PDF a ser aberto
 */
export const openPdfInNewTab = (url: string): void => {
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Verifica se uma URL de PDF é válida de forma síncrona
 * Esta é uma verificação básica de formato, não de conteúdo
 * @param url URL a ser verificada
 * @returns boolean indicando se o formato da URL parece válido
 */
export const isPdfUrlValid = (url: string | null | undefined): boolean => {
  if (!url) return false;
  return url.trim().length > 0;
};

/**
 * Extrai nome do arquivo a partir da URL ou usa fallback
 * @param url URL do PDF
 * @param fallback Nome padrão caso não seja possível extrair
 * @returns Nome do arquivo para download
 */
export const getPdfFilename = (url: string, fallback: string = 'documento.pdf'): string => {
  if (!url) return fallback;
  
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    if (lastSegment && lastSegment.toLowerCase().endsWith('.pdf')) {
      return decodeURIComponent(lastSegment);
    }
    
    return fallback;
  } catch (error) {
    return fallback;
  }
};
