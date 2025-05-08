
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Save, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { VideoMetadata } from '@/types/video-storage';

interface Equipment {
  id: string;
  nome: string;
}

interface EditableVideo {
  id: string;
  title: string;
  description?: string;
  status: string;
  tags: string[];
  isEditing: boolean;
  editTitle: string;
  editDescription: string;
  editEquipmentId: string;
  editTags: string[];
  originalEquipmentId?: string;
  metadata?: VideoMetadata;
}

interface VideoListItemProps {
  video: EditableVideo;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
  onDelete: () => void;
  equipmentOptions: Equipment[];
  onUpdate: (updates: Partial<EditableVideo>) => void;
}

const VideoListItem: React.FC<VideoListItemProps> = ({
  video,
  isSelected,
  onSelect,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  equipmentOptions,
  onUpdate
}) => {
  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'ready': return 'success';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'ready': return 'Pronto';
      case 'processing': return 'Processando';
      case 'uploading': return 'Enviando';
      case 'error': return 'Erro';
      default: return status;
    }
  };

  return (
    <div className="p-3 hover:bg-muted/30">
      {video.isEditing ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center">
            <div className="w-12">
              <Checkbox 
                checked={isSelected}
                onCheckedChange={onSelect}
              />
            </div>
            <div className="flex-1">
              <Input
                value={video.editTitle}
                onChange={(e) => onUpdate({ editTitle: e.target.value })}
                placeholder="Título do vídeo"
              />
            </div>
          </div>
          
          <div className="ml-12">
            <div className="mb-2">
              <Label htmlFor={`desc-${video.id}`} className="mb-1 block text-sm">
                Descrição
              </Label>
              <Textarea
                id={`desc-${video.id}`}
                value={video.editDescription}
                onChange={(e) => onUpdate({ editDescription: e.target.value })}
                placeholder="Descrição do vídeo"
              />
            </div>
            
            <div className="mb-3">
              <Label htmlFor={`equip-${video.id}`} className="mb-1 block text-sm">
                Equipamento
              </Label>
              <Select
                value={video.editEquipmentId}
                onValueChange={(value) => onUpdate({ editEquipmentId: value })}
              >
                <SelectTrigger id={`equip-${video.id}`}>
                  <SelectValue placeholder="Selecione um equipamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum equipamento</SelectItem>
                  {equipmentOptions
                    .filter(eq => eq && eq.id && eq.id !== "")
                    .map(eq => (
                    <SelectItem key={eq.id} value={eq.id}>{eq.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button 
                size="sm" 
                onClick={onSave}
              >
                <Save className="h-3 w-3 mr-1" /> Salvar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="w-12">
            <Checkbox 
              checked={isSelected}
              onCheckedChange={onSelect}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-medium truncate" title={video.title}>
              {video.title}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {video.description || "Sem descrição"}
            </p>
          </div>
          <div className="hidden md:block w-32 text-center text-sm">
            {video.originalEquipmentId && video.originalEquipmentId !== 'none' ? (
              equipmentOptions.find(eq => eq.id === video.originalEquipmentId)?.nome || 'N/A'
            ) : (
              <span className="text-muted-foreground">Nenhum</span>
            )}
          </div>
          <div className="w-32 text-center">
            <Badge variant={getStatusVariant(video.status)}>
              {getStatusLabel(video.status)}
            </Badge>
          </div>
          <div className="w-24 text-right flex justify-end gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onEdit}
              title="Editar"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onDelete}
              title="Excluir"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoListItem;
