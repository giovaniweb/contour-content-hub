
import React from "react";
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
}

const ScientificArticleForm: React.FC<ArticleFormProps> = ({ 
  articleData,
  onSuccess, 
  onCancel 
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
    formSchema
  } = useArticleForm(articleData, (data) => onSuccess(data));
  
  // Initialize form using React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: articleData?.titulo || suggestedTitle || "",
      descricao: articleData?.descricao || suggestedDescription || "",
      equipamento_id: articleData?.equipamento_id || "",
      idioma_original: articleData?.idioma_original || "pt",
      link_dropbox: articleData?.link_dropbox || ""
    }
  });

  // Update form values when suggested data is updated
  React.useEffect(() => {
    if (suggestedTitle && !form.getValues("titulo")) {
      form.setValue("titulo", suggestedTitle);
    }
    
    if (suggestedDescription && !form.getValues("descricao")) {
      form.setValue("descricao", suggestedDescription);
    }
  }, [suggestedTitle, suggestedDescription, form]);

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

  // Form step UI with extracted information
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Extracted information alert */}
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

          {/* Form Fields */}
          <ArticleFormFields 
            form={form} 
            equipments={equipments} 
            fileUrl={fileUrl} 
            file={file} 
          />
          
          {/* File preview */}
          <FilePreview file={file} fileUrl={fileUrl} />
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
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
