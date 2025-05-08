
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ObjectiveFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const ObjectiveFilter: React.FC<ObjectiveFilterProps> = ({ 
  value, 
  onValueChange 
}) => {
  // Garante sempre um valor válido
  const safeValue = value || "all";
  
  return (
    <div>
      <Select
        value={safeValue}
        onValueChange={(value) => onValueChange(value === "all" ? undefined : value)}
      >
        <SelectTrigger className="w-full text-sm h-9">
          <SelectValue placeholder="Todos os objetivos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os objetivos</SelectItem>
          <SelectItem value="🟡 Atrair Atenção">Atrair Atenção</SelectItem>
          <SelectItem value="🟢 Criar Conexão">Criar Conexão</SelectItem>
          <SelectItem value="🔴 Fazer Comprar">Fazer Comprar</SelectItem>
          <SelectItem value="🔁 Reativar Interesse">Reativar Interesse</SelectItem>
          <SelectItem value="✅ Fechar Agora">Fechar Agora</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
