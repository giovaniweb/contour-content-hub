
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Image } from "lucide-react";
import VideoObjectiveSelector from './VideoObjectiveSelector';
import { MarketingObjectiveType } from '@/types/script';

interface VideoFormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  shortDescription: string;
  setShortDescription: (value: string) => void;
  detailedDescription: string;
  setDetailedDescription: (value: string) => void;
  videoType: string;
  setVideoType: (value: string) => void;
  videoUrl: string;
  setVideoUrl: (value: string) => void;
  thumbUrl: string;
  setThumbUrl: (value: string) => void;
  equipment: string;
  setEquipment: (value: string) => void;
  bodyArea: string;
  setBodyArea: (value: string) => void;
  tags: string;
  setTags: (value: string) => void;
  instagramCaption: string;
  setInstagramCaption: (value: string) => void;
  marketingObjective: MarketingObjectiveType;
  setMarketingObjective: (value: MarketingObjectiveType) => void;
  equipmentsList: any[];
  bodyAreasList: any[];
  purposes: any[];
  isGeneratingThumbnail?: boolean;
}

const VideoFormFields: React.FC<VideoFormFieldsProps> = ({
  title,
  setTitle,
  shortDescription,
  setShortDescription,
  detailedDescription,
  setDetailedDescription,
  videoType,
  setVideoType,
  videoUrl,
  setVideoUrl,
  thumbUrl,
  setThumbUrl,
  equipment,
  setEquipment,
  bodyArea,
  setBodyArea,
  tags,
  setTags,
  instagramCaption,
  setInstagramCaption,
  marketingObjective,
  setMarketingObjective,
  equipmentsList,
  bodyAreasList,
  purposes,
  isGeneratingThumbnail = false
}) => {
  return (
    <>
      {/* Título */}
      <div className="space-y-2">
        <Label htmlFor="titulo">Título *</Label>
        <Input
          id="titulo"
          placeholder="Digite o título do vídeo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Descrição Curta */}
      <div className="space-y-2">
        <Label htmlFor="descricao-curta">Descrição Curta</Label>
        <Textarea
          id="descricao-curta"
          placeholder="Breve descrição do vídeo"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          rows={2}
        />
      </div>

      {/* Descrição Detalhada */}
      <div className="space-y-2">
        <Label htmlFor="descricao-detalhada">Descrição Detalhada</Label>
        <Textarea
          id="descricao-detalhada"
          placeholder="Descrição completa do vídeo"
          value={detailedDescription}
          onChange={(e) => setDetailedDescription(e.target.value)}
          rows={4}
        />
      </div>

      {/* Tipo de Vídeo */}
      <div className="space-y-3">
        <Label>Tipo de Vídeo</Label>
        <RadioGroup value={videoType} onValueChange={setVideoType}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="video_pronto" id="video_pronto" />
            <Label htmlFor="video_pronto">Vídeo Pronto</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="roteiro" id="roteiro" />
            <Label htmlFor="roteiro">Roteiro</Label>
          </div>
        </RadioGroup>
      </div>

      {/* URL do Vídeo */}
      <div className="space-y-2">
        <Label htmlFor="video-url">URL do Vídeo *</Label>
        <Input
          id="video-url"
          placeholder="https://exemplo.com/video.mp4"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
        />
      </div>

      {/* Thumbnail */}
      <div className="space-y-2">
        <Label htmlFor="thumb-url">URL da Thumbnail</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="thumb-url"
            placeholder="Será gerada automaticamente do vídeo"
            value={thumbUrl}
            onChange={(e) => setThumbUrl(e.target.value)}
            disabled={isGeneratingThumbnail}
          />
          {isGeneratingThumbnail && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Gerando...
            </div>
          )}
        </div>
        {thumbUrl && (
          <div className="mt-2">
            <img 
              src={thumbUrl} 
              alt="Thumbnail preview" 
              className="w-32 h-18 object-cover rounded border"
            />
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {isGeneratingThumbnail 
            ? "Gerando thumbnail automaticamente..." 
            : "A thumbnail será gerada automaticamente quando você inserir a URL do vídeo"
          }
        </p>
      </div>

      {/* Equipamento */}
      <div className="space-y-2">
        <Label htmlFor="equipamento">Equipamento</Label>
        <Select value={equipment} onValueChange={setEquipment}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um equipamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Nenhum equipamento</SelectItem>
            {equipmentsList.map((eq) => (
              <SelectItem key={eq.id} value={eq.id}>
                {eq.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Área do Corpo */}
      <div className="space-y-2">
        <Label htmlFor="area-corpo">Área do Corpo</Label>
        <Select value={bodyArea} onValueChange={setBodyArea}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma área do corpo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Nenhuma área específica</SelectItem>
            {bodyAreasList.map((area) => (
              <SelectItem key={area.id} value={area.nome}>
                {area.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          placeholder="Separadas por vírgula (ex: skincare, facial, antienvelhecimento)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      {/* Legenda Instagram */}
      <div className="space-y-2">
        <Label htmlFor="instagram-caption">Legenda para Instagram</Label>
        <Textarea
          id="instagram-caption"
          placeholder="Legenda otimizada para Instagram"
          value={instagramCaption}
          onChange={(e) => setInstagramCaption(e.target.value)}
          rows={3}
        />
      </div>

      {/* Objetivo de Marketing */}
      <div className="space-y-2">
        <Label>Objetivo de Marketing</Label>
        <VideoObjectiveSelector
          value={marketingObjective}
          onChange={setMarketingObjective}
        />
      </div>
    </>
  );
};

export default VideoFormFields;
