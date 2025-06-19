
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Equipment } from '@/types/equipment';

interface EquipmentListProps {
  equipments: Equipment[];
}

const EquipmentList: React.FC<EquipmentListProps> = ({ equipments }) => {
  return (
    <div className="space-y-3">
      {equipments.map((equipment) => (
        <Card key={equipment.id} className="hover:shadow-md transition-shadow bg-slate-800/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-slate-100">{equipment.nome}</h3>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Ativo
                  </Badge>
                </div>
                {equipment.descricao && (
                  <p className="text-sm text-slate-300 mt-1">{equipment.descricao}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                  {equipment.categoria || 'Geral'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EquipmentList;
