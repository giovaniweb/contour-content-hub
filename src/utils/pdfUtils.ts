
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
