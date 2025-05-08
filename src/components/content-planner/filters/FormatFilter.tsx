
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormatFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const FormatFilter: React.FC<FormatFilterProps> = ({ 
  value, 
  onValueChange 
}) => {
  return (
    <div>
      <Select
        value={value || "all"}
        onValueChange={(value) => onValueChange(value === "all" ? undefined : value)}
      >
        <SelectTrigger className="w-full text-sm h-9">
          <SelectValue placeholder="Todos os formatos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os formatos</SelectItem>
          <SelectItem value="vídeo">Vídeo</SelectItem>
          <SelectItem value="story">Story</SelectItem>
          <SelectItem value="carrossel">Carrossel</SelectItem>
          <SelectItem value="reels">Reels</SelectItem>
          <SelectItem value="texto">Texto</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
