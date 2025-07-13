import { supabase } from '@/integrations/supabase/client';

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
   * Faz upload do arquivo PDF para o Supabase Storage
   */
  async uploadPDF(file: File): Promise<UploadResult> {
    try {
      console.log('📁 [PDF Upload] Iniciando upload:', file.name);

      // Verificar autenticação
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('Usuário não autenticado');
      }

      // Gerar caminho único
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `${userData.user.id}/${fileName}`;

      // Upload para o storage
      const { error: uploadError } = await supabase.storage
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
   * Processa PDF com OpenAI para extrair conteúdo
   */
  async processPDF(file: File): Promise<PDFProcessingResult> {
    try {
      console.log('🤖 [PDF Processing] Iniciando processamento:', file.name);

      // Converter para Base64
      const base64Content = await this.fileToBase64(file);
      console.log('📄 [PDF Processing] Arquivo convertido para Base64');

      // Chamar Edge Function usando URL completa
      const response = await fetch('https://mksvzhgqnsjfolvskibq.supabase.co/functions/v1/pdf-text-extraction', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rc3Z6aGdxbnNqZm9sdnNraWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMjg3NTgsImV4cCI6MjA2MTcwNDc1OH0.ERpPooxjvC4BthjXKus6s1xqE7FAE_cjZbEciS_VD4Q`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_content: base64Content,
          extract_metadata: true
        })
      });

      if (!response.ok) {
        console.error('❌ [PDF Processing] HTTP Error:', response.status, response.statusText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || !data.success) {
        throw new Error('Processamento falhou na Edge Function');
      }

      console.log('✅ [PDF Processing] Processamento concluído com sucesso');

      return {
        title: data.title || 'Documento Processado',
        content: data.content || '',
        conclusion: data.conclusion || '',
        keywords: data.keywords || [],
        authors: data.authors || data.researchers || [],
        rawText: data.raw_text || '',
        success: true
      };

    } catch (error: any) {
      console.error('❌ [PDF Processing] Erro:', error);
      
      // Retornar resultado de fallback em caso de erro
      return {
        title: `Documento Processado (${new Date().toLocaleTimeString()})`,
        content: 'Documento processado com processamento básico devido a erro no sistema.',
        conclusion: 'Conteúdo disponível para análise manual.',
        keywords: ['documento', 'pdf', 'erro'],
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
    
    // 2. Processamento com IA (independente do upload)
    const processingResult = await this.processPDF(file);

    return {
      upload: uploadResult,
      processing: processingResult
    };
  }
}

// Instância singleton do serviço
export const pdfProcessingService = new PDFProcessingService();