
import React from "react";
import { 
  Target, 
  HeartHandshake, 
  ShoppingCart, 
  Repeat, 
  CheckCircle2 
} from "lucide-react";
import { MarketingObjectiveType } from "@/types/script";

interface ScriptObjectiveBadgeProps {
  objective: MarketingObjectiveType | string;
}

const ScriptObjectiveBadge: React.FC<ScriptObjectiveBadgeProps> = ({ objective }) => {
  // Render objective icon based on type
  const renderObjectiveIcon = () => {
    switch (objective) {
      case '🟡 Atrair Atenção':
        return <Target className="h-4 w-4 text-amber-500" />;
      case '🟢 Criar Conexão':
        return <HeartHandshake className="h-4 w-4 text-green-500" />;
      case '🔴 Fazer Comprar':
        return <ShoppingCart className="h-4 w-4 text-red-500" />;
      case '🔁 Reativar Interesse':
        return <Repeat className="h-4 w-4 text-blue-500" />;
      case '✅ Fechar Agora':
        return <CheckCircle2 className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-sm">
      {renderObjectiveIcon()}
      <span className="font-medium">{objective.replace(/[🟡🟢🔴🔁✅]\s/, '')}</span>
    </div>
  );
};

export default ScriptObjectiveBadge;
