
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
    console.error("URL não fornecida");
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
      
      // Substituir dl=0 por dl=1 para forçar download/preview
      processedUrl = processedUrl.replace(/dl=0/g, 'dl=1');
      
      // Adicionar dl=1 se não existir
      if (!processedUrl.includes('dl=1')) {
        processedUrl = processedUrl.includes('?') 
          ? `${processedUrl}&dl=1` 
          : `${processedUrl}?dl=1`;
      }
      
      // Substituir www.dropbox.com por dl.dropboxusercontent.com
      processedUrl = processedUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
      
      console.log("Processando URL Dropbox:", processedUrl);
      return { processedUrl, sourceType: 'dropbox' };
    }
    
    // Para URLs do Google Drive
    if (trimmedUrl.includes('drive.google.com')) {
      let processedUrl = trimmedUrl;
      
      // Extrair ID do Google Drive
      const fileIdMatch = processedUrl.match(/[-\w]{25,}/);
      if (fileIdMatch && fileIdMatch[0]) {
        const fileId = fileIdMatch[0];
        processedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      } else if (processedUrl.includes('/view')) {
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
 * Força o download de um PDF com um nome específico
 * @param url URL do documento
 * @param fileName Nome do arquivo para download
 */
export const downloadPdf = async (url: string | undefined, fileName?: string): Promise<void> => {
  if (!url) {
    throw new Error("URL do documento não fornecida");
  }
  
  try {
    const { processedUrl } = processPdfUrl(url);
    
    if (!processedUrl) {
      throw new Error("Não foi possível processar a URL do documento");
    }
    
    // Tentar fazer o fetch do documento como blob
    const response = await fetch(processedUrl);
    
    if (!response.ok) {
      throw new Error(`Erro ao baixar o documento: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    // Criar um URL de objeto para o blob
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Criar um elemento <a> para fazer o download
    const link = document.createElement('a');
    link.href = blobUrl;
    
    // Definir o nome do arquivo
    const downloadName = fileName || 
                         documentTitle(url) || 
                         `documento-${new Date().toISOString().slice(0, 10)}.pdf`;
    
    link.download = downloadName.endsWith('.pdf') ? downloadName : `${downloadName}.pdf`;
    
    // Adicionar o link ao documento, clicar nele e removê-lo
    document.body.appendChild(link);
    link.click();
    
    // Adicionar um timeout antes de remover o link e revogar o objeto URL
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
    
    console.log(`Download iniciado: ${downloadName}`);
  } catch (error) {
    console.error("Erro ao fazer download do PDF:", error);
    throw new Error(`Não foi possível baixar o documento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

/**
 * Tenta extrair um título de documento a partir da URL
 */
const documentTitle = (url: string): string | null => {
  try {
    // Tentar extrair o nome do arquivo da URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    
    // Se o último segmento do caminho tiver uma extensão .pdf, use-o como nome do arquivo
    if (lastPart && lastPart.toLowerCase().endsWith('.pdf')) {
      // Remover a extensão .pdf e decodificar caracteres URL
      return decodeURIComponent(lastPart.substring(0, lastPart.length - 4));
    }
    
    // Caso contrário, retornar null
    return null;
  } catch {
    return null;
  }
};

/**
 * Verifica se uma URL de PDF é válida
 */
export const isPdfUrlValid = (url: string | undefined): boolean => {
  if (!url) return false;
  
  const { processedUrl, sourceType } = processPdfUrl(url);
  return !!processedUrl && sourceType !== 'none';
};
