import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Upload, Plus } from 'lucide-react';
import { Video } from '@/services/videoStorage/videoService';
import { StoredVideo } from '@/types/video-storage';
import { useEquipments } from '@/hooks/useEquipments';
import { updateVideo } from '@/services/videoStorage/videoManagementService';
import { supabase } from '@/integrations/supabase/client';

interface VideoEditDialogProps {
  video: Video | StoredVideo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onUpdate: () => void;
}

const VideoEditDialog: React.FC<VideoEditDialogProps> = ({
  video,
  open,
  onOpenChange,
  onClose,
  onUpdate
}) => {
  const { toast } = useToast();
  const { equipments } = useEquipments();
  
  // Form state
  const [formData, setFormData] = useState({
    titulo: '',
    descricao_curta: '',
    tags: [] as string[],
    equipamentos: [] as string[],
    categoria: ''
  });
  
  const [newTag, setNewTag] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (video && open) {
      // Helper function to get description from either Video or StoredVideo
      const getDescription = (): string => {
        if ('descricao_curta' in video) {
          return video.descricao_curta || '';
        }
        if ('description' in video) {
          return video.description || '';
        }
        return '';
      };

      const getDetailedDescription = (): string => {
        if ('descricao_detalhada' in video) {
          return video.descricao_detalhada || '';
        }
        if ('description' in video) {
          return video.description || '';
        }
        return '';
      };

      const getCategory = (): string => {
        if ('categoria' in video && video.categoria) {
          return typeof video.categoria === 'string' ? video.categoria : String(video.categoria);
        }
        return '';
      };

      setFormData({
        titulo: ('titulo' in video ? video.titulo : video.title) || '',
        descricao_curta: getDescription(),
        tags: ('tags' in video ? video.tags : []) || [],
        equipamentos: ('equipamentos' in video ? video.equipamentos : []) || [],
        categoria: getCategory()
      });
    }
  }, [video, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleEquipmentChange = (equipmentId: string) => {
    const currentEquipments = formData.equipamentos;
    const isSelected = currentEquipments.includes(equipmentId);
    
    setFormData(prev => ({
      ...prev,
      equipamentos: isSelected
        ? currentEquipments.filter(id => id !== equipmentId)
        : [...currentEquipments, equipmentId]
    }));
  };

  const generateThumbnailFromVideo = async (videoUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.currentTime = 1; // Capture at 1 second
      
      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Não foi possível criar contexto do canvas'));
          return;
        }
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            // Convert blob to file and upload
            const file = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
            handleThumbnailUpload(file).then(resolve).catch(reject);
          } else {
            reject(new Error('Erro ao gerar thumbnail'));
          }
        }, 'image/jpeg', 0.8);
      };
      
      video.onerror = () => {
        reject(new Error('Erro ao carregar o vídeo'));
      };
      
      video.src = videoUrl;
      video.load();
    });
  };

  const handleGenerateThumbnail = async () => {
    try {
      setIsGeneratingThumbnail(true);
      const videoUrl = ('url_video' in video ? video.url_video : '') || '';
      
      if (!videoUrl) {
        throw new Error('URL do vídeo não encontrada');
      }

      const thumbnailUrl = await generateThumbnailFromVideo(videoUrl);
      
      // Update the video with the new thumbnail URL
      const { success, error } = await updateVideo(video.id, { thumbnail_url: thumbnailUrl });
      
      if (!success) {
        throw new Error(error);
      }
      
      toast({
        title: 'Sucesso',
        description: 'Thumbnail gerada e salva com sucesso!'
      });
      
      onUpdate();
    } catch (error) {
      console.error('Erro ao gerar thumbnail:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Erro ao gerar thumbnail'
      });
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };

  const handleThumbnailUpload = async (file: File) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('Usuário não autenticado');
      }

      const fileName = `${userData.user.id}/thumbnails/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Erro no upload da thumbnail:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      setUploading(true);

      let thumbnailUrl = ('thumbnail_url' in video ? video.thumbnail_url : undefined) || null;

      // Upload new thumbnail if provided
      if (thumbnailFile) {
        thumbnailUrl = await handleThumbnailUpload(thumbnailFile);
      }

      const updates = {
        ...formData,
        ...(thumbnailUrl && { thumbnail_url: thumbnailUrl })
      };

      const { success, error } = await updateVideo(video.id, updates);

      if (!success) {
        throw new Error(error);
      }

      toast({
        title: 'Sucesso',
        description: 'Vídeo atualizado com sucesso!'
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Erro ao salvar alterações'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Vídeo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => handleInputChange('titulo', e.target.value)}
              placeholder="Digite o título do vídeo"
            />
          </div>

          {/* Short Description */}
          <div>
            <Label htmlFor="descricao_curta">Descrição Curta</Label>
            <Textarea
              id="descricao_curta"
              value={formData.descricao_curta}
              onChange={(e) => handleInputChange('descricao_curta', e.target.value)}
              placeholder="Descrição breve do vídeo"
              rows={3}
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Select
              value={formData.categoria}
              onValueChange={(value) => handleInputChange('categoria', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facial">Facial</SelectItem>
                <SelectItem value="corporal">Corporal</SelectItem>
                <SelectItem value="capilar">Capilar</SelectItem>
                <SelectItem value="estetica">Estética</SelectItem>
                <SelectItem value="procedimento">Procedimento</SelectItem>
                <SelectItem value="equipamento">Equipamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Equipment Selection */}
          <div>
            <Label>Equipamentos</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {equipments.map((equipment) => (
                <div
                  key={equipment.id}
                  className={`p-2 rounded border cursor-pointer transition-colors ${
                    formData.equipamentos.includes(equipment.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleEquipmentChange(equipment.id)}
                >
                  <span className="text-sm">{equipment.nome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Adicionar tag"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddTag}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Thumbnail Upload and Generation */}
          <div>
            <Label>Thumbnail</Label>
            <div className="space-y-3 mt-2">
              {/* Generate Thumbnail Button */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateThumbnail}
                  disabled={isGeneratingThumbnail || !('url_video' in video && video.url_video)}
                  className="flex-1"
                >
                  {isGeneratingThumbnail ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Gerando thumbnail...
                    </>
                  ) : (
                    'Gerar Thumbnail Automaticamente'
                  )}
                </Button>
              </div>
              
              {/* Or upload custom thumbnail */}
              <div>
                <Label className="text-sm text-muted-foreground">Ou faça upload de uma thumbnail personalizada:</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setThumbnailFile(file);
                    }
                  }}
                  className="mt-1"
                />
                {thumbnailFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Arquivo selecionado: {thumbnailFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={uploading}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={uploading}>
              {uploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoEditDialog;
