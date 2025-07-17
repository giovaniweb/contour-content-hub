import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { pdfProcessingService } from "@/services/pdfProcessingService";

interface UseUploadHandlerProps {
  onExtractedData: (data: ExtractedData) => void;
  onError: (message: string) => void;
  onReset: () => void;
  forceClearState?: boolean;
}

export interface ExtractedData {
  title?: string;
  content?: string;
  conclusion?: string;
  keywords?: string[];
  authors?: string[];
  researchers?: string[];
  rawText?: string;
}

export const useUploadHandler = ({
  onExtractedData,
  onError,
  onReset,
  forceClearState = false
}: UseUploadHandlerProps) => {
  const instanceId = useRef(`upload-handler-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<string | null>(null);
  const [processingFailed, setProcessingFailed] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const resetUploadState = useCallback(() => {
    console.log(`[${instanceId.current}] Resetting upload state`);
    setFile(null);
    setFileUrl(null);
    setProcessingProgress(null);
    setProcessingFailed(false);
    setUploadError(null);
  }, []);
  
  useEffect(() => {
    if (forceClearState) {
      console.log(`[${instanceId.current}] forceClearState true, resetting upload state`);
      resetUploadState();
    }
  }, [forceClearState, resetUploadState]);
  
  useEffect(() => {
    console.log(`[${instanceId.current}] useUploadHandler mounted`);
    
    return () => {
      console.log(`[${instanceId.current}] useUploadHandler unmounting`);
      resetUploadState();
    };
  }, [resetUploadState]);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`[${instanceId.current}] handleFileChange called`);
    
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      console.log(`[${instanceId.current}] File selected:`, selectedFile.name, selectedFile.size);
      
      onReset();
      resetUploadState();
      setUploadError(null);
      
      if (selectedFile.type !== 'application/pdf') {
        toast.error("Formato inválido", {
          description: "Por favor, selecione um arquivo em formato PDF."
        });
        setUploadError("Formato inválido. Por favor, selecione um arquivo em formato PDF.");
        return;
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("Arquivo muito grande", {
          description: "O tamanho máximo permitido é 10MB."
        });
        setUploadError("Arquivo muito grande. O tamanho máximo permitido é 10MB.");
        return;
      }
      
      setFile(selectedFile);
      console.log(`[${instanceId.current}] File set in state:`, selectedFile.name);
    }
  }, [onReset, resetUploadState]);
  
  const handleFileUpload = useCallback(async () => {
    console.log(`[${instanceId.current}] handleFileUpload called, file state:`, file?.name || 'no file');
    
    if (!file) {
      const errorMsg = "Nenhum arquivo selecionado. Por favor, selecione um arquivo PDF para upload.";
      console.log(`[${instanceId.current}] No file error:`, errorMsg);
      setUploadError(errorMsg);
      onError(errorMsg);
      return false;
    }

    console.log(`[${instanceId.current}] Starting file processing:`, file.name);
    
    try {
      setIsProcessing(true);
      setProcessingFailed(false);
      setUploadError(null);
      onReset();
      
      setProcessingProgress("Iniciando processamento do PDF...");
      
      const result = await pdfProcessingService.uploadAndProcess(file);

      // Verificar se o upload foi bem-sucedido
      if (!result.upload.success) {
        throw new Error(result.upload.error || 'Erro no upload do arquivo');
      }

      // Definir URL do arquivo
      setFileUrl(result.upload.publicUrl);
      setProcessingProgress("Upload concluído! Analisando conteúdo...");

      // Se o processamento da IA falhou, usar dados do nome do arquivo
      let extractedData: ExtractedData;
      
      if (result.processing.success) {
        // IA funcionou - usar dados extraídos
        extractedData = {
          title: result.processing.title,
          content: result.processing.content,
          conclusion: result.processing.conclusion,
          keywords: result.processing.keywords,
          authors: result.processing.authors,
          researchers: result.processing.authors,
          rawText: result.processing.rawText
        };
        toast.success("Documento processado", {
          description: "Informações extraídas com sucesso do documento."
        });
      } else {
        // IA falhou - usar nome do arquivo como título
        const suggestedTitleFromFilename = file.name
          .replace('.pdf', '')
          .replace(/_/g, ' ');
          
        extractedData = {
          title: suggestedTitleFromFilename,
          content: 'Conteúdo será analisado posteriormente.',
          conclusion: '',
          keywords: [],
          authors: [],
          researchers: [],
          rawText: ''
        };
        
        toast.warning("IA temporariamente indisponível", {
          description: "Arquivo carregado com sucesso. Título extraído do nome do arquivo."
        });
      }

      onExtractedData(extractedData);
      setProcessingProgress(null);
      
      return true;
    } catch (error: any) {
      console.error(`[${instanceId.current}] Error processing file:`, error);
      setUploadError(error.message || "Ocorreu um erro ao processar o arquivo.");
      onError(error.message || "Ocorreu um erro ao processar o arquivo.");
      setProcessingFailed(true);
      
      
      // Em caso de erro geral, tentar extrair pelo menos o título do nome do arquivo
      if (file) {
        const suggestedTitleFromFilename = file.name
          .replace('.pdf', '')
          .replace(/_/g, ' ');
          
        onExtractedData({
          title: suggestedTitleFromFilename,
          content: 'Erro no processamento. Preencha os dados manualmente.',
          conclusion: '',
          keywords: [],
          authors: [],
          researchers: [],
          rawText: ''
        });
        
        toast.error("Erro no sistema", {
          description: "Não foi possível processar o arquivo. Título extraído do nome do arquivo."
        });
      }
      
      return false;
    } finally {
      setIsProcessing(false);
      setProcessingProgress(null);
    }
  }, [file, onExtractedData, onError, onReset]);
  
  const handleClearFile = useCallback(() => {
    console.log(`[${instanceId.current}] Clearing file`);
    resetUploadState();
    onReset();
  }, [resetUploadState, onReset]);
  
  return {
    file,
    setFile,
    fileUrl,
    setFileUrl,
    isProcessing,
    processingProgress,
    processingFailed,
    uploadError, 
    setUploadError,
    handleFileChange,
    handleFileUpload,
    handleClearFile,
    resetUploadState
  };
};