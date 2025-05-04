
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useArticleForm, FormValues } from "./article-form/useArticleForm";
import FileUploader from "./article-form/FileUploader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ArticleInfoDisplay from "./article-form/ArticleInfoDisplay";
import ArticleFormFields from "./article-form/ArticleFormFields";
import FilePreview from "./article-form/FilePreview";
import { useUploadHandler } from "./article-form/useUploadHandler";
import { useExtractedData } from "./article-form/useExtractedData";
import { toast } from "sonner";

interface ArticleFormProps {
  articleData?: any;
  onSuccess: (articleData?: any) => void;
  onCancel: () => void;
  isOpen?: boolean;
  forceClearState?: boolean; // Add flag to force state clearing
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
  
  // Extract extracted data handling with initialData only if this is an edit
  const {
    suggestedTitle,
    suggestedDescription,
    extractedKeywords,
    extractedResearchers,
    handleExtractedData,
    resetExtractedData
  } = useExtractedData({
    // Only pass initialData if we're editing an existing article
    initialData: articleData ? {
      title: articleData.titulo || "",
      description: articleData.descricao || "",
      keywords: articleData.keywords || [],
      researchers: articleData.researchers || []
    } : undefined,
    forceClearState: forceClearState || !articleData // Force clear if explicitly requested or new article
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
    forceClearState: forceClearState || !articleData // Force clear if explicitly requested or new article
  });
  
  // Extract form state handling
  const [uploadStep, setUploadStep] = React.useState<'upload' | 'form'>(articleData ? 'form' : 'upload');
  console.log(`[${instanceId.current}] Estado atual do uploadStep:`, uploadStep);
  
  const {
    isLoading,
    equipments,
    resetFormState,
    onSubmit,
    formSchema
  } = useArticleForm(articleData, (data) => {
    // Clear form before calling onSuccess
    form.reset();
    resetFormState();
    resetUploadState();
    resetExtractedData();
    toast.success(articleData ? "Artigo atualizado" : "Artigo criado", {
      description: articleData 
        ? "O artigo científico foi atualizado com sucesso."
        : "O novo artigo científico foi adicionado com sucesso."
    });
    onSuccess(data);
  }, isOpen);
  
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
      resetFormState();
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
    if (forceClearState) {
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
  }, [forceClearState]);

  // Track dialog open/closed state and reset form when opened
  useEffect(() => {
    console.log(`[${instanceId.current}] isOpen or articleData changed:`, isOpen, articleData?.id);
    if (isOpen) {
      console.log(`[${instanceId.current}] Dialog open, resetting form`);
      
      // Reset file input value
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Initialize form with articleData or empty values
      if (articleData) {
        console.log(`[${instanceId.current}] Filling form with article data:`, articleData.titulo);
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
        console.log(`[${instanceId.current}] Clearing form for new article`);
        form.reset({
          titulo: "",
          descricao: "",
          equipamento_id: "",
          idioma_original: "pt",
          link_dropbox: ""
        });
        
        // For new articles, ensure everything is reset
        setFileUrl(null);
        setFile(null);
        resetExtractedData();
      }
    }
  }, [isOpen, articleData]);

  // Update form when suggested data changes - but only if fields are empty
  useEffect(() => {
    const currentTitle = form.getValues("titulo");
    const currentDesc = form.getValues("descricao");
    
    // Only update form with suggested data if the form fields are empty or very short
    // This prevents overwriting user input
    if (suggestedTitle && (!currentTitle || currentTitle.length < 5)) {
      console.log(`[${instanceId.current}] Updating title with suggestion:`, suggestedTitle);
      form.setValue("titulo", suggestedTitle);
    }
    
    if (suggestedDescription && (!currentDesc || currentDesc.length < 10)) {
      console.log(`[${instanceId.current}] Updating description with suggestion:`, suggestedDescription);
      form.setValue("descricao", suggestedDescription);
    }
  }, [suggestedTitle, suggestedDescription, form]);

  // Set file URL from article data if present
  useEffect(() => {
    if (articleData?.link_dropbox && !fileUrl) {
      console.log(`[${instanceId.current}] Setting file URL from article:`, articleData.link_dropbox);
      setFileUrl(articleData.link_dropbox);
      setUploadStep('form');
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

  // Upload step UI
  if (uploadStep === 'upload') {
    return (
      <FileUploader 
        file={file}
        setFile={setFile}
        fileUrl={fileUrl}
        setFileUrl={setFileUrl}
        isProcessing={isProcessing}
        uploadError={uploadError || handlerUploadError}
        processingProgress={processingProgress}
        processingFailed={processingFailed}
        onProcessFile={handleFileUpload}
        onSetUploadStep={setUploadStep}
        onResetData={resetExtractedData}
      />
    );
  }

  // Form step UI
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          
          {/* File preview */}
          {(file || fileUrl || articleData?.link_dropbox) && (
            <div className="mt-4">
              <FilePreview 
                file={file} 
                fileUrl={fileUrl || articleData?.link_dropbox} 
                onClearFile={handleClearFile} 
              />
            </div>
          )}
          
          {/* Alternative file upload in form step */}
          {!file && !fileUrl && !articleData?.link_dropbox && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Anexar documento PDF</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-white
                    hover:file:bg-primary/90"
                />
                
                {file && !fileUrl && !isProcessing && (
                  <Button 
                    type="button"
                    onClick={() => {
                      console.log(`[${instanceId.current}] Process file button clicked`);
                      handleFileUpload();
                    }}
                    disabled={isProcessing}
                  >
                    Processar arquivo
                  </Button>
                )}
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // Clear form before canceling
                console.log(`[${instanceId.current}] Canceling and clearing form`);
                form.reset();
                resetFormState();
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
