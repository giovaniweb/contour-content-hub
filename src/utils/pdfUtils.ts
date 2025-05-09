
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
 * @returns Processed URL as string
 */
export const processPdfUrl = (url: string): string => {
  if (!url) return '';
  
  // Return the URL as is, modifications can be added here if needed
  return url;
};

/**
 * Opens a PDF in a new tab
 * @param url PDF URL
 */
export const openPdfInNewTab = (url: string): void => {
  if (!url) return;
  
  window.open(url, '_blank');
};
