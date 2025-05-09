
/**
 * Utilidades para trabalhar com arquivos PDF
 */

/**
 * Verifica se uma URL é um PDF válido
 * @param url URL para verificar
 * @returns boolean indicando se a URL parece ser um PDF válido
 */
export const isPdfUrlValid = (url?: string): boolean => {
  if (!url) return false;
  
  // Verificar se a string é uma URL válida
  try {
    new URL(url);
  } catch (e) {
    return false;
  }
  
  // Verificar se parece ser uma URL de PDF (termina com .pdf ou tem application/pdf no path)
  return url.toLowerCase().endsWith('.pdf') || 
         url.toLowerCase().includes('application/pdf') || 
         url.toLowerCase().includes('pdf=true') ||
         url.toLowerCase().includes('pdf/');
};

/**
 * Processa uma URL de PDF para garantir que ela seja exibível
 * @param url URL original do PDF
 * @returns Um objeto com a URL processada
 */
export const processPdfUrl = (url?: string) => {
  if (!url) {
    return { processedUrl: null };
  }
  
  // Verificar se é uma URL válida
  let processedUrl;
  try {
    // Criar um objeto URL para validar
    const urlObj = new URL(url);
    
    // Verificar se é um serviço que requer tratamento especial
    if (urlObj.hostname.includes('dropbox.com')) {
      // Para Dropbox, trocar dl=0 por dl=1 para forçar download/visualização direta
      processedUrl = url.replace(/dl=0/g, 'dl=1');
      
      // Se não tiver dl= na URL, adicionar
      if (!processedUrl.includes('dl=')) {
        processedUrl += processedUrl.includes('?') ? '&dl=1' : '?dl=1';
      }
    } else if (urlObj.hostname.includes('drive.google.com') && url.includes('view')) {
      // Para Google Drive, modificar para formato de visualização de PDF
      processedUrl = url.replace('/view', '/preview');
    } else {
      // Para outras URLs, manter como está
      processedUrl = url;
    }
    
    return { processedUrl };
  } catch (error) {
    console.error("URL inválida:", url, error);
    return { processedUrl: null };
  }
};

/**
 * Abre o PDF em uma nova aba do navegador
 * @param url URL do arquivo PDF
 * @param title Título da página
 */
export const openPdfInNewTab = (url: string, title: string): void => {
  // Abrir em uma nova aba
  const newWindow = window.open(url, '_blank');
  
  // Verificar se o navegador bloqueou a abertura da janela/aba
  if (newWindow === null) {
    console.error("O navegador bloqueou a abertura da janela/aba");
    throw new Error("O navegador bloqueou a abertura da nova janela. Por favor, permita popups para este site.");
  }
  
  // Definir o título da página se a janela foi aberta
  if (newWindow) {
    newWindow.document.title = title;
  }
};

/**
 * Faz o download do arquivo PDF
 * @param url URL do arquivo PDF
 * @param filename Nome do arquivo para download
 */
export const downloadPdf = async (url: string, filename: string): Promise<void> => {
  try {
    // Fazer o fetch do arquivo
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    // Converter para blob
    const blob = await response.blob();
    
    // Criar um URL para o blob
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Criar um link temporário e disparar o download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Limpar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Erro ao baixar o PDF:', error);
    throw error;
  }
};
