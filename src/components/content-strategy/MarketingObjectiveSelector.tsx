
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MarketingObjectiveSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const MarketingObjectiveSelector: React.FC<MarketingObjectiveSelectorProps> = ({
  value,
  onChange,
  className
}) => {
  const objectives = [
    { id: "🟡 Atrair Atenção", label: "Atrair Atenção", color: "bg-yellow-100 hover:bg-yellow-200 border-yellow-300" },
    { id: "🟢 Criar Conexão", label: "Criar Conexão", color: "bg-green-100 hover:bg-green-200 border-green-300" },
    { id: "🔴 Fazer Comprar", label: "Fazer Comprar", color: "bg-red-100 hover:bg-red-200 border-red-300" },
    { id: "🔁 Reativar Interesse", label: "Reativar Interesse", color: "bg-blue-100 hover:bg-blue-200 border-blue-300" },
    { id: "✅ Fechar Agora", label: "Fechar Agora", color: "bg-emerald-100 hover:bg-emerald-200 border-emerald-300" },
  ];

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {objectives.map((objective) => (
        <Button
          key={objective.id}
          type="button"
          variant="outline"
          className={cn(
            "border text-foreground",
            value === objective.id ? `${objective.color} border-2` : "bg-transparent",
            objective.color
          )}
          onClick={() => onChange(objective.id)}
        >
          {objective.label}
        </Button>
      ))}
    </div>
  );
};

export default MarketingObjectiveSelector;
