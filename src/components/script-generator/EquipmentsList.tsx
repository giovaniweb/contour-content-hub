
import React from 'react';
import { Label } from '@/components/ui/label';

interface Equipment {
  id: string;
  nome: string;
}

interface EquipmentsListProps {
  equipments: Equipment[];
  selectedEquipments: string[];
  onEquipmentChange: (equipmentId: string) => void;
}

const EquipmentsList: React.FC<EquipmentsListProps> = ({
  equipments,
  selectedEquipments,
  onEquipmentChange
}) => {
  return (
    <div className="space-y-2">
      <Label>Equipamentos (Selecione os principais)</Label>
      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
        {equipments.map((equipment) => (
          <label
            key={equipment.id}
            className="flex items-center space-x-2 p-2 rounded border hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={selectedEquipments.includes(equipment.id)}
              onChange={() => onEquipmentChange(equipment.id)}
              className="rounded"
            />
            <span className="text-sm">{equipment.nome}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default EquipmentsList;
