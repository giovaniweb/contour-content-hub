
import React, { useState } from 'react';
import { StoredVideo } from '@/types/video-storage';
import { updateVideo } from '@/services/videoStorageService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Loader, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoEditDialogProps {
  video: StoredVideo;
  onClose: () => void;
  onUpdate: () => void;
}

const VideoEditDialog: React.FC<VideoEditDialogProps> = ({ video, onClose, onUpdate }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description || '');
  const [tags, setTags] = useState<string[]>(video.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isPublic, setIsPublic] = useState(video.public || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Título obrigatório",
        description: "Por favor, insira um título para o vídeo."
      });
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateVideo(video.id, {
        title,
        description,
        tags,
        public: isPublic
      });

      if (result.success) {
        toast({
          title: "Vídeo atualizado",
          description: "As informações do vídeo foram atualizadas com sucesso."
        });
        onUpdate();
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar",
          description: result.error || "Não foi possível atualizar o vídeo."
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar vídeo:', error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro ao salvar as alterações."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Vídeo</DialogTitle>
          <DialogDescription>
            Atualize as informações do seu vídeo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Título</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do vídeo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Descrição</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione uma descrição para o vídeo"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-tags">Tags</Label>
            <div className="flex items-center gap-2">
              <Input
                id="edit-tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                onBlur={addTag}
                placeholder="Adicione tags (pressione Enter)"
              />
              <Button 
                type="button"
                onClick={addTag}
              >
                Adicionar
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit-isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="edit-isPublic">Disponibilizar para todos os usuários</Label>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
          >
            {isSaving ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" /> Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Salvar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VideoEditDialog;
