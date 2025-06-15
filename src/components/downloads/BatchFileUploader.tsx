
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type UploadedFile = {
  file: File;
  progress: number;
  error: string | null;
  url: string | null;
};

interface BatchFileUploaderProps {
  onComplete?: (files: UploadedFile[]) => void;
}

const BatchFileUploader: React.FC<BatchFileUploaderProps> = ({ onComplete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleSelectFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;
    const filesArray: UploadedFile[] = Array.from(fileList).map((file) => ({
      file,
      progress: 0,
      error: null,
      url: null,
    }));
    setFiles(filesArray);
  };

  const handleUploadAll = async () => {
    setUploading(true);
    const updatedFiles: UploadedFile[] = [];
    for (const uploaded of files) {
      // Create a storage path by user and timestamp
      const storagePath = `downloads/${Date.now()}_${uploaded.file.name}`;
      const { data, error } = await supabase.storage
        .from("downloads")
        .upload(storagePath, uploaded.file, {
          upsert: false,
        });
      if (error) {
        updatedFiles.push({
          ...uploaded,
          error: error.message,
        });
      } else {
        updatedFiles.push({
          ...uploaded,
          error: null,
          url: data?.path ? data.path : null,
        });
      }
    }
    setFiles(updatedFiles);
    setUploading(false);
    toast({
      title: "Upload finalizado",
      description: "Todos os arquivos processados.",
    });
    if (onComplete) {
      onComplete(updatedFiles);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Input
          multiple
          type="file"
          ref={fileInputRef}
          accept="video/*,image/*,.pdf,.zip"
          onChange={handleSelectFiles}
          disabled={uploading}
        />
      </div>
      <Button
        onClick={handleUploadAll}
        disabled={uploading || files.length === 0}
        className="flex items-center gap-2"
      >
        {uploading ? <Loader2 className="animate-spin h-4 w-4" /> : <Upload className="h-4 w-4" />}
        {uploading ? "Enviando arquivos..." : "Enviar Selecionados"}
      </Button>
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f, idx) => (
            <div key={idx} className="rounded border px-3 py-2 flex items-center bg-muted/20">
              <span className="flex-1 truncate">{f.file.name}</span>
              {f.error ? (
                <span className="text-red-500 ml-2">{f.error}</span>
              ) : f.url ? (
                <span className="text-green-600 ml-2">✓</span>
              ) : (
                <span className="text-muted-foreground ml-2">Aguardando</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BatchFileUploader;
