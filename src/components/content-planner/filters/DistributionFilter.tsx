
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DistributionFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const DistributionFilter: React.FC<DistributionFilterProps> = ({ 
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
          <SelectValue placeholder="Todos os canais" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os canais</SelectItem>
          <SelectItem value="Instagram">Instagram</SelectItem>
          <SelectItem value="YouTube">YouTube</SelectItem>
          <SelectItem value="TikTok">TikTok</SelectItem>
          <SelectItem value="Blog">Blog</SelectItem>
          <SelectItem value="Múltiplos">Múltiplos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
