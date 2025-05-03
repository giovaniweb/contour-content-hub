
import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { uploadFileToStorage, processFileContent } from "@/services/documentProcessing";

interface UseUploadHandlerProps {
  onExtractedData: (data: ExtractedData) => void;
  onError: (message: string) => void;
  onReset: () => void;
}

export interface ExtractedData {
  title?: string;
  conclusion?: string;
  keywords?: string[];
  researchers?: string[];
}

export const useUploadHandler = ({ onExtractedData, onError, onReset }: UseUploadHandlerProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<string | null>(null);
  const [processingFailed, setProcessingFailed] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Reset upload state
  const resetUploadState = useCallback(() => {
    setFile(null);
    setFileUrl(null);
    setProcessingProgress(null);
    setProcessingFailed(false);
    setUploadError(null);
  }, []);
  
  // Handle file selection
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Função handleFileChange chamada");
    
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      console.log("Arquivo selecionado:", selectedFile.name, selectedFile.size);
      
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
      console.log("Arquivo definido no estado:", selectedFile.name);
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

    console.log("Iniciando processamento do arquivo:", file.name);
    
    try {
      setIsProcessing(true);
      setProcessingFailed(false);
      setUploadError(null);
      onReset(); // Reset any previous extraction data
      
      setProcessingProgress("Lendo arquivo e extraindo conteúdo...");
      console.log("Lendo arquivo e extraindo conteúdo...");
      
      // Read file as base64
      const fileReader = new FileReader();
      const fileContentPromise = new Promise<string>((resolve, reject) => {
        fileReader.onload = (e) => {
          console.log("Arquivo lido com sucesso");
          resolve(e.target?.result as string);
        };
        fileReader.onerror = (e) => {
          console.error("Erro ao ler arquivo:", e);
          reject(e);
        };
      });
      fileReader.readAsDataURL(file);
      const fileContent = await fileContentPromise;
      
      setProcessingProgress("Analisando conteúdo do documento...");
      console.log("Analisando conteúdo do documento...");
      
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
      
      console.log("Dados extraídos do documento:", newExtractedData);
      onExtractedData(newExtractedData);
      
      // Upload file to storage
      setProcessingProgress("Enviando arquivo para armazenamento...");
      console.log("Enviando arquivo para armazenamento...");
      
      try {
        const publicUrl = await uploadFileToStorage(file);
        console.log("Upload concluído com sucesso. URL:", publicUrl);
        setFileUrl(publicUrl);
      } catch (storageError: any) {
        console.error("Erro durante o upload para o storage:", storageError);
        setUploadError("Não foi possível fazer upload do arquivo, mas você pode continuar com as informações extraídas.");
        onError("Não foi possível fazer upload do arquivo, mas você pode continuar com as informações extraídas.");
      }
      
      setProcessingProgress(null);
      
      toast.success("Documento processado", {
        description: "Informações extraídas com sucesso do documento."
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao processar arquivo:', error);
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
    console.log("Limpando arquivo");
    resetUploadState();
  }, [resetUploadState]);
  
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
