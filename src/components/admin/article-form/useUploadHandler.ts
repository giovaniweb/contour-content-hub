
import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { uploadFileToStorage, processFileContent } from "@/services/documentProcessing";

interface UseUploadHandlerProps {
  onExtractedData: (data: ExtractedData) => void;
  onError: (message: string) => void;
  onReset: () => void;
  forceClearState?: boolean;
}

export interface ExtractedData {
  title?: string;
  conclusion?: string;
  keywords?: string[];
  researchers?: string[];
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
    if (!file) {
      toast.error("Nenhum arquivo selecionado", {
        description: "Por favor, selecione um arquivo PDF para upload."
      });
      setUploadError("Nenhum arquivo selecionado. Por favor, selecione um arquivo PDF para upload.");
      return false;
    }

    console.log(`[${instanceId.current}] Starting file processing:`, file.name);
    
    try {
      setIsProcessing(true);
      setProcessingFailed(false);
      setUploadError(null);
      onReset();
      
      setProcessingProgress("Processando arquivo e extraindo conteúdo...");
      console.log(`[${instanceId.current}] Processing file...`);
      
      // Use the correct processFileContent function that expects a File
      const result = await processFileContent(file);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Falha no processamento');
      }

      // Update fileUrl from result
      if (result.fileUrl) {
        setFileUrl(result.fileUrl);
      }
      
      // Map the extracted data to our interface
      const newExtractedData: ExtractedData = {
        title: result.data.title || '',
        conclusion: result.data.description || '', // Use description as conclusion
        keywords: result.data.keywords || [],
        researchers: result.data.researchers || []
      };
      
      console.log(`[${instanceId.current}] Data extracted from document:`, {
        title: newExtractedData.title?.substring(0, 20) + '...',
        conclusion: newExtractedData.conclusion?.substring(0, 20) + '...',
        keywords: newExtractedData.keywords?.length,
        researchers: newExtractedData.researchers?.length
      });
      
      const hasEmptyExtraction = 
        !newExtractedData.title && 
        !newExtractedData.conclusion && 
        (!newExtractedData.keywords || newExtractedData.keywords.length === 0) &&
        (!newExtractedData.researchers || newExtractedData.researchers.length === 0);
        
      if (hasEmptyExtraction && file) {
        console.log(`[${instanceId.current}] Extracted data is empty, using filename as fallback`);
        newExtractedData.title = file.name
          .replace('.pdf', '')
          .replace(/_/g, ' ')
          .replace(/-/g, ' ');
      }
      
      onExtractedData(newExtractedData);
      
      setProcessingProgress(null);
      
      if (uploadError) {
        toast.warning("Documento processado parcialmente", {
          description: "Informações extraídas com sucesso, mas o upload do arquivo falhou."
        });
      } else {
        toast.success("Documento processado", {
          description: "Informações extraídas com sucesso do documento."
        });
      }
      
      return true;
    } catch (error: any) {
      console.error(`[${instanceId.current}] Error processing file:`, error);
      setUploadError(error.message || "Ocorreu um erro ao processar o arquivo.");
      onError(error.message || "Ocorreu um erro ao processar o arquivo.");
      setProcessingFailed(true);
      
      toast.error("Erro no processamento", {
        description: "Não foi possível processar o arquivo. Por favor, tente novamente."
      });
      
      if (file) {
        const suggestedTitleFromFilename = file.name
          .replace('.pdf', '')
          .replace(/_/g, ' ');
          
        onExtractedData({
          title: suggestedTitleFromFilename
        });
      }
      
      return false;
    } finally {
      setIsProcessing(false);
      setProcessingProgress(null);
    }
  }, [file, onExtractedData, onError, onReset, uploadError]);
  
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
