
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Equipment {
  id: string;
  nome: string;
}

interface EquipmentFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  equipments: Equipment[];
}

export const EquipmentFilter: React.FC<EquipmentFilterProps> = ({ 
  value, 
  onValueChange,
  equipments
}) => {
  return (
    <div>
      <Select
        value={value || "all"}
        onValueChange={(value) => onValueChange(value === "all" ? undefined : value)}
      >
        <SelectTrigger className="w-full text-sm h-9">
          <SelectValue placeholder="Todos os equipamentos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os equipamentos</SelectItem>
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
  );
};
