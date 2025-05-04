
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MarketingObjectiveType } from '@/types/script';
import { Eye, MessageSquare, ShoppingCart, RefreshCcw, Phone } from "lucide-react";

interface VideoObjectiveSelectorProps {
  value: MarketingObjectiveType;
  onValueChange: (value: MarketingObjectiveType) => void;
  className?: string; // Added className prop
}

const VideoObjectiveSelector: React.FC<VideoObjectiveSelectorProps> = ({
  value,
  onValueChange,
  className = "" // Default to empty string
}) => {
  return (
    <RadioGroup
      value={value}
      onValueChange={(val) => onValueChange(val as MarketingObjectiveType)}
      className={`grid grid-cols-1 md:grid-cols-5 gap-3 ${className}`}
    >
      <div className="flex flex-col items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-primary transition-all"
           onClick={() => onValueChange("atrair_atencao")}
      >
        <RadioGroupItem value="atrair_atencao" id="atrair_atencao" className="sr-only" />
        <Eye className="h-6 w-6" />
        <Label htmlFor="atrair_atencao" className="text-center text-sm font-medium cursor-pointer">
          Atrair Atenção
        </Label>
        <span className="text-xs text-muted-foreground text-center">
          Despertar interesse do público
        </span>
      </div>
      
      <div className="flex flex-col items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-primary transition-all"
           onClick={() => onValueChange("criar_conexao")}
      >
        <RadioGroupItem value="criar_conexao" id="criar_conexao" className="sr-only" />
        <MessageSquare className="h-6 w-6" />
        <Label htmlFor="criar_conexao" className="text-center text-sm font-medium cursor-pointer">
          Criar Conexão
        </Label>
        <span className="text-xs text-muted-foreground text-center">
          Estabelecer relacionamento
        </span>
      </div>
      
      <div className="flex flex-col items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-primary transition-all"
           onClick={() => onValueChange("fazer_comprar")}
      >
        <RadioGroupItem value="fazer_comprar" id="fazer_comprar" className="sr-only" />
        <ShoppingCart className="h-6 w-6" />
        <Label htmlFor="fazer_comprar" className="text-center text-sm font-medium cursor-pointer">
          Fazer Comprar
        </Label>
        <span className="text-xs text-muted-foreground text-center">
          Converter em cliente
        </span>
      </div>
      
      <div className="flex flex-col items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-primary transition-all"
           onClick={() => onValueChange("reativar_interesse")}
      >
        <RadioGroupItem value="reativar_interesse" id="reativar_interesse" className="sr-only" />
        <RefreshCcw className="h-6 w-6" />
        <Label htmlFor="reativar_interesse" className="text-center text-sm font-medium cursor-pointer">
          Reativar Interesse
        </Label>
        <span className="text-xs text-muted-foreground text-center">
          Reconquistar leads frios
        </span>
      </div>
      
      <div className="flex flex-col items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-primary transition-all"
           onClick={() => onValueChange("fechar_agora")}
      >
        <RadioGroupItem value="fechar_agora" id="fechar_agora" className="sr-only" />
        <Phone className="h-6 w-6" />
        <Label htmlFor="fechar_agora" className="text-center text-sm font-medium cursor-pointer">
          Fechar Agora
        </Label>
        <span className="text-xs text-muted-foreground text-center">
          Conversão imediata
        </span>
      </div>
    </RadioGroup>
  );
};

export default VideoObjectiveSelector;
