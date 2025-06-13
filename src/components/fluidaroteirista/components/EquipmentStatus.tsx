
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface EquipmentStatusProps {
  hasEquipments: boolean;
  equipmentUsedInScript: boolean;
  equipmentCount: number;
}

const EquipmentStatus: React.FC<EquipmentStatusProps> = ({
  hasEquipments,
  equipmentUsedInScript,
  equipmentCount
}) => {
  if (!hasEquipments) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className={`aurora-glass border ${equipmentUsedInScript ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
        <CardContent className="p-4">
          <div className={`flex items-center gap-3 ${equipmentUsedInScript ? 'text-green-400' : 'text-red-400'}`}>
            {equipmentUsedInScript ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-sm">
                {equipmentUsedInScript ? 'Equipamentos Integrados ✅' : 'Equipamentos Não Utilizados ⚠️'}
              </h3>
              <p className={`text-xs mt-1 ${equipmentUsedInScript ? 'text-green-300' : 'text-red-300'}`}>
                {equipmentUsedInScript 
                  ? `${equipmentCount} equipamento(s) mencionado(s) no roteiro`
                  : `${equipmentCount} equipamento(s) selecionado(s) mas não utilizados no roteiro`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EquipmentStatus;
