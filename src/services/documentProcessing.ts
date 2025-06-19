
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
    console.log("Iniciando processamento do conteúdo do arquivo...");
    
    // Generate unique processing ID to prevent caching issues or state persistence
    const processingId = `proc-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    console.log(`Processing ID: ${processingId}`);
    
    // Se estiver em modo de desenvolvimento, simular o processamento para testes
    if (process.env.NODE_ENV === 'development') {
      console.log("Modo de desenvolvimento detectado. Usando dados simulados.");
      
      // Simular um pequeno atraso para testes de UI
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ensure we include the processing ID in the response to validate fresh data
      // Generate different data each time to clearly show new processing results
      const currentTime = new Date().toISOString().substring(11, 19); // HH:MM:SS
      return {
        title: `EFFECTS OF CRYOFREQUENCY ON LOCALIZED ADIPOSITY IN FLANKS (${currentTime})`,
        conclusion: `The cryofrequency was effective for the treatment of localized adiposity, generating a positive satisfaction among the evaluated volunteers. [Session: ${processingId}]`,
        keywords: ["Radiofrequência", "Crioterapia", "Tecido Adiposo", processingId.substring(0, 6)],
        researchers: ["Rodrigo Marcel Valentim", "Patricia Froes Meyer"]
      };
    }
    
    // Em produção, fazer o processamento real
    const processResponse = await supabase.functions.invoke('process-document', {
      body: { 
        fileContent,
        timestamp: Date.now(), // Add timestamp to avoid caching
        processingId, // Add unique ID to force fresh processing
        forceRefresh: true // Force refresh to avoid getting cached data
      }
    });
    
    if (processResponse.error) {
      console.error("Erro ao processar documento:", processResponse.error);
      throw new Error("Falha ao extrair conteúdo do documento");
    }
    
    const extractionData = processResponse.data;
    console.log("Dados extraídos:", extractionData);
    
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
    console.error("Erro em processFileContent:", error);
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
      body: { 
        documentId, 
        forceRefresh: true,
        timestamp: Date.now(),
        processingId: `proc-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
      }
    });
    
    if (error) {
      console.error("Erro ao processar documento:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Erro em processExistingDocument:", error);
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
    console.log("Iniciando upload do arquivo para storage:", file.name, file.type, file.size);
    
    const fileNameToUse = fileName || `articles/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    
    // Check if the file exists
    if (!file || file.size === 0) {
      throw new Error('Arquivo inválido ou vazio');
    }
    
    console.log(`Fazendo upload do arquivo para o caminho: documents/${fileNameToUse}`);
    
    // Adicionar retry lógica para lidar com problemas de conexão
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`Tentativa de upload ${attempts} de ${maxAttempts}`);
        
        const { error, data } = await supabase
          .storage
          .from('documents')
          .upload(fileNameToUse, file, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (error) {
          console.error(`Erro na tentativa ${attempts}:`, error);
          
          if (attempts < maxAttempts) {
            // Esperar antes de tentar novamente (backoff exponencial)
            const waitTime = Math.pow(2, attempts) * 1000;
            console.log(`Aguardando ${waitTime}ms antes de tentar novamente`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
          
          throw error;
        }
        
        console.log("Upload concluído com sucesso, obtendo URL pública");
        
        // Add cache-busting parameter to URL to ensure fresh content
        const { data: urlData } = supabase
          .storage
          .from('documents')
          .getPublicUrl(`${fileNameToUse}?t=${Date.now()}`);
          
        console.log("URL pública:", urlData.publicUrl);
        
        return urlData.publicUrl;
      } catch (err) {
        if (attempts >= maxAttempts) {
          throw err;
        }
      }
    }
    
    throw new Error('Número máximo de tentativas de upload excedido');
  } catch (error) {
    console.error("Erro ao fazer upload do arquivo:", error);
    throw error;
  }
};
