
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import ArticleInfoDisplay from "./article-form/ArticleInfoDisplay";
import ArticleFormFields from "./article-form/ArticleFormFields";
import FilePreview from "./article-form/FilePreview";
import { useUploadHandler } from "./article-form/useUploadHandler";
import { useExtractedData } from "./article-form/useExtractedData";
import FileUploadSection from "./article-form/FileUploadSection";
import { useEquipments } from "@/hooks/useEquipments";

// Define form schema first to avoid using before declaration
const formSchema = z.object({
  titulo: z.string().min(3, { message: "Título precisa ter pelo menos 3 caracteres" }),
  descricao: z.string().optional(),
  equipamento_id: z.string().optional(),
  idioma_original: z.string().default("pt"),
  link_dropbox: z.string().url({ message: "Link inválido" }).optional().or(z.literal("")),
});

export type FormValues = z.infer<typeof formSchema>;

interface ArticleFormProps {
  articleData?: any;
  onSuccess: (articleData?: any) => void;
  onCancel: () => void;
  isOpen?: boolean;
  forceClearState?: boolean;
}

const ScientificArticleForm: React.FC<ArticleFormProps> = ({ 
  articleData,
  onSuccess, 
  onCancel,
  isOpen = true,
  forceClearState = false
}) => {
  // For debugging and key generation
  const instanceId = useRef(`form-instance-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  
  console.log(`[${instanceId.current}] ScientificArticleForm rendering, article:`, 
    articleData?.id || 'novo', "isOpen:", isOpen, "forceClearState:", forceClearState);
  
  // Extract extracted data handling - no initial data for new articles
  const {
    suggestedTitle,
    suggestedDescription,
    extractedKeywords,
    extractedResearchers,
    handleExtractedData,
    resetExtractedData,
    setSuggestedTitle,
    setSuggestedDescription,
    setExtractedKeywords,
    setExtractedResearchers
  } = useExtractedData({
    // Only pass initialData if we're editing an existing article
    initialData: articleData ? {
      title: articleData.titulo || "",
      description: articleData.descricao || "",
      keywords: articleData.keywords || [],
      researchers: articleData.researchers || []
    } : undefined,
    forceClearState // Always force clear for new extraction
  });
  
  // Extract file upload handling
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    forceClearState // Always force clear for new extraction
  });
  
  // Initialize form using React Hook Form
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

  // Get equipments for the dropdown
  const { equipments } = useEquipments();
  
  // State for form submission
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when component is mounted
  useEffect(() => {
    console.log(`[${instanceId.current}] Component mounted or forceClearState changed`);
    
    // Perform a complete state reset on mount
    const resetAllStates = () => {
      console.log(`[${instanceId.current}] Performing complete state reset`);
      
      // Reset form first
      form.reset({
        titulo: "",
        descricao: "",
        equipamento_id: "",
        idioma_original: "pt",
        link_dropbox: ""
      });
      
      // Reset all other states
      resetUploadState();
      resetExtractedData();
      
      // Reset file input value
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Reset URL and file state
      setFileUrl(null);
      setFile(null);
      
      // Reset errors
      setUploadError(null);
      setHandlerUploadError(null);
    };
    
    // If forcing clear state, reset everything
    if (forceClearState || !articleData) {
      resetAllStates();
    }
    
    // Complete initialization with articleData if present
    if (articleData) {
      console.log(`[${instanceId.current}] Initializing form with article data:`, articleData.id);
      form.reset({
        titulo: articleData.titulo || "",
        descricao: articleData.descricao || "",
        equipamento_id: articleData.equipamento_id || "",
        idioma_original: articleData.idioma_original || "pt",
        link_dropbox: articleData.link_dropbox || ""
      });
      
      if (articleData.link_dropbox) {
        setFileUrl(articleData.link_dropbox);
      }
    } else {
      console.log(`[${instanceId.current}] Initializing form for new article`);
      // Explicitly reset form for new article
      resetAllStates();
    }
    
    // Clean up function
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
    // Always update form with extracted data immediately
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
    if (articleData?.link_dropbox && !fileUrl) {
      console.log(`[${instanceId.current}] Setting file URL from article:`, articleData.link_dropbox);
      setFileUrl(articleData.link_dropbox);
    } else if (!articleData && !forceClearState) {
      // If this is a new article and not already reset, clear file URL
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
      // If fileUrl is cleared, reset the form field too
      console.log(`[${instanceId.current}] Clearing link_dropbox in form`);
      form.setValue("link_dropbox", "");
    }
  }, [fileUrl, form]);

  // Handle file upload and extraction
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`[${instanceId.current}] File input changed`);
    
    // Clear previous extracted data
    resetExtractedData();
    
    // Clear form fields to ensure no old data is shown
    form.setValue("titulo", "");
    form.setValue("descricao", "");
    
    // Handle file change
    handleFileChange(e);
  };

  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      console.log("Submitting form with values:", values);
      
      // Use fileUrl from upload step or value of link_dropbox
      const finalFileUrl = values.link_dropbox || null;
      
      // Construct article payload
      const articlePayload = {
        titulo: values.titulo,
        descricao: values.descricao || null,
        equipamento_id: values.equipamento_id === "none" ? null : values.equipamento_id || null,
        tipo: 'artigo_cientifico',
        idioma_original: values.idioma_original,
        link_dropbox: finalFileUrl,
        status: 'ativo',
        criado_por: (await supabase.auth.getUser()).data.user?.id || null
      };

      console.log("Submitting article payload:", articlePayload);

      let savedArticleData = null;

      if (articleData && articleData.id) {
        // Update existing article
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
        console.log("Article updated successfully:", savedArticleData);
      } else {
        // Create new article
        const { error, data } = await supabase
          .from('documentos_tecnicos')
          .insert([articlePayload])
          .select();
          
        if (error) {
          console.error("Error inserting article:", error);
          throw error;
        }

        savedArticleData = data ? data[0] : null;
        console.log("Article created successfully:", savedArticleData);
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
      
      // Pass saved data to success handler
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

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload Section - Always shown first */}
          <div className="mb-6 border rounded-md p-4 bg-muted/20">
            <h3 className="text-lg font-medium mb-2">Anexar artigo científico (PDF)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Anexe um arquivo PDF para extração automática dos dados do artigo
            </p>
            
            <FileUploadSection
              file={file}
              fileUrl={fileUrl} 
              isProcessing={isProcessing}
              uploadError={uploadError || handlerUploadError}
              processingProgress={processingProgress}
              onFileChange={onFileChange}
              onProcessFile={handleFileUpload}
              onClearFile={() => {
                handleClearFile();
                resetExtractedData();
                form.setValue("titulo", "");
                form.setValue("descricao", "");
              }}
            />
            
            {(file || fileUrl) && (
              <FilePreview 
                file={file} 
                fileUrl={fileUrl || articleData?.link_dropbox} 
                onClearFile={() => {
                  handleClearFile();
                  resetExtractedData();
                  form.setValue("titulo", "");
                  form.setValue("descricao", "");
                }} 
              />
            )}
          </div>

          {/* Extracted information display */}
          <ArticleInfoDisplay 
            extractedKeywords={extractedKeywords} 
            extractedResearchers={extractedResearchers}
            suggestedTitle={suggestedTitle}
            suggestedDescription={suggestedDescription}
            processingFailed={processingFailed} 
          />

          {(uploadError || handlerUploadError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{uploadError || handlerUploadError}</AlertDescription>
            </Alert>
          )}

          {/* Form fields */}
          <ArticleFormFields 
            form={form} 
            equipments={equipments} 
          />
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // Clear form before canceling
                console.log(`[${instanceId.current}] Canceling and clearing form`);
                form.reset();
                resetUploadState();
                resetExtractedData();
                onCancel();
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isProcessing}
            >
              {isLoading ? "Salvando..." : "Salvar Artigo"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ScientificArticleForm;
