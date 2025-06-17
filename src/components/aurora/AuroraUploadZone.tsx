
import React, { useRef, useState } from 'react';
import { Upload, FileText, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuroraUploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  file?: File | null;
  onClearFile?: () => void;
  isProcessing?: boolean;
  error?: string | null;
}

const AuroraUploadZone: React.FC<AuroraUploadZoneProps> = ({
  onFileSelect,
  accept = ".pdf",
  maxSize = 10 * 1024 * 1024, // 10MB
  file,
  onClearFile,
  isProcessing = false,
  error
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (selectedFile: File) => {
    if (selectedFile.size > maxSize) {
      return;
    }
    onFileSelect(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  if (file) {
    return (
      <div className="aurora-card p-6 border-2 border-aurora-electric-purple/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FileText className="h-12 w-12 text-aurora-electric-purple" />
              {isProcessing && (
                <div className="absolute inset-0 bg-aurora-electric-purple/20 rounded-lg animate-pulse" />
              )}
            </div>
            <div className="space-y-1">
              <p className="font-medium text-slate-100 aurora-heading">
                {file.name}
              </p>
              <p className="text-sm text-slate-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {isProcessing && (
                <p className="text-sm text-aurora-electric-purple animate-pulse">
                  Processando documento...
                </p>
              )}
            </div>
          </div>
          
          {!isProcessing && onClearFile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFile}
              className="text-slate-400 hover:text-red-400"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`
        relative aurora-card border-2 border-dashed transition-all duration-300 cursor-pointer
        ${isDragOver 
          ? 'border-aurora-neon-blue bg-aurora-neon-blue/10 aurora-glow-blue' 
          : 'border-aurora-electric-purple/40 hover:border-aurora-electric-purple/70'
        }
        ${error ? 'border-red-500/50 bg-red-500/5' : ''}
      `}
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="aurora-particles absolute inset-0 pointer-events-none">
        <div className="aurora-particle" style={{ left: '20%', animationDuration: '8s' }} />
        <div className="aurora-particle" style={{ left: '60%', animationDuration: '6s' }} />
        <div className="aurora-particle" style={{ left: '80%', animationDuration: '10s' }} />
      </div>
      
      <div className="relative p-12 text-center space-y-4">
        <div className="mx-auto w-16 h-16 aurora-glass rounded-full flex items-center justify-center mb-6">
          <Upload className="h-8 w-8 text-aurora-electric-purple aurora-floating" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium aurora-text-gradient">
            Arraste o PDF aqui
          </h3>
          <p className="text-slate-400 aurora-body">
            ou clique para selecionar um arquivo
          </p>
          <p className="text-xs text-slate-500">
            Máximo {(maxSize / 1024 / 1024).toFixed(0)}MB • Apenas PDF
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileChange(file);
        }}
      />
    </div>
  );
};

export default AuroraUploadZone;
