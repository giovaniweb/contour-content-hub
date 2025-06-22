
import { supabase } from '@/integrations/supabase/client';

export interface ProcessedDocumentData {
  title?: string;
  conclusion?: string;
  keywords?: string[];
  researchers?: string[];
  error?: string;
}

export const uploadFileToStorage = async (file: File): Promise<string> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error('Usuário não autenticado');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const filePath = `${userData.user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const processFileContent = async (base64Content: string): Promise<ProcessedDocumentData> => {
  try {
    console.log('Starting document processing...');

    const { data, error } = await supabase.functions.invoke('pdf-text-extraction', {
      body: { 
        fileContent: base64Content,
        extractionType: 'scientific_article'
      }
    });

    if (error) {
      console.error('Error processing document:', error);
      throw new Error(`Erro no processamento: ${error.message}`);
    }

    console.log('Document processing completed:', data);

    return {
      title: data?.title || '',
      conclusion: data?.conclusion || data?.abstract || '',
      keywords: data?.keywords || [],
      researchers: data?.authors || data?.researchers || []
    };
  } catch (error) {
    console.error('Error in processFileContent:', error);
    
    // Return basic structure with error to allow form submission
    return {
      title: '',
      conclusion: '',
      keywords: [],
      researchers: [],
      error: error instanceof Error ? error.message : 'Erro no processamento do documento'
    };
  }
};
