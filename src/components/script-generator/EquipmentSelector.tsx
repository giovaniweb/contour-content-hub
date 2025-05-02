
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Equipment {
  id: string;
  label: string;
}

interface EquipmentSelectorProps {
  equipmentOptions: Equipment[];
  selectedEquipment: string[];
  onEquipmentChange: (value: string) => void;
}

const EquipmentSelector: React.FC<EquipmentSelectorProps> = ({
  equipmentOptions,
  selectedEquipment,
  onEquipmentChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {equipmentOptions.map((equipment) => (
        <div key={equipment.id} className="flex items-center space-x-2">
          <Checkbox
            id={`equipment-${equipment.id}`}
            checked={selectedEquipment.includes(equipment.label)}
            onCheckedChange={() => onEquipmentChange(equipment.label)}
          />
          <Label
            htmlFor={`equipment-${equipment.id}`}
            className="text-sm font-normal cursor-pointer"
          >
            {equipment.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default EquipmentSelector;
