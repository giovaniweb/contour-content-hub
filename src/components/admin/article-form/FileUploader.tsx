
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, Upload, Loader2, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  fileUrl: string | null;
  setFileUrl: (url: string | null) => void;
  isProcessing: boolean;
  uploadError: string | null;
  processingProgress: string | null;
  processingFailed: boolean;
  onProcessFile: () => void;
  onSetUploadStep: (step: 'upload' | 'form') => void;
  onResetData?: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  file,
  setFile,
  isProcessing,
  uploadError,
  processingProgress,
  processingFailed,
  onProcessFile,
  onSetUploadStep,
  onResetData
}) => {
  // Função para limpar o arquivo e dados relacionados
  const clearFile = () => {
    setFile(null);
    if (onResetData) {
      onResetData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sempre limpa o estado anterior completamente
    clearFile();
    
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="file_upload">Faça upload do artigo (PDF, max 10MB)</Label>
        <div className="mt-1 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
          <label 
            htmlFor="file_upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground mb-1">
              Clique para fazer upload de um artigo científico
            </span>
            <span className="text-xs text-muted-foreground">
              PDF (máx. 10MB)
            </span>
            <Input
              id="file_upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={isProcessing}
            />
          </label>
        </div>
        
        {file && !isProcessing && (
          <div className="mt-4 bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearFile}
                  disabled={isProcessing}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={onProcessFile}
                  disabled={isProcessing}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Processar Artigo
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {isProcessing && (
          <div className="mt-4 bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
              <div>
                <p className="font-medium">Processando arquivo</p>
                <p className="text-sm text-muted-foreground">
                  {processingProgress || "Aguarde enquanto processamos o arquivo..."}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Ou <button 
              type="button" 
              className="text-primary hover:underline" 
              onClick={() => onSetUploadStep('form')}
            >
              preencha o formulário manualmente
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
