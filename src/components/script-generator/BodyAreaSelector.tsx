
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BodyArea {
  value: string;
  label: string;
}

interface BodyAreaSelectorProps {
  bodyAreas: BodyArea[];
  value: string;
  onValueChange: (value: string) => void;
}

const BodyAreaSelector: React.FC<BodyAreaSelectorProps> = ({
  bodyAreas,
  value,
  onValueChange,
}) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione uma área" />
      </SelectTrigger>
      <SelectContent>
        {bodyAreas.map((area) => (
          <SelectItem key={area.value} value={area.value}>
            {area.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default BodyAreaSelector;
