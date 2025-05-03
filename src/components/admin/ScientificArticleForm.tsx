
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useArticleForm, FormValues } from "./article-form/useArticleForm";
import FileUploader from "./article-form/FileUploader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ExtractedInfo from "./article-form/ExtractedInfo";
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
}

const ScientificArticleForm: React.FC<ArticleFormProps> = ({ 
  articleData,
  onSuccess, 
  onCancel,
  isOpen = true
}) => {
  // Extract extracted data handling
  const {
    suggestedTitle,
    suggestedDescription,
    extractedKeywords,
    extractedResearchers,
    handleExtractedData,
    resetExtractedData
  } = useExtractedData({
    initialData: articleData
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
    }
  });
  
  // Extract form state handling
  const [uploadStep, setUploadStep] = React.useState<'upload' | 'form'>(articleData ? 'form' : 'upload');
  
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
      titulo: articleData?.titulo || "",
      descricao: articleData?.descricao || "",
      equipamento_id: articleData?.equipamento_id || "",
      idioma_original: articleData?.idioma_original || "pt",
      link_dropbox: articleData?.link_dropbox || ""
    }
  });

  // Reset form when component is mounted or unmounted
  useEffect(() => {
    // Clean up function
    return () => {
      console.log("ScientificArticleForm desmontando, redefinindo todos os estados");
      resetFormState();
      resetUploadState();
      resetExtractedData();
      form.reset();
    };
  }, []);

  // Track dialog open/closed state and reset form when opened
  useEffect(() => {
    console.log("isOpen mudou:", isOpen);
    if (isOpen) {
      console.log("Diálogo aberto, redefinindo formulário");
      // Reset all form state
      resetFormState();
      resetUploadState();
      resetExtractedData();
      
      // Reset file input value
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      form.reset({
        titulo: articleData?.titulo || "",
        descricao: articleData?.descricao || "",
        equipamento_id: articleData?.equipamento_id || "",
        idioma_original: articleData?.idioma_original || "pt",
        link_dropbox: articleData?.link_dropbox || ""
      });
    }
  }, [isOpen, articleData, form, resetFormState, resetUploadState, resetExtractedData]);

  // Update form when suggested data changes
  useEffect(() => {
    console.log("Dados sugeridos alterados, atualizando formulário:", {
      title: suggestedTitle,
      description: suggestedDescription
    });
    
    if (suggestedTitle && !form.getValues("titulo")) {
      form.setValue("titulo", suggestedTitle);
    }
    
    if (suggestedDescription && !form.getValues("descricao")) {
      form.setValue("descricao", suggestedDescription);
    }
  }, [suggestedTitle, suggestedDescription, form]);

  // Set file URL from article data if present
  useEffect(() => {
    if (articleData?.link_dropbox && !fileUrl) {
      setFileUrl(articleData.link_dropbox);
      setUploadStep('form');
    }
  }, [articleData, fileUrl]);

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
          {/* Extracted information */}
          <ExtractedInfo 
            extractedKeywords={extractedKeywords} 
            extractedResearchers={extractedResearchers} 
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
                      console.log("Botão de processar arquivo clicado");
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
