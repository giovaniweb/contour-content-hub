
import React from "react";
import FileUploadSection from "./FileUploadSection";
import FilePreview from "./FilePreview";

interface FormFileSectionProps {
  file: File | null;
  fileUrl: string | null;
  isProcessing: boolean;
  uploadError: string | null;
  processingProgress: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProcessFile: () => Promise<boolean>;
  onClearFile: () => void;
  fileInputRef?: React.RefObject<HTMLInputElement>;
}

const FormFileSection: React.FC<FormFileSectionProps> = ({
  file,
  fileUrl,
  isProcessing,
  uploadError,
  processingProgress,
  onFileChange,
  onProcessFile,
  onClearFile,
  fileInputRef
}) => {
  return (
    <div className="mb-6 border rounded-md p-4 bg-muted/20">
      <h3 className="text-lg font-medium mb-2">Anexar artigo científico (PDF)</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Anexe um arquivo PDF para extração automática dos dados do artigo
      </p>
      
      <FileUploadSection
        file={file}
        fileUrl={fileUrl} 
        isProcessing={isProcessing}
        uploadError={uploadError}
        processingProgress={processingProgress}
        onFileChange={onFileChange}
        onProcessFile={onProcessFile}
        onClearFile={onClearFile}
        fileInputRef={fileInputRef}
      />
      
      {(file || fileUrl) && (
        <FilePreview 
          file={file} 
          fileUrl={fileUrl} 
          onClearFile={onClearFile} 
        />
      )}
    </div>
  );
};

export default FormFileSection;
