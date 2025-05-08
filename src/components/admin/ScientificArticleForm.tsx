
import React from "react";
import { Form } from "@/components/ui/form";
import ArticleInfoDisplay from "./article-form/ArticleInfoDisplay";
import ArticleFormFields from "./article-form/ArticleFormFields";
import FormFileSection from "./article-form/FormFileSection";
import FormErrorDisplay from "./article-form/FormErrorDisplay";
import FormActions from "./article-form/FormActions";
import { useScientificArticleForm } from "./article-form/useScientificArticleForm";

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
  const {
    form,
    isLoading,
    file,
    fileUrl,
    fileInputRef,
    isProcessing,
    uploadError,
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
  } = useScientificArticleForm({
    articleData,
    onSuccess,
    onCancel,
    isOpen,
    forceClearState
  });

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload Section */}
          <FormFileSection
            file={file}
            fileUrl={fileUrl}
            isProcessing={isProcessing}
            uploadError={uploadError}
            processingProgress={processingProgress}
            onFileChange={onFileChange}
            onProcessFile={handleFileUpload}
            onClearFile={() => {
              handleClearFile();
              form.setValue("titulo", "");
              form.setValue("descricao", "");
            }}
            fileInputRef={fileInputRef}
          />

          {/* Extracted information display */}
          <ArticleInfoDisplay 
            extractedKeywords={extractedKeywords} 
            extractedResearchers={extractedResearchers}
            suggestedTitle={suggestedTitle}
            suggestedDescription={suggestedDescription}
            processingFailed={processingFailed} 
          />

          {/* Error display */}
          <FormErrorDisplay error={uploadError} />

          {/* Form fields */}
          <ArticleFormFields 
            form={form} 
            equipments={equipments} 
          />
          
          {/* Form actions */}
          <FormActions
            isLoading={isLoading}
            isProcessing={isProcessing}
            onCancel={handleCancel}
          />
        </form>
      </Form>
    </div>
  );
};

export default ScientificArticleForm;
