
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MarketingObjectiveSelector from "@/components/content-strategy/MarketingObjectiveSelector";
import { ContentFormat, ContentDistribution } from "@/types/content-planner";
import { Equipment } from "@/hooks/useEquipments";

interface ContentPlannerFormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  format: ContentFormat;
  setFormat: (format: ContentFormat) => void;
  objective: string;
  setObjective: (objective: string) => void;
  distribution: ContentDistribution;
  setDistribution: (distribution: ContentDistribution) => void;
  equipmentId: string;
  setEquipmentId: (equipmentId: string) => void;
  equipments: Equipment[];
}

const ContentPlannerFormFields: React.FC<ContentPlannerFormFieldsProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  format,
  setFormat,
  objective,
  setObjective,
  distribution,
  setDistribution,
  equipmentId,
  setEquipmentId,
  equipments
}) => {
  return (
    <>
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
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="format">Formato</Label>
          <Select 
            value={format || ""} 
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
            value={distribution || ""} 
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
          value={equipmentId || "none"} 
          onValueChange={setEquipmentId}
        >
          <SelectTrigger id="equipment">
            <SelectValue placeholder="Selecione um equipamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhum</SelectItem>
            {equipments
              .filter(equipment => equipment && equipment.id && equipment.id !== "")
              .map((equipment) => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.nome}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default ContentPlannerFormFields;
