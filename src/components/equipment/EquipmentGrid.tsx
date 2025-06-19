
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Equipment } from '@/types/equipment';

interface EquipmentGridProps {
  equipments: Equipment[];
}

const EquipmentGrid: React.FC<EquipmentGridProps> = ({ equipments }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {equipments.map((equipment) => (
        <Card 
          key={equipment.id} 
          className="aurora-card hover:aurora-glow transition-all duration-500 hover:scale-105 aurora-glass border-aurora-electric-purple/30"
        >
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="aurora-heading font-semibold text-white truncate">{equipment.nome}</h3>
                <Badge 
                  variant="secondary" 
                  className="bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30 aurora-glow-emerald"
                >
                  Ativo
                </Badge>
              </div>
              
              {equipment.descricao && (
                <p className="aurora-body text-white/80 text-sm line-clamp-2">{equipment.descricao}</p>
              )}
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className="text-xs border-aurora-electric-purple/30 text-aurora-electric-purple bg-aurora-electric-purple/10 aurora-pulse"
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

export default EquipmentGrid;
