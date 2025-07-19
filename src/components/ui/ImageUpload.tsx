import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  bucket: string;
  folder?: string;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  bucket,
  folder = '',
  className = '',
  accept = 'image/*',
  maxSizeMB = 5
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Por favor, selecione apenas arquivos de imagem.';
    }
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `O arquivo deve ter no máximo ${maxSizeMB}MB.`;
    }
    
    return null;
  };

  const uploadFile = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro na validação",
        description: error,
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl);
      
      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Não foi possível enviar a imagem. Tente novamente.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <Label className="text-white">{label}</Label>
      
      {value ? (
        <div className="mt-2">
          <div className="relative inline-block">
            <img
              src={value}
              alt="Preview"
              className="w-32 h-32 object-cover rounded border border-slate-600"
            />
            <Button
              type="button"
              onClick={removeImage}
              size="sm"
              variant="destructive"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50/10'
              : 'border-slate-600 hover:border-slate-500'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <p className="text-sm text-slate-300">Enviando imagem...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-slate-400" />
                <ImageIcon className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-sm text-slate-300">
                Clique ou arraste uma imagem aqui
              </p>
              <p className="text-xs text-slate-400">
                PNG, JPG, GIF até {maxSizeMB}MB
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;