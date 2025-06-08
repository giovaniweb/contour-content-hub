
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";

interface Equipment {
  id: string;
  label: string;
  categoria?: 'estetico' | 'medico';
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
  const { profile } = useUserProfile();

  // Filtrar equipamentos baseado no tipo de clínica
  const getFilteredEquipments = () => {
    if (!profile?.clinic_type) {
      return equipmentOptions; // Se não souber o tipo, mostra todos
    }
    
    if (profile.clinic_type === 'clinica_medica') {
      return equipmentOptions; // Clínica médica pode ver todos
    } else {
      // Clínica estética só vê equipamentos estéticos
      return equipmentOptions.filter(eq => eq.categoria === 'estetico');
    }
  };

  const filteredEquipments = getFilteredEquipments();

  return (
    <div className="space-y-4">
      {profile?.clinic_type === 'clinica_estetica' && (
        <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Clínica Estética</span>
          </div>
          <p className="text-xs text-amber-300">
            Você está visualizando apenas equipamentos estéticos compatíveis com seu perfil.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2">
        {filteredEquipments.map((equipment) => (
          <div key={equipment.id} className="flex items-center space-x-2">
            <Checkbox
              id={`equipment-${equipment.id}`}
              checked={selectedEquipment.includes(equipment.label)}
              onCheckedChange={() => onEquipmentChange(equipment.label)}
            />
            <Label
              htmlFor={`equipment-${equipment.id}`}
              className="text-sm font-normal cursor-pointer flex items-center gap-2"
            >
              {equipment.label}
              {equipment.categoria && (
                <Badge variant="secondary" className="text-xs">
                  {equipment.categoria === 'estetico' ? 'Estético' : 'Médico'}
                </Badge>
              )}
            </Label>
          </div>
        ))}
      </div>
      
      {filteredEquipments.length === 0 && (
        <div className="text-center py-4 text-gray-400">
          <p className="text-sm">
            {profile?.clinic_type === 'clinica_estetica' 
              ? 'Nenhum equipamento estético disponível para seu perfil'
              : 'Nenhum equipamento disponível'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default EquipmentSelector;
