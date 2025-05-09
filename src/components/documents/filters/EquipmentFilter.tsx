
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Equipment {
  id: string;
  nome: string;
}

interface EquipmentFilterProps {
  equipmentId: string;
  equipments: Equipment[];
  onEquipmentChange: (value: string) => void;
}

export const EquipmentFilter: React.FC<EquipmentFilterProps> = ({ 
  equipmentId, 
  equipments, 
  onEquipmentChange 
}) => {
  // Garante sempre um valor válido, usando "all" em vez de string vazia
  const safeValue = equipmentId || "all";
  
  return (
    <div>
      <Select
        value={safeValue}
        onValueChange={onEquipmentChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Equipamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {equipments
            .filter(equipment => equipment && equipment.id && equipment.id !== "")
            .map(equipment => (
              <SelectItem key={equipment.id} value={equipment.id}>
                {equipment.nome}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};
