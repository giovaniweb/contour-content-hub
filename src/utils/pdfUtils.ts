
/**
 * Utility functions for handling PDF files
 */

interface ProcessedUrl {
  processedUrl: string;
  isValid: boolean;
}

/**
 * Processes a PDF URL to ensure it's in the correct format for display
 */
export const processPdfUrl = (url: string): ProcessedUrl => {
  if (!url) {
    return { processedUrl: '', isValid: false };
  }

  try {
    // Check if URL is already a PDF viewer URL
    if (url.includes('docs.google.com/viewer') || url.includes('mozilla.github.io/pdf.js')) {
      return { processedUrl: url, isValid: true };
    }

    // If it's a direct PDF link, wrap it in Google Docs Viewer
    if (url.toLowerCase().endsWith('.pdf') || url.includes('application/pdf')) {
      // Use Google Docs Viewer as fallback
      const processedUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
      return { processedUrl, isValid: true };
    }

    // If it doesn't look like a PDF link, return as is
    return { processedUrl: url, isValid: true };
  } catch (error) {
    console.error('Error processing PDF URL:', error);
    return { processedUrl: '', isValid: false };
  }
};

/**
 * Checks if a URL is a valid PDF URL
 */
export const isPdfUrlValid = (url: string): boolean => {
  if (!url) return false;
  
  try {
    if (url.toLowerCase().endsWith('.pdf')) return true;
    if (url.includes('application/pdf')) return true;
    if (url.includes('docs.google.com/viewer') && url.includes('.pdf')) return true;
    
    return false;
  } catch (error) {
    console.error('Error validating PDF URL:', error);
    return false;
  }
};

/**
 * Opens a PDF in a new tab
 */
export const openPdfInNewTab = (url: string, title?: string): void => {
  if (!url) {
    throw new Error('URL é obrigatória');
  }

  const newWindow = window.open(url, '_blank');
  
  if (!newWindow) {
    throw new Error('Não foi possível abrir uma nova aba. Verifique se o navegador está bloqueando pop-ups.');
  }

  if (newWindow && title) {
    newWindow.document.title = title;
  }
};

/**
 * Downloads a PDF file
 */
export const downloadPdf = async (url: string, filename?: string): Promise<void> => {
  if (!url) {
    throw new Error('URL é obrigatória');
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = downloadUrl;
    a.download = filename || 'document.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Não foi possível fazer o download do arquivo.');
  }
};
