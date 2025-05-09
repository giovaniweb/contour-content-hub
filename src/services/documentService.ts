
/**
 * Document service for handling document-related operations
 */

import { downloadPdf } from '@/utils/pdfUtils';

/**
 * Downloads a PDF file from the given URL
 * @param url PDF file URL
 * @param filename Optional filename to use for the downloaded file
 */
export const downloadPdfFile = async (url: string, filename?: string): Promise<void> => {
  try {
    await downloadPdf(url, filename);
  } catch (error) {
    console.error('Error downloading PDF file:', error);
    throw error;
  }
};
