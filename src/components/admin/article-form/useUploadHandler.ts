
// I'll update the useUploadHandler hook to support the forceClearState flag
import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { uploadFileToStorage, processFileContent } from "@/services/documentProcessing";

interface UseUploadHandlerProps {
  onExtractedData: (data: ExtractedData) => void;
  onError: (message: string) => void;
  onReset: () => void;
  forceClearState?: boolean; // New prop to force state reset
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
  // For debugging
  const instanceId = useRef(`upload-handler-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  
  // State
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<string | null>(null);
  const [processingFailed, setProcessingFailed] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Reset upload state
  const resetUploadState = useCallback(() => {
    console.log(`[${instanceId.current}] Resetting upload state`);
    setFile(null);
    setFileUrl(null);
    setProcessingProgress(null);
    setProcessingFailed(false);
    setUploadError(null);
  }, []);
  
  // Handle forceClearState changes
  useEffect(() => {
    if (forceClearState) {
      console.log(`[${instanceId.current}] forceClearState true, resetting upload state`);
      resetUploadState();
    }
  }, [forceClearState, resetUploadState]);
  
  // On mount
  useEffect(() => {
    console.log(`[${instanceId.current}] useUploadHandler mounted`);
    
    // Clean up on unmount
    return () => {
      console.log(`[${instanceId.current}] useUploadHandler unmounting`);
      // Ensure we reset state on unmount
      resetUploadState();
    };
  }, [resetUploadState]);
  
  // Handle file selection
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`[${instanceId.current}] handleFileChange called`);
    
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      console.log(`[${instanceId.current}] File selected:`, selectedFile.name, selectedFile.size);
      
      // Reset states
      onReset();
      resetUploadState();
      setUploadError(null);
      
      // Validate file
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
  
  // Process the file to extract information
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
      onReset(); // Reset any previous extraction data
      
      setProcessingProgress("Lendo arquivo e extraindo conteúdo...");
      console.log(`[${instanceId.current}] Reading file and extracting content...`);
      
      // Upload file to storage first to ensure we have the URL
      setProcessingProgress("Enviando arquivo para armazenamento...");
      console.log(`[${instanceId.current}] Uploading file to storage...`);
      
      let publicUrl;
      try {
        publicUrl = await uploadFileToStorage(file);
        console.log(`[${instanceId.current}] Upload completed successfully. URL:`, publicUrl);
        setFileUrl(publicUrl);
      } catch (storageError: any) {
        console.error(`[${instanceId.current}] Error during storage upload:`, storageError);
        // We'll continue even with upload error, but record it
        setUploadError("Não foi possível fazer upload do arquivo, mas você pode continuar com as informações extraídas.");
      }
      
      // Read file as base64 for processing
      const fileReader = new FileReader();
      const fileContentPromise = new Promise<string>((resolve, reject) => {
        fileReader.onload = (e) => {
          console.log(`[${instanceId.current}] File read successfully`);
          resolve(e.target?.result as string);
        };
        fileReader.onerror = (e) => {
          console.error(`[${instanceId.current}] Error reading file:`, e);
          reject(e);
        };
      });
      fileReader.readAsDataURL(file);
      const fileContent = await fileContentPromise;
      
      setProcessingProgress("Analisando conteúdo do documento...");
      console.log(`[${instanceId.current}] Analyzing document content...`);
      
      // Extract document content with unique processing ID
      const processingId = `proc-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      console.log(`[${instanceId.current}] Processing ID: ${processingId}`);
      
      // Extract document content
      const extractionResult = await processFileContent(fileContent.split(',')[1]);
      
      if (extractionResult.error) {
        throw new Error(extractionResult.error);
      }
      
      // Pass extracted data back to parent component
      const newExtractedData: ExtractedData = {
        title: extractionResult.title || '',
        conclusion: extractionResult.conclusion || '',
        keywords: extractionResult.keywords || [],
        researchers: extractionResult.researchers || []
      };
      
      console.log(`[${instanceId.current}] Data extracted from document:`, {
        title: newExtractedData.title?.substring(0, 20) + '...',
        conclusion: newExtractedData.conclusion?.substring(0, 20) + '...',
        keywords: newExtractedData.keywords?.length,
        researchers: newExtractedData.researchers?.length
      });
      
      // Verify the data actually contains something meaningful
      const hasEmptyExtraction = 
        !newExtractedData.title && 
        !newExtractedData.conclusion && 
        (!newExtractedData.keywords || newExtractedData.keywords.length === 0) &&
        (!newExtractedData.researchers || newExtractedData.researchers.length === 0);
        
      // If extraction is empty and we're in production, try to get title from filename
      if (hasEmptyExtraction) {
        console.log(`[${instanceId.current}] Extracted data is empty, using filename as fallback`);
        // Use filename as title
        if (file) {
          newExtractedData.title = file.name
            .replace('.pdf', '')
            .replace(/_/g, ' ')
            .replace(/-/g, ' ');
        }
      }
      
      onExtractedData(newExtractedData);
      
      setProcessingProgress(null);
      
      // Show relevant toast message
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
      
      // Even with error, try to use filename as title
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
  }, [file, onExtractedData, onError, onReset]);
  
  // Clear file and reset upload state
  const handleClearFile = useCallback(() => {
    console.log(`[${instanceId.current}] Clearing file`);
    resetUploadState();
    onReset(); // Also reset extraction data
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
