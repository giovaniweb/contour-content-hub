
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useEquipments } from "@/hooks/useEquipments";
import { useExtractedData } from "./useExtractedData";
import { useUploadHandler } from "./useUploadHandler";
import { unifiedDocumentService } from "@/services/unifiedDocuments";

// Define form schema
export const formSchema = z.object({
  titulo: z.string().min(3, { message: "Título precisa ter pelo menos 3 caracteres" }),
  descricao: z.string().optional(),
  equipamento_id: z.string().optional(),
  idioma_original: z.string().default("pt"),
  link_dropbox: z.string().url({ message: "Link inválido" }).optional().or(z.literal("")),
});

export type FormValues = z.infer<typeof formSchema>;

interface UseScientificArticleFormProps {
  articleData?: any;
  onSuccess: (articleData?: any) => void;
  onCancel: () => void;
  isOpen?: boolean;
  forceClearState?: boolean;
}

export function useScientificArticleForm({
  articleData,
  onSuccess,
  onCancel,
  isOpen = true,
  forceClearState = false
}: UseScientificArticleFormProps) {
  const instanceId = useRef(`form-instance-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      equipamento_id: "",
      idioma_original: "pt",
      link_dropbox: ""
    }
  });

  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { equipments } = useEquipments();

  const {
    suggestedTitle,
    suggestedDescription,
    extractedKeywords,
    extractedResearchers,
    handleExtractedData,
    resetExtractedData,
  } = useExtractedData({
    initialData: articleData ? {
      title: articleData.titulo_extraido || "",
      description: articleData.texto_completo || "",
      keywords: articleData.palavras_chave || [],
      researchers: articleData.autores || []
    } : undefined,
    forceClearState
  });
  
  const {
    file,
    setFile,
    fileUrl,
    setFileUrl,
    isProcessing,
    processingProgress,
    processingFailed,
    uploadError: handlerUploadError,
    setUploadError: setHandlerUploadError,
    handleFileChange,
    handleFileUpload,
    handleClearFile,
    resetUploadState
  } = useUploadHandler({
    onExtractedData: handleExtractedData,
    onError: (message) => setUploadError(message),
    onReset: () => {
      setUploadError(null);
      resetExtractedData();
    },
    forceClearState
  });

  // Reset form when component is mounted
  useEffect(() => {
    console.log(`[${instanceId.current}] Component mounted or forceClearState changed`);
    
    const resetAllStates = () => {
      console.log(`[${instanceId.current}] Performing complete state reset`);
      
      form.reset({
        titulo: "",
        descricao: "",
        equipamento_id: "",
        idioma_original: "pt",
        link_dropbox: ""
      });
      
      resetUploadState();
      resetExtractedData();
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      setFileUrl(null);
      setFile(null);
      setUploadError(null);
      setHandlerUploadError(null);
    };
    
    if (forceClearState || !articleData) {
      resetAllStates();
    }
    
    if (articleData) {
      console.log(`[${instanceId.current}] Initializing form with article data:`, articleData.id);
      form.reset({
        titulo: articleData.titulo_extraido || "",
        descricao: articleData.texto_completo || "",
        equipamento_id: articleData.equipamento_id || "",
        idioma_original: articleData.idioma_original || "pt",
        link_dropbox: articleData.file_path ? `${supabase.supabaseUrl}/storage/v1/object/public/documents/${articleData.file_path}` : ""
      });
      
      if (articleData.file_path) {
        setFileUrl(`${supabase.supabaseUrl}/storage/v1/object/public/documents/${articleData.file_path}`);
      }
    } else {
      console.log(`[${instanceId.current}] Initializing form for new article`);
      resetAllStates();
    }
    
    return () => {
      console.log(`[${instanceId.current}] ScientificArticleForm unmounting, resetting all states`);
      resetAllStates();
    };
  }, [forceClearState, articleData, form, resetUploadState, resetExtractedData, setFileUrl, setFile, setHandlerUploadError]);

  // Auto process file when it's selected
  useEffect(() => {
    if (file && !fileUrl && !isProcessing) {
      console.log(`[${instanceId.current}] New file detected, auto-processing...`);
      handleFileUpload().then((success) => {
        if (success) {
          console.log(`[${instanceId.current}] Auto-processing successful`);
        }
      });
    }
  }, [file, fileUrl, isProcessing, handleFileUpload]);

  // Update form when suggested data changes
  useEffect(() => {
    if (suggestedTitle) {
      console.log(`[${instanceId.current}] Updating title with suggestion:`, suggestedTitle);
      form.setValue("titulo", suggestedTitle);
    }
    
    if (suggestedDescription) {
      console.log(`[${instanceId.current}] Updating description with suggestion:`, suggestedDescription);
      form.setValue("descricao", suggestedDescription);
    }
  }, [suggestedTitle, suggestedDescription, form]);

  // Set file URL from article data if present
  useEffect(() => {
    if (articleData?.file_path && !fileUrl) {
      console.log(`[${instanceId.current}] Setting file URL from article:`, articleData.file_path);
      setFileUrl(`${supabase.supabaseUrl}/storage/v1/object/public/documents/${articleData.file_path}`);
    } else if (!articleData && !forceClearState) {
      console.log(`[${instanceId.current}] Clearing file URL for new article`);
      setFileUrl(null);
    }
  }, [articleData, fileUrl, setFileUrl, forceClearState]);

  // Update form's link_dropbox field when fileUrl changes
  useEffect(() => {
    if (fileUrl) {
      console.log(`[${instanceId.current}] Updating link_dropbox in form with:`, fileUrl);
      form.setValue("link_dropbox", fileUrl);
    } else {
      console.log(`[${instanceId.current}] Clearing link_dropbox in form`);
      form.setValue("link_dropbox", "");
    }
  }, [fileUrl, form]);

  // Handle file upload and extraction
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`[${instanceId.current}] File input changed`);
    
    resetExtractedData();
    form.setValue("titulo", "");
    form.setValue("descricao", "");
    
    handleFileChange(e);
  };

  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      console.log("Submitting form with values:", values);
      
      const finalFileUrl = values.link_dropbox || null;
      
      // Construct article payload for unified_documents
      const articlePayload = {
        titulo_extraido: values.titulo,
        texto_completo: values.descricao || null,
        equipamento_id: values.equipamento_id === "none" || !values.equipamento_id ? null : values.equipamento_id,
        tipo_documento: 'artigo_cientifico' as const,
        file_path: file ? fileUrl?.replace(`${supabase.supabaseUrl}/storage/v1/object/public/documents/`, '') : null,
        status_processamento: 'pendente' as const,
        palavras_chave: extractedKeywords || [],
        autores: extractedResearchers || []
      };

      console.log("Submitting article payload:", articlePayload);

      let savedArticleData = null;

      if (articleData && articleData.id) {
        // Update existing article
        savedArticleData = await unifiedDocumentService.updateDocument(articleData.id, articlePayload);
        console.log("Article updated successfully:", savedArticleData);
      } else {
        // Create new article
        savedArticleData = await unifiedDocumentService.createDocument(articlePayload);
        console.log("Article created successfully:", savedArticleData);
        
        // Auto-process if we have a file
        if (savedArticleData.file_path) {
          try {
            await unifiedDocumentService.processDocument(savedArticleData.id);
            console.log("Auto-processing initiated for document:", savedArticleData.id);
          } catch (processError) {
            console.warn("Auto-processing failed, but document was created:", processError);
          }
        }
      }

      // Clear form before calling onSuccess
      form.reset();
      resetUploadState();
      resetExtractedData();
      
      toast.success(articleData ? "Artigo atualizado" : "Artigo criado", {
        description: articleData 
          ? "O artigo científico foi atualizado com sucesso."
          : "O novo artigo científico foi adicionado com sucesso."
      });
      
      onSuccess(savedArticleData);
    } catch (error: any) {
      console.error('Error saving article:', error);
      toast.error("Erro ao salvar artigo", {
        description: "Não foi possível salvar o artigo científico. Por favor, tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle cancel
  const handleCancel = () => {
    console.log(`[${instanceId.current}] Canceling and clearing form`);
    form.reset();
    resetUploadState();
    resetExtractedData();
    onCancel();
  };

  return {
    form,
    isLoading,
    file,
    fileUrl,
    fileInputRef,
    isProcessing,
    uploadError: uploadError || handlerUploadError,
    processingProgress,
    processingFailed,
    extractedKeywords,
    extractedResearchers,
    suggestedTitle,
    suggestedDescription,
    equipments,
    onFileChange,
    onSubmit,
    handleFileUpload,
    handleClearFile,
    handleCancel
  };
}
