import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import VideoObjectiveSelector from './VideoObjectiveSelector';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MarketingObjectiveType } from '@/types/script';

interface VideoFormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  shortDescription: string;
  setShortDescription: (shortDescription: string) => void;
  detailedDescription: string;
  setDetailedDescription: (detailedDescription: string) => void;
  videoType: string;
  setVideoType: (videoType: string) => void;
  videoUrl: string;
  setVideoUrl: (videoUrl: string) => void;
  thumbUrl: string;
  setThumbUrl: (thumbUrl: string) => void;
  equipment: string;
  setEquipment: (equipment: string) => void;
  bodyArea: string;
  setBodyArea: (bodyArea: string) => void;
  tags: string;
  setTags: (tags: string) => void;
  instagramCaption: string;
  setInstagramCaption: (instagramCaption: string) => void;
  marketingObjective: MarketingObjectiveType;
  setMarketingObjective: (objective: MarketingObjectiveType) => void;
  equipmentsList: any[];
  bodyAreasList: any[];
  purposes: any[];
}

export default function VideoFormFields({
  title, setTitle,
  shortDescription, setShortDescription,
  detailedDescription, setDetailedDescription,
  videoType, setVideoType,
  videoUrl, setVideoUrl,
  thumbUrl, setThumbUrl,
  equipment, setEquipment,
  bodyArea, setBodyArea,
  tags, setTags,
  instagramCaption, setInstagramCaption,
  marketingObjective, setMarketingObjective,
  equipmentsList, bodyAreasList, purposes
}: VideoFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título do Vídeo</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Tratamento de flacidez facial com Ultraformer"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoType">Tipo de Vídeo</Label>
        <RadioGroup
          id="videoType"
          value={videoType}
          onValueChange={setVideoType}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="video_pronto" id="video-pronto" />
            <Label htmlFor="video-pronto">Vídeo Pronto</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="take" id="take" />
            <Label htmlFor="take">Take (Bruto)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="imagem" id="imagem" />
            <Label htmlFor="imagem">Imagem</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoUrl">URL do Vídeo</Label>
        <Input
          id="videoUrl"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://vimeo.com/123456789"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbUrl">URL da Imagem de Capa</Label>
        <Input
          id="thumbUrl"
          value={thumbUrl}
          onChange={(e) => setThumbUrl(e.target.value)}
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Descrição Curta</Label>
        <Input
          id="shortDescription"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="Breve descrição (max. 150 caracteres)"
          maxLength={150}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="equipment">Equipamento</Label>
        <Select value={equipment || ""} onValueChange={setEquipment}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um equipamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhum equipamento</SelectItem>
            {equipmentsList.map(eq => (
              <SelectItem key={eq.id} value={eq.id}>{eq.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bodyArea">Área do Corpo</Label>
        <Select value={bodyArea || ""} onValueChange={setBodyArea}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma área do corpo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nenhuma">Selecione</SelectItem>
            {bodyAreasList.map(area => (
              <SelectItem key={area.id} value={area.id}>{area.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label>Objetivo de Marketing</Label>
        <VideoObjectiveSelector
          value={marketingObjective}
          onValueChange={setMarketingObjective}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="detailedDescription">Descrição Detalhada</Label>
        <Textarea
          id="detailedDescription"
          value={detailedDescription}
          onChange={(e) => setDetailedDescription(e.target.value)}
          placeholder="Descrição detalhada do vídeo"
          className="min-h-[120px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Palavras-chave separadas por vírgulas"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagramCaption">Legenda para Instagram</Label>
        <Textarea
          id="instagramCaption"
          value={instagramCaption}
          onChange={(e) => setInstagramCaption(e.target.value)}
          placeholder="Legenda para postagens no Instagram"
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}
