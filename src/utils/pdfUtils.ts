
export const processPdfUrl = (url: string) => {
  if (!url) return { processedUrl: null };
  
  // Remove any query parameters that might interfere
  let cleanUrl = url;
  
  // Se for um link do Dropbox, converter para visualização direta
  if (url.includes('dropbox.com')) {
    // Convert dropbox share link to direct link
    if (url.includes('dropbox.com/s/')) {
      const directUrl = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '').replace('?dl=1', '');
      cleanUrl = directUrl;
    } else if (url.includes('dropbox.com/scl/')) {
      // Handle new dropbox share format
      cleanUrl = url.replace('?dl=0', '?dl=1').replace('?rlkey=', '&rlkey=');
    }
    return { processedUrl: `${cleanUrl}#view=FitH` };
  }
  
  // Se for um link do Google Drive, tentar converter
  if (url.includes('drive.google.com')) {
    const fileId = url.match(/[-\w]{25,}/);
    if (fileId) {
      return { processedUrl: `https://drive.google.com/file/d/${fileId[0]}/preview` };
    }
  }
  
  // Se for OneDrive
  if (url.includes('onedrive.live.com') || url.includes('1drv.ms')) {
    // Try to extract embed URL
    const embedUrl = url.replace('view.aspx', 'embed').replace('redir', 'embed');
    return { processedUrl: embedUrl };
  }
  
  // Para URLs que já são diretas ou outras, tentar adicionar parâmetros de visualização
  const hasParams = url.includes('?');
  const viewParams = hasParams ? '&view=FitH&toolbar=1' : '?view=FitH&toolbar=1';
  
  return { processedUrl: `${cleanUrl}${viewParams}` };
};

export const openPdfInNewTab = (url: string) => {
  const { processedUrl } = processPdfUrl(url);
  if (processedUrl) {
    window.open(processedUrl, '_blank', 'noopener,noreferrer');
  }
};

export const isPdfUrlValid = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    // Check if it's a valid URL and likely to be a PDF or document service
    const validDomains = [
      'dropbox.com',
      'dl.dropboxusercontent.com',
      'drive.google.com',
      'onedrive.live.com',
      '1drv.ms',
      'amazonaws.com',
      'googleusercontent.com'
    ];
    
    const validExtensions = ['.pdf', '.PDF'];
    const hasValidDomain = validDomains.some(domain => urlObj.hostname.includes(domain));
    const hasValidExtension = validExtensions.some(ext => urlObj.pathname.includes(ext));
    
    return hasValidDomain || hasValidExtension || urlObj.pathname.toLowerCase().includes('pdf');
  } catch {
    return false;
  }
};

export const downloadPdf = async (url: string, filename: string = 'documento.pdf') => {
  try {
    // For most cloud storage services, direct download might not work due to CORS
    // So we'll open in new tab which usually triggers download
    const { processedUrl } = processPdfUrl(url);
    const downloadUrl = processedUrl || url;
    
    // Try to force download by creating a temporary link
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (error) {
    console.error('Erro ao baixar PDF:', error);
    // Fallback: just open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
    throw new Error('Não foi possível baixar o arquivo automaticamente');
  }
};

export const extractFileNameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop() || 'documento';
    
    // Remove query parameters and ensure PDF extension
    const cleanFilename = filename.split('?')[0];
    return cleanFilename.includes('.pdf') ? cleanFilename : `${cleanFilename}.pdf`;
  } catch {
    return 'documento.pdf';
  }
};
