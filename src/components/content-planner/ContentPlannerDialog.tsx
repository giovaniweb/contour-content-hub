
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MarketingObjectiveSelector from "@/components/content-strategy/MarketingObjectiveSelector";
import { ContentPlannerItem } from "@/types/content-planner";
import { useEquipments } from "@/hooks/useEquipments";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { ContentFormat, ContentDistribution } from "@/types/content-planner";

interface ContentPlannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: ContentPlannerItem;
  onSave: (item: Partial<ContentPlannerItem>) => Promise<void>;
}

const ContentPlannerDialog: React.FC<ContentPlannerDialogProps> = ({
  open,
  onOpenChange,
  item,
  onSave
}) => {
  const { equipments } = useEquipments();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [format, setFormat] = useState<ContentFormat>("vídeo");
  const [objective, setObjective] = useState<string>("🟡 Atrair Atenção");
  const [distribution, setDistribution] = useState<ContentDistribution>("Instagram");
  const [equipmentId, setEquipmentId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description || "");
      setTags(item.tags || []);
      setFormat(item.format);
      setObjective(item.objective);
      setDistribution(item.distribution);
      setEquipmentId(item.equipmentId || "");
    } else {
      // Reset form
      setTitle("");
      setDescription("");
      setTags([]);
      setFormat("vídeo");
      setObjective("🟡 Atrair Atenção");
      setDistribution("Instagram");
      setEquipmentId("");
    }
  }, [item, open]);
  
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const updatedItem: Partial<ContentPlannerItem> = {
      title,
      description,
      tags,
      format,
      objective,
      distribution,
      equipmentId: equipmentId || undefined,
      ...(item ? { id: item.id } : {})
    };
    
    try {
      await onSave(updatedItem);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {item ? "Editar item de conteúdo" : "Novo item de conteúdo"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título*</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do conteúdo"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição ou detalhes do conteúdo"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Adicionar tag"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={handleAddTag}
                disabled={!currentTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-muted-foreground hover:text-foreground rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="format">Formato</Label>
              <Select 
                value={format} 
                onValueChange={(value) => setFormat(value as ContentFormat)}
              >
                <SelectTrigger id="format">
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vídeo">Vídeo</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="carrossel">Carrossel</SelectItem>
                  <SelectItem value="reels">Reels</SelectItem>
                  <SelectItem value="texto">Texto</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="distribution">Canal de distribuição</Label>
              <Select 
                value={distribution} 
                onValueChange={(value) => setDistribution(value as ContentDistribution)}
              >
                <SelectTrigger id="distribution">
                  <SelectValue placeholder="Selecione o canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="Blog">Blog</SelectItem>
                  <SelectItem value="Múltiplos">Múltiplos</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Objetivo de Marketing</Label>
            <MarketingObjectiveSelector
              value={objective}
              onChange={setObjective}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="equipment">Equipamento</Label>
            <Select 
              value={equipmentId} 
              onValueChange={setEquipmentId}
            >
              <SelectTrigger id="equipment">
                <SelectValue placeholder="Selecione um equipamento (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhum</SelectItem>
                {equipments.map((equipment) => (
                  <SelectItem key={equipment.id} value={equipment.id}>
                    {equipment.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || isSubmitting}
            >
              {isSubmitting ? "Salvando..." : item ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Funções utilitárias para o componente
const handleAddTag = () => {
  if (currentTag.trim() && !tags.includes(currentTag.trim())) {
    setTags([...tags, currentTag.trim()]);
    setCurrentTag("");
  }
};

const handleRemoveTag = (tag: string) => {
  setTags(tags.filter(t => t !== tag));
};

const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && currentTag.trim()) {
    e.preventDefault();
    handleAddTag();
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!title.trim()) {
    return;
  }
  
  setIsSubmitting(true);
  
  const updatedItem: Partial<ContentPlannerItem> = {
    title,
    description,
    tags,
    format,
    objective,
    distribution,
    equipmentId: equipmentId || undefined,
    ...(item ? { id: item.id } : {})
  };
  
  try {
    await onSave(updatedItem);
    onOpenChange(false);
  } finally {
    setIsSubmitting(false);
  }
};

export default ContentPlannerDialog;
