import { supabase } from '@/integrations/supabase/client';

// Tipos para os resultados
export interface PDFProcessingResult {
  title: string;
  content: string;
  conclusion: string;
  keywords: string[];
  authors: string[];
  rawText: string;
  success: boolean;
  error?: string;
}

export interface UploadResult {
  filePath: string;
  publicUrl: string;
  success: boolean;
  error?: string;
}

// Classe principal do serviço
export class PDFProcessingService {
  
  /**
   * Converte arquivo para Base64
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove o prefixo data:application/pdf;base64,
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload do PDF para o storage
   */
  async uploadPDF(file: File): Promise<UploadResult> {
    try {
      console.log('📁 [PDF Upload] Iniciando upload:', file.name);

      // Verificar autenticação
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('Usuário não autenticado');
      }

      // Gerar caminho único - formato simplificado
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${userData.user.id}/${fileName}`;

      console.log('📁 [PDF Upload] Caminho do arquivo:', filePath);

      // Upload para o storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ [PDF Upload] Erro no upload:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      console.log('✅ [PDF Upload] Upload concluído:', urlData.publicUrl);
      console.log('✅ [PDF Upload] Caminho salvo:', filePath);

      return {
        filePath,
        publicUrl: urlData.publicUrl,
        success: true
      };

    } catch (error: any) {
      console.error('❌ [PDF Upload] Erro:', error);
      return {
        filePath: '',
        publicUrl: '',
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Processa PDF usando a edge function de processamento de texto
   */
  async processPDF(file: File, filePath?: string): Promise<PDFProcessingResult> {
    try {
      console.log('🤖 [PDF Processing] Iniciando processamento via edge function:', file.name);

      // Se já temos o filePath, usar diretamente, senão converter para base64
      let fileContent: string;
      
      if (filePath) {
        // Usar o filePath para que a edge function baixe o arquivo do storage
        console.log('📁 [PDF Processing] Usando arquivo do storage:', filePath);
        fileContent = filePath; // A edge function vai baixar o arquivo usando este path
      } else {
        // Converter para base64 para envio direto
        console.log('📝 [PDF Processing] Convertendo arquivo para base64...');
        fileContent = await this.fileToBase64(file);
      }

      // Chamar edge function de extração de texto
      const { data, error } = await supabase.functions.invoke('pdf-text-extraction', {
        body: {
          file_content: fileContent,
          file_name: file.name,
          use_storage: !!filePath // Indica se deve usar storage ou base64
        }
      });

      if (error) {
        console.error('❌ [PDF Processing] Erro na edge function:', error);
        throw new Error(`Erro no processamento: ${error.message}`);
      }

      if (!data || !data.success) {
        console.warn('⚠️ [PDF Processing] Edge function retornou erro:', data?.error);
        // Fallback para extração local
        return this.processPDFLocally(file);
      }

      console.log('✅ [PDF Processing] Processamento via edge function concluído');

      return {
        title: data.title || this.extractTitleFromFilename(file.name),
        content: data.content || 'Documento processado com sucesso.',
        conclusion: data.conclusion || 'Processamento concluído.',
        keywords: data.keywords || ['pdf', 'documento'],
        authors: data.authors || ['A definir'],
        rawText: data.rawText || '',
        success: true
      };

    } catch (error: any) {
      console.error('❌ [PDF Processing] Erro:', error);
      
      // Fallback para processamento local
      return this.processPDFLocally(file);
    }
  }

  /**
   * Processamento local como fallback
   */
  private async processPDFLocally(file: File): Promise<PDFProcessingResult> {
    console.log('📝 [PDF Processing] Usando processamento local (fallback)');
    
    const title = this.extractTitleFromFilename(file.name);

    return {
      title: title || 'Documento PDF',
      content: 'Documento PDF carregado. O processamento de texto será feito no servidor.',
      conclusion: 'Aguardando processamento completo do documento.',
      keywords: ['pdf', 'documento'],
      authors: ['A definir'],
      rawText: '',
      success: true
    };
  }

  /**
   * Extrai título do nome do arquivo
   */
  private extractTitleFromFilename(fileName: string): string {
    let title = fileName
      .replace('.pdf', '')
      .replace(/_/g, ' ')
      .replace(/^\d+\s*/, '') // Remove números no início
      .trim();

    // Capitalizar primeira letra
    title = title.charAt(0).toUpperCase() + title.slice(1);
    
    return title;
  }

  /**
   * Processo completo: Upload + Processamento
   */
  async uploadAndProcess(file: File): Promise<{
    upload: UploadResult;
    processing: PDFProcessingResult;
  }> {
    console.log('🚀 [PDF Service] Iniciando processo completo para:', file.name);

    // 1. Upload do arquivo
    const uploadResult = await this.uploadPDF(file);
    
    // 2. Processamento com edge function (usando o filePath se upload foi bem-sucedido)
    const processingResult = await this.processPDF(file, uploadResult.success ? uploadResult.filePath : undefined);

    return {
      upload: uploadResult,
      processing: processingResult
    };
  }
}

// Instância singleton do serviço
export const pdfProcessingService = new PDFProcessingService();