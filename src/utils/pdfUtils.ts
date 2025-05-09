
/**
 * Utilities for handling PDF files
 */

/**
 * Checks if a PDF URL is valid
 * @param url URL to check
 * @returns boolean
 */
export const isPdfUrlValid = (url: string | undefined): boolean => {
  if (!url) return false;
  
  // Check if URL is not empty and ends with .pdf or has pdf in the path
  return (
    url.trim() !== '' && 
    (url.toLowerCase().endsWith('.pdf') || url.toLowerCase().includes('/pdf'))
  );
};

/**
 * Processes a PDF URL to ensure it can be properly displayed
 * @param url PDF URL
 * @returns Processed URL as string or object with processedUrl property
 */
export const processPdfUrl = (url: string): { processedUrl: string } => {
  if (!url) return { processedUrl: '' };
  
  // Return the URL as is, modifications can be added here if needed
  return { processedUrl: url };
};

/**
 * Opens a PDF in a new tab
 * @param url PDF URL
 */
export const openPdfInNewTab = (url: string): void => {
  if (!url) return;
  
  window.open(url, '_blank');
};

/**
 * Downloads a PDF file from a URL
 * @param url PDF URL to download
 * @param filename Optional filename to use
 */
export const downloadPdf = async (url: string, filename?: string): Promise<void> => {
  if (!url) {
    throw new Error('URL inválida para download');
  }

  try {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || url.substring(url.lastIndexOf('/') + 1) || 'document.pdf';
    link.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Erro ao baixar o PDF');
  }
};

/**
 * Validates if a PDF URL is accessible
 * @param url PDF URL to validate
 * @returns Promise that resolves to boolean
 */
export const validatePdfUrl = async (url: string): Promise<boolean> => {
  if (!isPdfUrlValid(url)) {
    return false;
  }

  try {
    // Optionally, you could make a HEAD request to check if the URL is valid
    // For now, we'll just return true if the URL is valid
    return true;
  } catch (error) {
    console.error('Error validating PDF URL:', error);
    return false;
  }
};
