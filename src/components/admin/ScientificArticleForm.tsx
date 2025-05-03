
import React, { useEffect } from "react";
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
  const {
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
    extractedResearchers,
    processingProgress,
    processingFailed,
    handleFileChange,
    handleFileUpload,
    onSubmit,
    resetExtractedData,
    resetFormState,
    formSchema
  } = useArticleForm(articleData, (data) => {
    // Limpar o formulário antes de chamar onSuccess
    form.reset();
    resetFormState();
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
      console.log("ScientificArticleForm unmounting, resetting all state");
      resetFormState();
      form.reset();
    };
  }, []);

  // Track dialog open/closed state
  useEffect(() => {
    console.log("isOpen changed:", isOpen);
    if (isOpen) {
      console.log("Dialog opened, resetting form");
      form.reset({
        titulo: articleData?.titulo || "",
        descricao: articleData?.descricao || "",
        equipamento_id: articleData?.equipamento_id || "",
        idioma_original: articleData?.idioma_original || "pt",
        link_dropbox: articleData?.link_dropbox || ""
      });
    }
  }, [isOpen, articleData, form]);

  // Atualizar form quando dados sugeridos mudarem
  useEffect(() => {
    console.log("Suggested data changed, updating form:", {
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

  // Limpar arquivo e resetar processamento
  const handleClearFile = () => {
    setFile(null);
    setFileUrl(null);
  };

  // Upload step UI
  if (uploadStep === 'upload') {
    return (
      <FileUploader 
        file={file}
        setFile={setFile}
        fileUrl={fileUrl}
        setFileUrl={setFileUrl}
        isProcessing={isProcessing}
        uploadError={uploadError}
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
          {/* Informações extraídas */}
          <ExtractedInfo 
            extractedKeywords={extractedKeywords} 
            extractedResearchers={extractedResearchers} 
          />

          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          {/* Campos do formulário */}
          <ArticleFormFields 
            form={form} 
            equipments={equipments} 
          />
          
          {/* Visualização do arquivo */}
          {(file || fileUrl) && (
            <div className="mt-4">
              <FilePreview 
                file={file} 
                fileUrl={fileUrl} 
                onClearFile={handleClearFile} 
              />
            </div>
          )}
          
          {/* Alternativa para upload de arquivo na etapa de formulário */}
          {!file && !fileUrl && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Anexar documento PDF</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
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
                    onClick={handleFileUpload}
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
                // Limpar formulário antes de cancelar
                form.reset();
                resetFormState();
                onCancel();
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
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
