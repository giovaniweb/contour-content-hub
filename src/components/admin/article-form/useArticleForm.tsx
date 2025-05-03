
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

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

export const useArticleForm = (articleData: ArticleData | undefined, onSuccess: () => void) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [equipments, setEquipments] = useState<{id: string, nome: string}[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploadStep, setUploadStep] = useState<'upload' | 'form'>(articleData ? 'form' : 'upload');
  const [suggestedTitle, setSuggestedTitle] = useState<string>('');
  const [suggestedDescription, setSuggestedDescription] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [extractedResearchers, setExtractedResearchers] = useState<string[]>([]);
  const [processingProgress, setProcessingProgress] = useState<string | null>(null);
  const [processingFailed, setProcessingFailed] = useState<boolean>(false);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const { data, error } = await supabase
          .from('equipamentos')
          .select('id, nome')
          .eq('ativo', true)
          .order('nome');
          
        if (error) throw error;
        
        setEquipments(data || []);
      } catch (error) {
        console.error('Error fetching equipments:', error);
        toast({
          variant: "destructive",
          title: "Erro ao buscar equipamentos",
          description: "Não foi possível carregar a lista de equipamentos."
        });
      }
    };
    
    fetchEquipments();
  }, [toast]);

  const resetExtractedData = useCallback(() => {
    console.log("Resetting extracted data");
    setSuggestedTitle('');
    setSuggestedDescription('');
    setExtractedKeywords([]);
    setExtractedResearchers([]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setUploadError(null);
      setProcessingFailed(false);
      
      // Reset all extracted information when a new file is selected
      resetExtractedData();
      
      // Check if file is PDF
      if (selectedFile.type !== 'application/pdf') {
        toast({
          variant: "destructive",
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo em formato PDF."
        });
        return;
      }
      
      // Check file size (max 10MB)
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
      setProcessingProgress("Lendo arquivo e extraindo conteúdo...");
      
      // Reset all extracted data before processing new file
      resetExtractedData();
      
      // Read file as base64
      const fileReader = new FileReader();
      const fileContentPromise = new Promise<string>((resolve, reject) => {
        fileReader.onload = (e) => resolve(e.target?.result as string);
        fileReader.onerror = (e) => reject(e);
      });
      fileReader.readAsDataURL(file);
      const fileContent = await fileContentPromise;
      
      setProcessingProgress("Analisando conteúdo do documento...");
      
      // Process document content with edge function
      const processResponse = await supabase.functions.invoke('process-document', {
        body: { fileContent: fileContent.split(',')[1] } // Remove data URL prefix
      });
      
      if (processResponse.error) {
        console.error("Error processing document:", processResponse.error);
        throw new Error("Falha ao extrair conteúdo do documento");
      }
      
      const extractionData = processResponse.data;
      console.log("Extracted data:", extractionData);
      
      if (extractionData) {
        // Set extracted data - clean up the title first
        let cleanTitle = extractionData.title || file.name.replace('.pdf', '').replace(/_/g, ' ');
        
        // Remove prefixes like "1 " and suffixes like "OK" from the filename-based title
        cleanTitle = cleanTitle.replace(/^\d+\s+/, '');
        cleanTitle = cleanTitle.replace(/\s+OK$/i, '');
        
        setSuggestedTitle(cleanTitle);
        setSuggestedDescription(extractionData.conclusion || '');
        setExtractedKeywords(extractionData.keywords || []);
        setExtractedResearchers(extractionData.researchers || []);

        // Upload file to storage
        setProcessingProgress("Enviando arquivo para armazenamento...");
        try {
          const fileName = `articles/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          
          // In production, use the storage API
          // For development, we'll mock the storage upload success
          /* Uncomment for production 
          const { error: uploadError, data: uploadData } = await supabase
            .storage
            .from('documents')
            .upload(fileName, file);
          */
          
          // For development (mocking success):
          const uploadError = null;
          const uploadData = { path: fileName };
          
          if (!uploadError && uploadData) {
            // For development (mock URL):
            const tempFileUrl = URL.createObjectURL(file);
            setFileUrl(tempFileUrl);
            
            /* Uncomment for production:
            const { data: urlData } = supabase
              .storage
              .from('documents')
              .getPublicUrl(fileName);
              
            setFileUrl(urlData.publicUrl);
            */
          } else {
            console.warn("Storage upload failed:", uploadError);
            setUploadError("Não foi possível fazer upload do arquivo, mas você pode continuar com as informações extraídas.");
          }
        } catch (storageError: any) {
          console.warn("Error during storage upload:", storageError);
          setUploadError("Não foi possível fazer upload do arquivo, mas você pode continuar com as informações extraídas.");
        }
        
        // Move to form step right away
        setProcessingProgress(null);
        setUploadStep('form');
        toast({
          title: "Documento processado",
          description: "Informações extraídas com sucesso do documento."
        });
      } else {
        setProcessingFailed(true);
        throw new Error("Nenhuma informação foi extraída do documento");
      }
    } catch (error: any) {
      console.error('Error processing file:', error);
      setUploadError(error.message || "Ocorreu um erro ao processar o arquivo. Por favor, tente novamente ou forneça um link externo.");
      setProcessingFailed(true);
      toast({
        variant: "destructive",
        title: "Erro no processamento",
        description: "Não foi possível processar o arquivo. Por favor, tente novamente."
      });
      
      // Even on error, try to prepopulate the form with the filename at least
      if (file) {
        const suggestedTitleFromFilename = file.name
          .replace('.pdf', '')
          .replace(/_/g, ' ')
          .replace(/^\d+\s+/, '') // Remove leading numbers and spaces
          .replace(/\s+OK$/i, ''); // Remove trailing OK
          
        setSuggestedTitle(suggestedTitleFromFilename);
        
        // Continue to form step even when extraction fails
        setUploadStep('form');
      }
    } finally {
      setIsProcessing(false);
      setProcessingProgress(null);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      
      // Use the fileUrl from the upload step or the link_dropbox value
      const finalFileUrl = fileUrl || values.link_dropbox || null;
      
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

      if (articleData && articleData.id) {
        // Update existing article
        const { error } = await supabase
          .from('documentos_tecnicos')
          .update(articlePayload)
          .eq('id', articleData.id);
          
        if (error) throw error;

        toast({
          title: "Artigo atualizado",
          description: "O artigo científico foi atualizado com sucesso."
        });
      } else {
        // Create new article
        const { error } = await supabase
          .from('documentos_tecnicos')
          .insert([articlePayload]);
          
        if (error) throw error;

        toast({
          title: "Artigo criado",
          description: "O novo artigo científico foi adicionado com sucesso."
        });
      }

      onSuccess();
    } catch (error) {
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
