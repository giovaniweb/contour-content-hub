
import React from 'react';
import { Label } from "@/components/ui/label";

interface FilePreviewProps {
  file: File | null;
  fileUrl: string | null;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, fileUrl }) => {
  if (!file && !fileUrl) {
    return null;
  }

  return (
    <div>
      {file && (
        <div className="p-4 border rounded-md">
          <p className="font-medium">{file.name}</p>
          <p className="text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
      )}
      
      {fileUrl && !file && (
        <div>
          <Label>Arquivo</Label>
          <div className="p-4 border rounded-md">
            <p className="break-all text-sm">
              {fileUrl}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
