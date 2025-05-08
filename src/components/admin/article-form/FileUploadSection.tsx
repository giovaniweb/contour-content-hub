
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FileUploadSectionProps {
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

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
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
  if (fileUrl) return null;
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file_upload">Upload do arquivo PDF</Label>
        <Input 
          ref={fileInputRef}
          id="file_upload" 
          type="file" 
          accept="application/pdf" 
          onChange={onFileChange}
          disabled={isProcessing}
          className="mt-1"
        />
      </div>

      {file && !isProcessing && (
        <div className="bg-muted/30 p-3 rounded-md flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onProcessFile}
            disabled={isProcessing}
          >
            Processar
          </Button>
        </div>
      )}

      {isProcessing && (
        <div className="bg-muted/30 p-3 rounded-md flex items-center">
          <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary" />
          <div>
            <p className="text-sm font-medium">Processando arquivo</p>
            <p className="text-xs text-muted-foreground">
              {processingProgress || "Aguarde enquanto extraímos o conteúdo..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
