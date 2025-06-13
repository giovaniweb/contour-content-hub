
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap } from 'lucide-react';

interface EquipmentDetailsProps {
  equipments: any[];
  roteiro: string;
}

const EquipmentDetails: React.FC<EquipmentDetailsProps> = ({ equipments, roteiro }) => {
  const getEquipmentName = (equipment: any): string => {
    if (typeof equipment === 'string') return equipment;
    if (equipment && typeof equipment === 'object' && equipment.nome) return equipment.nome;
    return 'Equipamento não especificado';
  };

  const usedEquipments = equipments.filter(equipment => {
    const equipmentName = getEquipmentName(equipment);
    return roteiro.toLowerCase().includes(equipmentName.toLowerCase());
  });

  if (usedEquipments.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="aurora-glass border border-indigo-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-300 text-lg">
            <Zap className="h-5 w-5" />
            Equipamentos Integrados no Roteiro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {usedEquipments.map((equipment, index) => {
              const equipmentName = getEquipmentName(equipment);
              const equipmentTech = typeof equipment === 'object' && equipment.tecnologia ? equipment.tecnologia : 'Tecnologia avançada';
              const equipmentBenefits = typeof equipment === 'object' && equipment.beneficios ? equipment.beneficios : 'Múltiplos benefícios estéticos';
              
              return (
                <div key={index} className="aurora-glass p-4 rounded-lg border border-indigo-500/20">
                  <h4 className="font-semibold text-indigo-300 mb-2">{equipmentName}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-slate-300"><strong>Tecnologia:</strong> {equipmentTech}</div>
                    <div className="text-slate-300"><strong>Benefícios:</strong> {equipmentBenefits}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EquipmentDetails;
