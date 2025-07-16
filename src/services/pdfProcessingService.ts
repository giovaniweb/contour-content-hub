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
   * Processa PDF - versão simplificada (somente metadados do arquivo)
   */
  async processPDF(file: File): Promise<PDFProcessingResult> {
    try {
      console.log('🤖 [PDF Processing] Iniciando processamento:', file.name);

      // Extrair título do nome do arquivo
      let title = file.name
        .replace('.pdf', '')
        .replace(/_/g, ' ')
        .replace(/^\d+\s*/, '') // Remove números no início
        .trim();

      // Capitalizar primeira letra
      title = title.charAt(0).toUpperCase() + title.slice(1);

      console.log('✅ [PDF Processing] Análise concluída:', {
        title: title.substring(0, 50),
        fileName: file.name
      });

      return {
        title: title || 'Documento PDF',
        content: 'Documento PDF carregado. O processamento de texto será feito no servidor.',
        conclusion: 'Aguardando processamento completo do documento.',
        keywords: ['pdf', 'documento'],
        authors: ['A definir'],
        rawText: '', // Será processado no servidor
        success: true
      };

    } catch (error: any) {
      console.error('❌ [PDF Processing] Erro:', error);
      
      // Fallback sem texto extraído
      const title = file.name
        .replace('.pdf', '')
        .replace(/_/g, ' ')
        .replace(/^\d+\s*/, '')
        .trim();

      return {
        title: title.charAt(0).toUpperCase() + title.slice(1) || 'Documento PDF',
        content: 'Erro no processamento. Processamento manual necessário.',
        conclusion: 'Conteúdo não pôde ser analisado automaticamente.',
        keywords: ['erro', 'processamento'],
        authors: ['Autor Desconhecido'],
        rawText: '',
        success: false,
        error: error.message
      };
    }
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
    
    // 2. Processamento básico (extrair título do nome)
    const processingResult = await this.processPDF(file);

    return {
      upload: uploadResult,
      processing: processingResult
    };
  }
}

// Instância singleton do serviço
export const pdfProcessingService = new PDFProcessingService();