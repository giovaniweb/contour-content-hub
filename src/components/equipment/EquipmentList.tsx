
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Equipment } from '@/types/equipment';

interface EquipmentListProps {
  equipments: Equipment[];
}

const EquipmentList: React.FC<EquipmentListProps> = ({ equipments }) => {
  return (
    <div className="space-y-4">
      {equipments.map((equipment) => (
        <Card 
          key={equipment.id} 
          className="aurora-card hover:aurora-glow-blue transition-all duration-500 hover:scale-[1.02] aurora-glass border-aurora-electric-purple/30"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h3 className="aurora-heading font-semibold text-white">{equipment.nome}</h3>
                  <Badge 
                    variant="secondary" 
                    className="bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30 aurora-glow-emerald"
                  >
                    Ativo
                  </Badge>
                </div>
                {equipment.descricao && (
                  <p className="aurora-body text-white/80 text-sm mt-2">{equipment.descricao}</p>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Badge 
                  variant="outline" 
                  className="text-xs border-aurora-electric-purple/30 text-aurora-electric-purple bg-aurora-electric-purple/10 aurora-shimmer"
                >
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
