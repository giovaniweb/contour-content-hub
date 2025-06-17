
export const processPdfUrl = (url: string) => {
  if (!url) return { processedUrl: null };
  
  // Se for um link do Dropbox, converter para visualização direta
  if (url.includes('dropbox.com')) {
    const directUrl = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
    return { processedUrl: `${directUrl}#view=FitH` };
  }
  
  // Se for um link do Google Drive, tentar converter
  if (url.includes('drive.google.com')) {
    const fileId = url.match(/[-\w]{25,}/);
    if (fileId) {
      return { processedUrl: `https://drive.google.com/file/d/${fileId[0]}/preview` };
    }
  }
  
  // Para outras URLs, tentar adicionar parâmetros de visualização
  return { processedUrl: `${url}#view=FitH` };
};

export const openPdfInNewTab = (url: string) => {
  const { processedUrl } = processPdfUrl(url);
  if (processedUrl) {
    window.open(processedUrl, '_blank');
  }
};

export const isPdfUrlValid = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const downloadPdf = async (url: string, filename: string = 'documento.pdf') => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Erro ao baixar PDF:', error);
    throw new Error('Não foi possível baixar o arquivo');
  }
};
