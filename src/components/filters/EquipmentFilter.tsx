import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEquipmentFilter } from '@/hooks/useEquipmentFilter';

interface EquipmentFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const EquipmentFilter: React.FC<EquipmentFilterProps> = ({ 
  value, 
  onValueChange,
  placeholder = "Todos os equipamentos",
  className = ""
}) => {
  const { equipmentOptions, isLoading } = useEquipmentFilter();
  
  // Garante sempre um valor válido
  const safeValue = value || "all";
  
  return (
    <div className={className}>
      <Select
        value={safeValue}
        onValueChange={(value) => onValueChange(value === "all" ? "" : value)}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full bg-slate-800/50 border-cyan-400/30 text-white rounded-xl">
          <SelectValue placeholder={isLoading ? "Carregando..." : placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-cyan-400/30">
          <SelectItem value="all" className="text-white hover:bg-slate-800 focus:bg-slate-800">
            {placeholder}
          </SelectItem>
          {equipmentOptions.map((equipment) => (
            <SelectItem 
              key={equipment.value} 
              value={equipment.value}
              className="text-white hover:bg-slate-800 focus:bg-slate-800"
            >
              {equipment.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};