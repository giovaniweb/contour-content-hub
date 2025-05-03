
/**
 * Funções utilitárias para processamento e manipulação de URLs de PDF
 */

/**
 * Processa uma URL de PDF para garantir que ela seja utilizável para visualização/download
 * @param url URL original do documento
 * @returns URL processada
 */
export const processPdfUrl = (url: string | undefined): { 
  processedUrl: string; 
  sourceType: 'blob' | 'dropbox' | 'google-drive' | 'generic' | 'none';
} => {
  if (!url) {
    return { processedUrl: '', sourceType: 'none' };
  }
  
  try {
    const trimmedUrl = url.trim();
    
    // Para URLs blob, usamos diretamente
    if (trimmedUrl.startsWith('blob:')) {
      console.log("Processando URL blob:", trimmedUrl);
      return { processedUrl: trimmedUrl, sourceType: 'blob' };
    }
    
    // Para URLs do Dropbox
    if (trimmedUrl.includes('dropbox.com')) {
      let processedUrl = trimmedUrl;
      if (!processedUrl.includes('dl=1')) {
        processedUrl = processedUrl.includes('?') 
          ? `${processedUrl}&dl=1` 
          : `${processedUrl}?dl=1`;
      }
      console.log("Processando URL Dropbox:", processedUrl);
      return { processedUrl, sourceType: 'dropbox' };
    }
    
    // Para URLs do Google Drive
    if (trimmedUrl.includes('drive.google.com')) {
      let processedUrl = trimmedUrl;
      if (processedUrl.includes('/view')) {
        processedUrl = processedUrl.replace('/view', '/preview');
      }
      console.log("Processando URL Google Drive:", processedUrl);
      return { processedUrl, sourceType: 'google-drive' };
    }
    
    // Para outras URLs
    // Garantir que a URL começa com http ou https
    let processedUrl = trimmedUrl;
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = `https://${processedUrl}`;
    }
    console.log("Processando URL genérica:", processedUrl);
    return { processedUrl, sourceType: 'generic' };
  } catch (error) {
    console.error("Erro ao processar URL do PDF:", error);
    return { processedUrl: '', sourceType: 'none' };
  }
};

/**
 * Abre um PDF para download em uma nova aba
 * @param url URL do documento
 * @param documentTitle Título opcional para o arquivo
 */
export const openPdfInNewTab = (url: string | undefined, documentTitle?: string): void => {
  if (!url) {
    throw new Error("URL do documento não fornecida");
  }
  
  const { processedUrl } = processPdfUrl(url);
  
  if (processedUrl) {
    console.log(`Abrindo documento "${documentTitle || 'Sem título'}" em nova aba:`, processedUrl);
    window.open(processedUrl, '_blank', 'noopener,noreferrer');
    return;
  }
  
  throw new Error("Não foi possível processar a URL do documento");
};

/**
 * Verifica se uma URL de PDF é válida
 */
export const isPdfUrlValid = (url: string | undefined): boolean => {
  if (!url) return false;
  
  const { processedUrl, sourceType } = processPdfUrl(url);
  return !!processedUrl && sourceType !== 'none';
};
