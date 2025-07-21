import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, X, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUpload: (url: string) => void;
  onPhotoRemove: () => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  currentPhotoUrl,
  onPhotoUpload,
  onPhotoRemove
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      const file = event.target.files?.[0];
      if (!file) return;

      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Você precisa estar logado');
        return;
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `videomaker-photos/${fileName}`;

      // Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        toast.error('Erro ao fazer upload da imagem: ' + uploadError.message);
        return;
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      onPhotoUpload(publicUrl);
      toast.success('Foto enviada com sucesso!');

    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro inesperado no upload da foto');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = () => {
    onPhotoRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="photo-upload">Foto do Perfil</Label>
      
      <div className="flex items-center gap-4">
        {/* Preview da foto */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden">
            {currentPhotoUrl ? (
              <>
                <img
                  src={currentPhotoUrl}
                  alt="Foto do perfil"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </>
            ) : (
              <User className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Botão de upload */}
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {uploading ? 'Enviando...' : 'Escolher Foto'}
          </Button>
          
          <p className="text-xs text-muted-foreground">
            JPG, PNG até 5MB
          </p>
        </div>
      </div>
    </div>
  );
};