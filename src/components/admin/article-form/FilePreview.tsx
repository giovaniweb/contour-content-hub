
import React from "react";
import { Button } from "@/components/ui/button";
import { X, FileText, ExternalLink } from "lucide-react";

interface FilePreviewProps {
  file: File | null;
  fileUrl: string | null;
  onClearFile?: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, fileUrl, onClearFile }) => {
  if (!file && !fileUrl) {
    return null;
  }

  return (
    <div className="border rounded-md p-4 bg-muted/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h4 className="text-sm font-medium">
              {file?.name || "Documento PDF"}
            </h4>
            {file && (
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {fileUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => window.open(fileUrl, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Visualizar
            </Button>
          )}
          {onClearFile && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearFile}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
