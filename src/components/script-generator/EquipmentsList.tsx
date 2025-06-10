
import React from 'react';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

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
    <div className="space-y-3">
      <Label className="aurora-accent font-semibold text-base">
        Equipamentos (Selecione os principais)
      </Label>
      <div className="grid grid-cols-2 gap-3">
        {equipments.map((equipment, index) => (
          <motion.label
            key={equipment.id}
            className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer aurora-glass backdrop-blur-sm ${
              selectedEquipments.includes(equipment.id)
                ? 'border-purple-500/50 aurora-glow bg-purple-500/10'
                : 'border-purple-300/20 hover:border-purple-400/40'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            <input
              type="checkbox"
              checked={selectedEquipments.includes(equipment.id)}
              onChange={() => onEquipmentChange(equipment.id)}
              className="rounded aurora-focus"
            />
            <span className={`text-sm font-medium ${
              selectedEquipments.includes(equipment.id) 
                ? 'aurora-electric-purple' 
                : 'aurora-body'
            }`}>
              {equipment.nome}
            </span>
          </motion.label>
        ))}
      </div>
    </div>
  );
};

export default EquipmentsList;
