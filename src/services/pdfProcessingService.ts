import { supabase } from '@/integrations/supabase/client';
import * as pdfParse from 'pdf-parse';

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
   * Processa PDF - versão simplificada
   */
  async processPDF(file: File): Promise<PDFProcessingResult> {
    try {
      console.log('🤖 [PDF Processing] Iniciando processamento:', file.name);

      // Extrair texto real do PDF usando pdf-parse
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      console.log('📄 [PDF Processing] Extraindo texto do PDF...');
      const pdfData = await pdfParse(buffer);
      const extractedText = pdfData.text;
      
      console.log('✅ [PDF Processing] Texto extraído:', extractedText.length, 'caracteres');

      // Extrair título do nome do arquivo como fallback
      let title = file.name
        .replace('.pdf', '')
        .replace(/_/g, ' ')
        .replace(/^\d+\s*/, '') // Remove números no início
        .trim();

      // Capitalizar primeira letra
      title = title.charAt(0).toUpperCase() + title.slice(1);

      // Tentar extrair título do conteúdo do PDF
      const titleMatch = extractedText.match(/^(.{1,100})/);
      if (titleMatch) {
        const potentialTitle = titleMatch[1].trim();
        if (potentialTitle.length > 10 && potentialTitle.length < 200) {
          title = potentialTitle;
        }
      }

      // Extrair seções importantes
      const abstractMatch = extractedText.match(/(?:RESUMO|ABSTRACT)[\s\S]{1,1000}?(?=\n\n|\n[A-Z])/i);
      const methodologyMatch = extractedText.match(/(?:METODOLOGIA|MÉTODO|MATERIALS? AND METHODS?)[\s\S]{1,2000}?(?=\n\n|\n[A-Z])/i);
      const conclusionMatch = extractedText.match(/(?:CONCLUSÃO|CONCLUSÕES|CONCLUSION|CONSIDERAÇÕES FINAIS)[\s\S]{1,1000}?(?=\n\n|\nREFERÊNCIAS)/i);

      // Extrair palavras-chave
      const keywordsMatch = extractedText.match(/(?:PALAVRAS-CHAVE|KEYWORDS|KEY WORDS)[:\s]*(.*?)(?=\n|ABSTRACT|RESUMO)/i);
      const keywords = keywordsMatch ? 
        keywordsMatch[1].split(/[;,.]/).map(k => k.trim()).filter(k => k.length > 2) : [];

      // Extrair autores (procurar no início do documento)
      const authorsMatch = extractedText.match(/(?:AUTOR|AUTORES?|AUTHORS?)[\s:]*(.*?)(?=\n|\d)/i);
      const authors = authorsMatch ? 
        authorsMatch[1].split(/[,;]/).map(a => a.trim()).filter(a => a.length > 2) : [];

      console.log('✅ [PDF Processing] Análise concluída:', {
        title: title.substring(0, 50),
        textLength: extractedText.length,
        keywordsCount: keywords.length,
        authorsCount: authors.length
      });

      return {
        title: title || 'Documento PDF',
        content: abstractMatch ? abstractMatch[0] : extractedText.substring(0, 1000) + '...',
        conclusion: conclusionMatch ? conclusionMatch[0] : '',
        keywords: keywords.slice(0, 10), // Máximo 10 palavras-chave
        authors: authors.slice(0, 5), // Máximo 5 autores
        rawText: extractedText, // IMPORTANTE: Salvar o texto completo!
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
        content: 'Erro na extração de texto. Processamento manual necessário.',
        conclusion: 'Conteúdo não pôde ser analisado automaticamente.',
        keywords: ['erro', 'processamento'],
        authors: ['Autor Desconhecido'],
        rawText: '', // Vazio em caso de erro
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