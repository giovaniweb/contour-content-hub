
import { supabase } from '@/integrations/supabase/client';

export interface ProcessingResult {
  title: string | null;
  conclusion: string | null;
  keywords: string[] | null;
  researchers: string[] | null;
  error?: string | null;
}

/**
 * Processa o conteúdo de um arquivo para extrair informações
 * @param fileContent Conteúdo do arquivo em base64 (sem o prefixo data:...)
 */
export const processFileContent = async (fileContent: string): Promise<ProcessingResult> => {
  try {
    console.log("Processing file content...");
    
    const processResponse = await supabase.functions.invoke('process-document', {
      body: { fileContent }
    });
    
    if (processResponse.error) {
      console.error("Error processing document:", processResponse.error);
      throw new Error("Falha ao extrair conteúdo do documento");
    }
    
    const extractionData = processResponse.data;
    console.log("Extracted data:", extractionData);
    
    if (!extractionData) {
      throw new Error("Nenhuma informação foi extraída do documento");
    }
    
    return {
      title: extractionData.title || null,
      conclusion: extractionData.conclusion || null,
      keywords: extractionData.keywords || [],
      researchers: extractionData.researchers || []
    };
  } catch (error: any) {
    console.error("Error in processFileContent:", error);
    return {
      title: null,
      conclusion: null,
      keywords: [],
      researchers: [],
      error: error.message || "Erro desconhecido no processamento"
    };
  }
};

/**
 * Processa um documento já salvo no banco de dados
 * @param documentId ID do documento a ser processado
 */
export const processExistingDocument = async (documentId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.functions.invoke('process-document', {
      body: { documentId, forceRefresh: true }
    });
    
    if (error) {
      console.error("Error processing document:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error in processExistingDocument:", error);
    throw error;
  }
};

/**
 * Upload de arquivo para o storage
 * @param file Arquivo a ser enviado
 * @param fileName Nome do arquivo (opcional)
 */
export const uploadFileToStorage = async (file: File, fileName?: string): Promise<string> => {
  try {
    console.log("Starting file upload to storage:", file.name);
    
    const fileNameToUse = fileName || `articles/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    
    // Check if the file exists
    if (!file || file.size === 0) {
      throw new Error('Arquivo inválido ou vazio');
    }
    
    console.log(`Uploading file to path: documents/${fileNameToUse}`);
    
    const { error, data } = await supabase
      .storage
      .from('documents')
      .upload(fileNameToUse, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      console.error("Storage upload error:", error);
      throw error;
    }
    
    console.log("Upload successful, getting public URL");
    
    const { data: urlData } = supabase
      .storage
      .from('documents')
      .getPublicUrl(fileNameToUse);
      
    console.log("Public URL:", urlData.publicUrl);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
