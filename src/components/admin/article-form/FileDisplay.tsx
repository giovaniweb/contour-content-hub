
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";

interface FileDisplayProps {
  fileUrl: string | null;
  file: File | null;
  setFileUrl: (url: string | null) => void;
  setFile: (file: File | null) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUpload: () => void;
  isProcessing: boolean;
  processingProgress: string | null;
}

const FileDisplay: React.FC<FileDisplayProps> = ({
  fileUrl,
  file,
  setFileUrl,
  setFile,
  handleFileChange,
  handleFileUpload,
  isProcessing,
  processingProgress
}) => {
  if (fileUrl) {
    return (
      <div className="space-y-2">
        <Label>Arquivo enviado</Label>
        <div className="p-3 bg-muted rounded-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Arquivo PDF enviado com sucesso</p>
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Visualizar arquivo
            </a>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setFileUrl(null);
              setFile(null);
            }}
          >
            <X className="h-4 w-4 mr-1" />
            Remover
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <Label htmlFor="file_upload2">Ou faça upload do artigo (PDF, max 10MB)</Label>
      <Input
        id="file_upload2"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
      {file && !isProcessing && (
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-muted-foreground">
            Arquivo selecionado: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
          <Button 
            type="button"
            variant="secondary"
            onClick={handleFileUpload}
            size="sm"
          >
            Processar Arquivo
          </Button>
        </div>
      )}
      {isProcessing && (
        <div className="flex items-center mt-2">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          <p className="text-sm text-muted-foreground">
            {processingProgress || "Processando arquivo..."}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileDisplay;
