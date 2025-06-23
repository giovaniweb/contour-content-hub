
import React from 'react';
import { Upload, File, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuroraUploadZoneProps {
  onFileSelect: (file: File) => void;
  file?: File | null;
  onClearFile?: () => void;
  isProcessing?: boolean;
  error?: string | null;
  className?: string;
}

const AuroraUploadZone: React.FC<AuroraUploadZoneProps> = ({
  onFileSelect,
  file,
  onClearFile,
  isProcessing = false,
  error,
  className = ''
}) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        onFileSelect(selectedFile);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    });
    input.click();
  };

  if (file) {
    return (
      <div className={`aurora-glass-enhanced border-2 border-green-400/50 rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 aurora-glass rounded-lg flex items-center justify-center">
              {isProcessing ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-aurora-electric-purple"></div>
              ) : error ? (
                <AlertCircle className="h-6 w-6 text-red-400" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-400" />
              )}
            </div>
            <div>
              <p className="font-medium text-slate-100">{file.name}</p>
              <p className="text-sm text-slate-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {error && (
                <p className="text-sm text-red-400 mt-1">{error}</p>
              )}
            </div>
          </div>
          
          {onClearFile && !isProcessing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFile}
              className="text-slate-400 hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        aurora-glass-enhanced border-2 border-dashed border-cyan-500/30 rounded-xl p-8 text-center cursor-pointer
        transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-500/5
        ${className}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 aurora-glass rounded-2xl flex items-center justify-center">
          <Upload className="h-8 w-8 text-cyan-400" />
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-slate-100 mb-2">
            Upload do Artigo Científico
          </h3>
          <p className="text-slate-400 mb-2">
            Arraste um arquivo PDF aqui ou clique para selecionar
          </p>
          <p className="text-sm text-slate-500">
            Formatos aceitos: PDF (máximo 50MB)
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuroraUploadZone;
