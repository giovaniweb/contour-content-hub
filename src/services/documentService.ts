
/**
 * Document service for handling document-related operations
 */

/**
 * Downloads a PDF file from the given URL
 * @param url PDF file URL
 */
export const downloadPdfFile = (url: string): void => {
  try {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = url.substring(url.lastIndexOf('/') + 1) || 'document.pdf';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading PDF file:', error);
  }
};
