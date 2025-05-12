
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ToneSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

const ToneSelector: React.FC<ToneSelectorProps> = ({ value, onValueChange, className }) => {
  // Garante sempre um valor válido
  const safeValue = value || "professional";
  
  return (
    <Select 
      value={safeValue} 
      onValueChange={onValueChange}
    >
      <SelectTrigger className={cn(
        "w-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-lg transition-all duration-300",
        "focus:ring-2 focus:ring-fluida-blue/30 focus:border-fluida-blue/50 focus:shadow-[0_0_15px_rgba(0,148,251,0.3)]",
        "hover:shadow-[0_0_10px_rgba(0,148,251,0.2)]",
        className
      )}>
        <SelectValue placeholder="Selecione o tom" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="professional">Profissional</SelectItem>
        <SelectItem value="friendly">Amigável</SelectItem>
        <SelectItem value="authoritative">Autoridade</SelectItem>
        <SelectItem value="casual">Casual</SelectItem>
        <SelectItem value="excited">Animado</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ToneSelector;
