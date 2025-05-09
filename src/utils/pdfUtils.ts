
/**
 * Utilidades para trabalhar com arquivos PDF
 */

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
