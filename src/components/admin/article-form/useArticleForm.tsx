
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useEquipments } from "@/hooks/useEquipments";
import { processFileContent, uploadFileToStorage } from "@/services/documentProcessing";

interface ArticleData {
  id?: string;
  titulo?: string;
  descricao?: string;
  equipamento_id?: string;
  idioma_original?: string;
  link_dropbox?: string;
}

export const formSchema = z.object({
  titulo: z.string().min(3, { message: "Título precisa ter pelo menos 3 caracteres" }),
  descricao: z.string().optional(),
  equipamento_id: z.string().optional(),
  idioma_original: z.string().default("pt"),
  link_dropbox: z.string().url({ message: "Link inválido" }).optional().or(z.literal("")),
});

export type FormValues = z.infer<typeof formSchema>;

export const useArticleForm = (articleData: ArticleData | undefined, onSuccess: (data?: any) => void) => {
  const { toast } = useToast();
  const { equipments } = useEquipments();
  
  // Estado para controle da submissão do formulário
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para controle do upload e processamento de arquivo
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploadStep, setUploadStep] = useState<'upload' | 'form'>(articleData ? 'form' : 'upload');
  
  // Estados para informações extraídas do documento
  const [suggestedTitle, setSuggestedTitle] = useState<string>('');
  const [suggestedDescription, setSuggestedDescription] = useState<string>('');
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [extractedResearchers, setExtractedResearchers] = useState<string[]>([]);
  
  // Estados para erros e progresso
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState<string | null>(null);
  const [processingFailed, setProcessingFailed] = useState<boolean>(false);

  // Função para resetar os dados extraídos
  const resetExtractedData = useCallback(() => {
    console.log("Resetting extracted data");
    setSuggestedTitle('');
    setSuggestedDescription('');
    setExtractedKeywords([]);
    setExtractedResearchers([]);
    setProcessingFailed(false);
    setUploadError(null);
  }, []);

  // Trata a mudança de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Reseta estados anteriores
      setUploadError(null);
      setProcessingFailed(false);
      resetExtractedData();
      
      // Validações do arquivo
      if (selectedFile.type !== 'application/pdf') {
        toast({
          variant: "destructive",
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo em formato PDF."
        });
        return;
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Arquivo muito grande",
          description: "O tamanho máximo permitido é 10MB."
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  // Processa o arquivo para extração de informações
  const handleFileUpload = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo PDF para upload."
      });
      return;
    }

    try {
      setIsProcessing(true);
      setUploadError(null);
      setProcessingFailed(false);
      resetExtractedData();
      
      setProcessingProgress("Lendo arquivo e extraindo conteúdo...");
      
      // Ler arquivo como base64
      const fileReader = new FileReader();
      const fileContentPromise = new Promise<string>((resolve, reject) => {
        fileReader.onload = (e) => resolve(e.target?.result as string);
        fileReader.onerror = (e) => reject(e);
      });
      fileReader.readAsDataURL(file);
      const fileContent = await fileContentPromise;
      
      setProcessingProgress("Analisando conteúdo do documento...");
      
      // Extrair conteúdo do documento
      const extractionResult = await processFileContent(fileContent.split(',')[1]);
      
      if (extractionResult.error) {
        throw new Error(extractionResult.error);
      }
      
      // Definir dados extraídos
      setSuggestedTitle(extractionResult.title || '');
      setSuggestedDescription(extractionResult.conclusion || '');
      setExtractedKeywords(extractionResult.keywords || []);
      setExtractedResearchers(extractionResult.researchers || []);

      // Upload do arquivo para storage
      setProcessingProgress("Enviando arquivo para armazenamento...");
      
      try {
        const publicUrl = await uploadFileToStorage(file);
        setFileUrl(publicUrl);
      } catch (storageError: any) {
        console.warn("Error during storage upload:", storageError);
        setUploadError("Não foi possível fazer upload do arquivo, mas você pode continuar com as informações extraídas.");
      }
      
      // Mover para o passo do formulário
      setProcessingProgress(null);
      setUploadStep('form');
      
      toast({
        title: "Documento processado",
        description: "Informações extraídas com sucesso do documento."
      });
    } catch (error: any) {
      console.error('Error processing file:', error);
      setUploadError(error.message || "Ocorreu um erro ao processar o arquivo.");
      setProcessingFailed(true);
      
      toast({
        variant: "destructive",
        title: "Erro no processamento",
        description: "Não foi possível processar o arquivo. Por favor, tente novamente."
      });
      
      // Mesmo com erro, tenta usar o nome do arquivo como título
      if (file) {
        const suggestedTitleFromFilename = file.name
          .replace('.pdf', '')
          .replace(/_/g, ' ');
          
        setSuggestedTitle(suggestedTitleFromFilename);
        
        // Continuar para o formulário mesmo que a extração falhe
        setUploadStep('form');
      }
    } finally {
      setIsProcessing(false);
      setProcessingProgress(null);
    }
  };

  // Submissão do formulário
  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      console.log("Submitting form with values:", values);
      
      // Usar a fileUrl do passo de upload ou o valor link_dropbox
      const finalFileUrl = fileUrl || values.link_dropbox || null;
      
      // Construir payload do artigo
      const articlePayload = {
        titulo: values.titulo,
        descricao: values.descricao || null,
        equipamento_id: values.equipamento_id === "none" ? null : values.equipamento_id || null,
        tipo: 'artigo_cientifico',
        idioma_original: values.idioma_original,
        link_dropbox: finalFileUrl,
        status: 'ativo',
        criado_por: (await supabase.auth.getUser()).data.user?.id || null,
        keywords: extractedKeywords,
        researchers: extractedResearchers
      };

      console.log("Submitting article payload:", articlePayload);

      let savedArticleData = null;

      if (articleData && articleData.id) {
        // Atualizar artigo existente
        const { error, data } = await supabase
          .from('documentos_tecnicos')
          .update(articlePayload)
          .eq('id', articleData.id)
          .select();
          
        if (error) {
          console.error("Error updating article:", error);
          throw error;
        }

        savedArticleData = data ? data[0] : articleData;

        toast({
          title: "Artigo atualizado",
          description: "O artigo científico foi atualizado com sucesso."
        });
      } else {
        // Criar novo artigo
        const { error, data } = await supabase
          .from('documentos_tecnicos')
          .insert([articlePayload])
          .select();
          
        if (error) {
          console.error("Error inserting article:", error);
          throw error;
        }

        savedArticleData = data ? data[0] : null;
        toast({
          title: "Artigo criado",
          description: "O novo artigo científico foi adicionado com sucesso."
        });
      }

      // Resetar dados para evitar persistência entre cadastros
      resetExtractedData();
      setFile(null);
      setFileUrl(null);
      
      // Passar os dados salvos para o handler de sucesso
      onSuccess(savedArticleData);
    } catch (error: any) {
      console.error('Error saving article:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar artigo",
        description: "Não foi possível salvar o artigo científico. Por favor, tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isProcessing,
    equipments,
    file,
    setFile,
    fileUrl,
    setFileUrl,
    uploadStep,
    setUploadStep,
    suggestedTitle,
    setSuggestedTitle,
    suggestedDescription,
    setSuggestedDescription,
    uploadError,
    setUploadError,
    extractedKeywords,
    setExtractedKeywords,
    extractedResearchers,
    setExtractedResearchers,
    processingProgress,
    processingFailed,
    handleFileChange,
    handleFileUpload,
    onSubmit,
    resetExtractedData,
    formSchema
  };
};
