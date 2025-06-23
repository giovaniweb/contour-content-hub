
import { supabase } from '@/integrations/supabase/client';

export interface ProcessingResult {
  title?: string;
  conclusion?: string;
  keywords?: string[];
  researchers?: string[];
  content?: string;
  error?: string;
}

export const uploadFileToStorage = async (file: File): Promise<string> => {
  try {
    console.log('📁 Uploading file to storage:', file.name);
    
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error('Usuário não autenticado');
    }

    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const filePath = `${userData.user.id}/${fileName}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    console.log('✅ File uploaded successfully:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Error in uploadFileToStorage:', error);
    throw error;
  }
};

export const processFileContent = async (base64Content: string): Promise<ProcessingResult> => {
  try {
    console.log('🤖 Processing file content with AI...');
    
    const { data, error } = await supabase.functions.invoke('pdf-text-extraction', {
      body: { 
        file_content: base64Content,
        extract_metadata: true
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`Erro no processamento: ${error.message}`);
    }

    console.log('✅ File processing completed:', data);
    
    return {
      title: data?.title || '',
      conclusion: data?.conclusion || data?.content || '',
      keywords: data?.keywords || [],
      researchers: data?.researchers || data?.authors || [],
      content: data?.content || '',
    };
  } catch (error: any) {
    console.error('Error in processFileContent:', error);
    
    // Return fallback result instead of throwing
    return {
      error: error.message || 'Erro desconhecido no processamento'
    };
  }
};

export const extractDocumentMetadata = async (documentId: string): Promise<ProcessingResult> => {
  try {
    console.log('📄 Extracting document metadata for:', documentId);
    
    const { data, error } = await supabase.functions.invoke('process-document', {
      body: { 
        documentId,
        forceRefresh: true
      }
    });

    if (error) {
      console.error('Document processing error:', error);
      throw new Error(`Erro na extração: ${error.message}`);
    }

    return data?.extractedInfo || {};
  } catch (error: any) {
    console.error('Error in extractDocumentMetadata:', error);
    throw error;
  }
};
