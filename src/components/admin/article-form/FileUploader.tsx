
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FileUp, Upload, Loader2, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

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
}

const FileUploader: React.FC<FileUploaderProps> = ({
  file,
  setFile,
  fileUrl,
  setFileUrl,
  isProcessing,
  uploadError,
  processingProgress,
  processingFailed,
  onProcessFile,
  onSetUploadStep,
}) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Check if file is PDF
      if (selectedFile.type !== 'application/pdf') {
        toast({
          variant: "destructive",
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo em formato PDF."
        });
        return;
      }
      
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Arquivo muito grande",
          description: "O tamanho máximo permitido é 10MB."
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  // Upload step UI
  return (
    <div className="space-y-6">
      {uploadError && (
        <Alert variant="destructive">
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
            />
          </label>
        </div>
        {file && (
          <Card className="mt-4">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button 
                  onClick={onProcessFile}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {processingProgress || "Processando..."}
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Processar Artigo
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="mt-4">
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
