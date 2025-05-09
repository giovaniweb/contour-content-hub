
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MarketingObjectiveType } from '@/types/script';
import { Eye, MessageSquare, ShoppingCart, RefreshCcw, CheckCircle } from "lucide-react";

interface VideoObjectiveSelectorProps {
  value: MarketingObjectiveType;
  onValueChange: (value: MarketingObjectiveType) => void;
  className?: string;
}

const VideoObjectiveSelector: React.FC<VideoObjectiveSelectorProps> = ({
  value,
  onValueChange,
  className = ""
}) => {
  // Map legacy values to new emoji format if needed
  const getDisplayValue = (val: MarketingObjectiveType): MarketingObjectiveType => {
    switch(val) {
      case 'atrair_atencao': return '🟡 Atrair Atenção';
      case 'criar_conexao': return '🟢 Criar Conexão';
      case 'fazer_comprar': return '🔴 Fazer Comprar';
      case 'reativar_interesse': return '🔁 Reativar Interesse';
      case 'fechar_agora': return '✅ Fechar Agora';
      default: return val;
    }
  };

  return (
    <RadioGroup
      value={getDisplayValue(value)}
      onValueChange={(val) => onValueChange(val as MarketingObjectiveType)}
      className={`grid grid-cols-1 md:grid-cols-5 gap-3 ${className}`}
    >
      <div className="flex flex-col items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-primary transition-all"
           onClick={() => onValueChange("🟡 Atrair Atenção")}
      >
        <RadioGroupItem value="🟡 Atrair Atenção" id="atrair_atencao" className="sr-only" />
        <Eye className="h-6 w-6" />
        <Label htmlFor="atrair_atencao" className="text-center text-sm font-medium cursor-pointer">
          🟡 Atrair Atenção
        </Label>
        <span className="text-xs text-muted-foreground text-center">
          Criar curiosidade, gerar clique
        </span>
      </div>
      
      <div className="flex flex-col items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-primary transition-all"
           onClick={() => onValueChange("🟢 Criar Conexão")}
      >
        <RadioGroupItem value="🟢 Criar Conexão" id="criar_conexao" className="sr-only" />
        <MessageSquare className="h-6 w-6" />
        <Label htmlFor="criar_conexao" className="text-center text-sm font-medium cursor-pointer">
          🟢 Criar Conexão
        </Label>
        <span className="text-xs text-muted-foreground text-center">
          Gerar empatia, identificação
        </span>
      </div>
      
      <div className="flex flex-col items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-primary transition-all"
           onClick={() => onValueChange("🔴 Fazer Comprar")}
      >
        <RadioGroupItem value="🔴 Fazer Comprar" id="fazer_comprar" className="sr-only" />
        <ShoppingCart className="h-6 w-6" />
        <Label htmlFor="fazer_comprar" className="text-center text-sm font-medium cursor-pointer">
          🔴 Fazer Comprar
        </Label>
        <span className="text-xs text-muted-foreground text-center">
          Destacar valor, diferencial
        </span>
      </div>
      
      <div className="flex flex-col items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-primary transition-all"
           onClick={() => onValueChange("🔁 Reativar Interesse")}
      >
        <RadioGroupItem value="🔁 Reativar Interesse" id="reativar_interesse" className="sr-only" />
        <RefreshCcw className="h-6 w-6" />
        <Label htmlFor="reativar_interesse" className="text-center text-sm font-medium cursor-pointer">
          🔁 Reativar Interesse
        </Label>
        <span className="text-xs text-muted-foreground text-center">
          Resgatar contatos frios
        </span>
      </div>
      
      <div className="flex flex-col items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-primary transition-all"
           onClick={() => onValueChange("✅ Fechar Agora")}
      >
        <RadioGroupItem value="✅ Fechar Agora" id="fechar_agora" className="sr-only" />
        <CheckCircle className="h-6 w-6" />
        <Label htmlFor="fechar_agora" className="text-center text-sm font-medium cursor-pointer">
          ✅ Fechar Agora
        </Label>
        <span className="text-xs text-muted-foreground text-center">
          Urgência, conversão direta
        </span>
      </div>
    </RadioGroup>
  );
};

export default VideoObjectiveSelector;
