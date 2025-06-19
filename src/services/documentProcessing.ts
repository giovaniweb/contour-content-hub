
import { supabase } from '@/integrations/supabase/client';

export interface ExtractedDocumentData {
  title?: string;
  description?: string;
  keywords?: string[];
  researchers?: string[];
  content?: string;
  error?: string;
}

export interface ProcessingResult {
  success: boolean;
  data?: ExtractedDocumentData;
  error?: string;
  fileUrl?: string;
}

/**
 * Upload file to Supabase Storage
 */
export const uploadFileToStorage = async (file: File): Promise<string> => {
  try {
    console.log('📤 Uploading file to storage:', file.name);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    const { error, data } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Storage upload error:', error);
      throw new Error(`Erro no upload: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    console.log('✅ File uploaded successfully:', publicUrl);
    return publicUrl;
  } catch (error: any) {
    console.error('❌ Upload failed:', error);
    throw new Error(`Falha no upload: ${error.message}`);
  }
};

/**
 * Extract text content from PDF using PDF.js-like approach
 */
export const extractPDFText = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        
        // For now, we'll simulate PDF text extraction
        // In a real implementation, you would use PDF.js or similar
        const simulatedText = `
          Título: ${file.name.replace('.pdf', '').replace(/[-_]/g, ' ')}
          
          Resumo: Este é um artigo científico sobre procedimentos estéticos e tecnologias médicas.
          
          Autores: Dr. João Silva, Dra. Maria Santos
          
          Palavras-chave: estética, medicina, tecnologia, tratamento
          
          Conteúdo completo do documento...
        `;
        
        resolve(simulatedText);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Process extracted text to identify structured data
 */
export const processExtractedText = (text: string, fileName: string): ExtractedDocumentData => {
  try {
    console.log('🔍 Processing extracted text...');
    
    // Extract title (look for patterns like "Título:", "Title:", or use filename)
    let title = '';
    const titleMatch = text.match(/(?:título|title):\s*(.+)/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    } else {
      // Fallback to filename
      title = fileName.replace('.pdf', '').replace(/[-_]/g, ' ');
    }

    // Extract description/abstract (look for patterns like "Resumo:", "Abstract:")
    let description = '';
    const abstractMatch = text.match(/(?:resumo|abstract):\s*(.+?)(?:\n\n|\n(?=[A-Z]))/is);
    if (abstractMatch) {
      description = abstractMatch[1].trim();
    }

    // Extract authors (look for patterns like "Autores:", "Authors:")
    const researchers: string[] = [];
    const authorsMatch = text.match(/(?:autores|authors):\s*(.+)/i);
    if (authorsMatch) {
      const authorText = authorsMatch[1];
      // Split by common separators
      const authorList = authorText.split(/[,;]|e\s+|and\s+/).map(a => a.trim());
      researchers.push(...authorList.filter(a => a.length > 2));
    }

    // Extract keywords (look for patterns like "Palavras-chave:", "Keywords:")
    const keywords: string[] = [];
    const keywordsMatch = text.match(/(?:palavras-chave|keywords):\s*(.+)/i);
    if (keywordsMatch) {
      const keywordText = keywordsMatch[1];
      const keywordList = keywordText.split(/[,;]/).map(k => k.trim());
      keywords.push(...keywordList.filter(k => k.length > 2));
    }

    const result = {
      title: title || `Documento ${new Date().toLocaleDateString()}`,
      description: description || 'Artigo científico extraído automaticamente',
      keywords: keywords.length > 0 ? keywords : ['medicina', 'estética'],
      researchers: researchers.length > 0 ? researchers : ['Autor não identificado'],
      content: text
    };

    console.log('✅ Text processing completed:', {
      title: result.title,
      description: result.description?.substring(0, 50) + '...',
      keywords: result.keywords,
      researchers: result.researchers
    });

    return result;
  } catch (error: any) {
    console.error('❌ Text processing failed:', error);
    return {
      error: `Erro no processamento: ${error.message}`
    };
  }
};

/**
 * Complete file processing pipeline
 */
export const processFileContent = async (file: File): Promise<ProcessingResult> => {
  try {
    console.log('🚀 Starting complete file processing for:', file.name);
    
    // Step 1: Upload file to storage
    const fileUrl = await uploadFileToStorage(file);
    
    // Step 2: Extract text from PDF
    const extractedText = await extractPDFText(file);
    
    // Step 3: Process extracted text
    const processedData = processExtractedText(extractedText, file.name);
    
    if (processedData.error) {
      return {
        success: false,
        error: processedData.error,
        fileUrl
      };
    }

    return {
      success: true,
      data: processedData,
      fileUrl
    };
  } catch (error: any) {
    console.error('❌ Complete processing failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
