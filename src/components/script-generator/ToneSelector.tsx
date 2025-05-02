
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ToneSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const ToneSelector: React.FC<ToneSelectorProps> = ({ value, onValueChange }) => {
  return (
    <Select value={value || "professional"} onValueChange={onValueChange}>
      <SelectTrigger>
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
