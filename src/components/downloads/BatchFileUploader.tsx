
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
      <div className="space-y-2">
        <p className="text-white font-medium">Selecionar Materiais</p>
        <p className="text-white/60 text-sm">
          Aceitos: PSD, PDF, JPG, PNG (máximo 500MB por arquivo)
        </p>
        <Input
          multiple
          type="file"
          ref={fileInputRef}
          accept=".psd,.pdf,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf"
          onChange={handleSelectFiles}
          disabled={uploading}
          className="bg-slate-800/50 border-aurora-electric-purple/30 text-white file:bg-aurora-electric-purple/20 file:text-white file:border-0 file:rounded-md"
        />
      </div>
      <Button
        onClick={handleUploadAll}
        disabled={uploading || files.length === 0}
        className="flex items-center gap-2 aurora-button aurora-glow hover:aurora-glow-intense"
      >
        {uploading ? <Loader2 className="animate-spin h-4 w-4" /> : <Upload className="h-4 w-4" />}
        {uploading ? "Enviando materiais..." : `Enviar ${files.length} ${files.length === 1 ? 'Material' : 'Materiais'}`}
      </Button>
      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          <p className="text-white font-medium">Arquivos Selecionados:</p>
          {files.map((f, idx) => (
            <div key={idx} className="rounded-lg border border-aurora-electric-purple/30 px-4 py-3 flex items-center justify-between bg-slate-800/30">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-aurora-electric-purple"></div>
                <span className="text-white truncate flex-1">{f.file.name}</span>
                <span className="text-xs text-white/60">
                  {(f.file.size / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
              <div className="ml-4">
                {f.error ? (
                  <span className="text-red-400 text-sm">❌ {f.error}</span>
                ) : f.url ? (
                  <span className="text-aurora-emerald text-sm">✅ Enviado</span>
                ) : (
                  <span className="text-white/60 text-sm">⏳ Aguardando</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BatchFileUploader;
