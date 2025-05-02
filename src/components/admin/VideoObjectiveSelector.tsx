
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, MessageSquare, ShoppingCart, RefreshCcw, Phone } from "lucide-react";
import { MarketingObjectiveType } from "@/utils/api";

interface ObjectiveOption {
  id: MarketingObjectiveType;
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface VideoObjectiveSelectorProps {
  value: MarketingObjectiveType | undefined;
  onValueChange: (value: MarketingObjectiveType) => void;
}

const objectiveOptions: ObjectiveOption[] = [
  {
    id: "atrair_atencao",
    icon: <Eye className="h-6 w-6" />,
    title: "Atrair Atenção",
    description: "Roteiros para chamar atenção de quem ainda não conhece o tratamento. Ótimo para reels de impacto."
  },
  {
    id: "criar_conexao",
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Criar Conexão", 
    description: "Roteiros com storytelling, bastidores e humanização. Ideal para criar empatia com o público."
  },
  {
    id: "fazer_comprar",
    icon: <ShoppingCart className="h-6 w-6" />,
    title: "Fazer Comprar",
    description: "Roteiros focados em conversão direta, apresentando benefícios e resultados do tratamento."
  },
  {
    id: "reativar_interesse",
    icon: <RefreshCcw className="h-6 w-6" />,
    title: "Reativar Interesse",
    description: "Para lembrar quem já viu o conteúdo antes, reforçar autoridade e trazer de volta ao funil."
  },
  {
    id: "fechar_agora",
    icon: <Phone className="h-6 w-6" />,
    title: "Fechar Agora",
    description: "Vídeos urgentes com chamada para ação rápida. Ideal para promoções e últimas vagas."
  }
];

const VideoObjectiveSelector: React.FC<VideoObjectiveSelectorProps> = ({ value, onValueChange }) => {
  return (
    <div className="space-y-3">
      <Label className="text-base">Objetivo de Marketing</Label>
      <RadioGroup 
        value={value} 
        onValueChange={(val) => onValueChange(val as MarketingObjectiveType)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3"
      >
        {objectiveOptions.map((option) => (
          <div key={option.id} className="relative">
            <RadioGroupItem
              value={option.id}
              id={`objective-${option.id}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`objective-${option.id}`}
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary h-full cursor-pointer"
            >
              <div className="mb-2 rounded-full p-3 bg-muted/20">
                {option.icon}
              </div>
              <div className="font-semibold mb-1">{option.title}</div>
              <p className="text-xs text-center text-muted-foreground">{option.description}</p>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default VideoObjectiveSelector;
