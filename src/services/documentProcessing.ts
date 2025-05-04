
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
    
    // Se estiver em modo de desenvolvimento, simular o processamento para testes
    if (process.env.NODE_ENV === 'development') {
      console.log("Modo de desenvolvimento detectado. Usando dados simulados.");
      
      // Simular um pequeno atraso para testes de UI
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Retornar dados de teste para desenvolvimento
      return {
        title: "EFFECTS OF CRYOFREQUENCY ON LOCALIZED ADIPOSITY IN FLANKS",
        conclusion: "The cryofrequency was effective for the treatment of localized adiposity, generating a positive satisfaction among the evaluated volunteers.",
        keywords: ["Radiofrequência", "Crioterapia", "Tecido Adiposo"],
        researchers: ["Rodrigo Marcel Valentim", "Patricia Froes Meyer"]
      };
    }
    
    // Em produção, fazer o processamento real
    const processResponse = await supabase.functions.invoke('process-document', {
      body: { fileContent }
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
      body: { documentId, forceRefresh: true }
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
    
    // Em modo de desenvolvimento, simular o upload
    if (process.env.NODE_ENV === 'development') {
      console.log("Modo de desenvolvimento detectado. Simulando upload.");
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
      
      // Criar um URL de Blob local para simular o upload
      const blobUrl = URL.createObjectURL(file);
      console.log("URL de blob simulado criado:", blobUrl);
      return blobUrl;
    }
    
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
        
        const { data: urlData } = supabase
          .storage
          .from('documents')
          .getPublicUrl(fileNameToUse);
          
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
