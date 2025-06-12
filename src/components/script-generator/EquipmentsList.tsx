
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
      <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto scrollbar-hide">
        {equipments.map((equipment, index) => (
          <motion.label
            key={equipment.id}
            className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
              selectedEquipments.includes(equipment.id)
                ? 'border-purple-500/70 bg-purple-500/10 shadow-md shadow-purple-500/20'
                : 'border-gray-700 bg-gray-800/80 hover:border-purple-400/50 hover:bg-gray-700/90 hover:shadow-lg hover:shadow-purple-500/10'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -1 }}
          >
            <input
              type="checkbox"
              checked={selectedEquipments.includes(equipment.id)}
              onChange={() => onEquipmentChange(equipment.id)}
              className="rounded aurora-focus"
            />
            <span className={`text-sm font-medium ${
              selectedEquipments.includes(equipment.id) 
                ? 'text-purple-300' 
                : 'text-gray-200'
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
