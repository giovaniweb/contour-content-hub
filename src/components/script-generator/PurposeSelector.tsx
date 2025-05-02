
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Purpose {
  value: string;
  label: string;
}

interface PurposeSelectorProps {
  purposes: Purpose[];
  selectedPurposes: string[];
  onPurposeChange: (value: string) => void;
}

const PurposeSelector: React.FC<PurposeSelectorProps> = ({
  purposes,
  selectedPurposes,
  onPurposeChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {purposes.map((purpose) => (
        <div key={purpose.value} className="flex items-center space-x-2">
          <Checkbox
            id={`purpose-${purpose.value}`}
            checked={selectedPurposes.includes(purpose.label)}
            onCheckedChange={() => onPurposeChange(purpose.label)}
          />
          <Label
            htmlFor={`purpose-${purpose.value}`}
            className="text-sm font-normal cursor-pointer"
          >
            {purpose.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default PurposeSelector;
