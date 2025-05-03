
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Upload, FileX } from "lucide-react";

interface FileUploadSectionProps {
  file: File | null;
  fileUrl: string | null;
  isProcessing: boolean;
  uploadError: string | null;
  processingProgress: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProcessFile: () => Promise<boolean>;
  onClearFile: () => void;
  disabled?: boolean;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  file,
  fileUrl,
  isProcessing,
  uploadError,
  processingProgress,
  onFileChange,
  onProcessFile,
  onClearFile,
  disabled = false
}) => {
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Anexar documento PDF</div>
      
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro no upload</AlertTitle>
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      
      {processingProgress && (
        <Alert>
          <div className="flex items-center gap-2">
            <div className="animate-spin">
              <Upload className="h-4 w-4" />
            </div>
            <AlertTitle>Processando...</AlertTitle>
          </div>
          <AlertDescription>{processingProgress}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1">
          <input
            type="file"
            accept="application/pdf"
            onChange={onFileChange}
            disabled={isProcessing || disabled}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-white
              hover:file:bg-primary/90
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        
        <div className="flex gap-2">
          {file && !fileUrl && (
            <Button 
              type="button"
              onClick={onProcessFile}
              disabled={isProcessing || !file || disabled}
              className="flex items-center gap-1"
            >
              <Upload className="h-4 w-4" />
              Processar
            </Button>
          )}
          
          {file && (
            <Button 
              type="button" 
              variant="outline"
              onClick={onClearFile}
              disabled={isProcessing || disabled}
            >
              <FileX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {file && !fileUrl && !isProcessing && (
        <div className="text-xs text-muted-foreground">
          Arquivo selecionado: <span className="font-medium">{file.name}</span> ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
