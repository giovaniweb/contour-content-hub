
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Equipment } from '@/types/equipment';

interface EquipmentGridProps {
  equipments: Equipment[];
  onEquipmentSelect?: (equipmentId: string) => void;
  selectedEquipment?: string | null;
}

const EquipmentGrid: React.FC<EquipmentGridProps> = ({ 
  equipments, 
  onEquipmentSelect, 
  selectedEquipment 
}) => {
  const navigate = useNavigate();

  const handleEquipmentClick = (equipmentId: string) => {
    if (onEquipmentSelect) {
      onEquipmentSelect(equipmentId);
    } else {
      navigate(`/equipments/${equipmentId}`);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {equipments.map((equipment) => (
        <Card 
          key={equipment.id} 
          className={`aurora-card hover:aurora-glow transition-all duration-500 hover:scale-105 aurora-glass cursor-pointer ${
            selectedEquipment === equipment.id 
              ? 'border-aurora-emerald/60 aurora-glow-emerald' 
              : 'border-aurora-electric-purple/30'
          }`}
          onClick={() => handleEquipmentClick(equipment.id)}
        >
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Equipment Image */}
              {(equipment.thumbnail_url || equipment.image_url) && (
                <div className="relative">
                  <img 
                    src={equipment.thumbnail_url || equipment.image_url} 
                    alt={equipment.nome}
                    className="w-full h-32 object-cover rounded-xl border border-aurora-electric-purple/20"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-aurora-electric-purple/10 to-aurora-neon-blue/10"></div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <h3 className="aurora-heading font-semibold text-white truncate">{equipment.nome}</h3>
                <Badge 
                  variant="secondary" 
                  className="bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30 aurora-glow-emerald"
                >
                  Ativo
                </Badge>
              </div>
              
              {equipment.tecnologia && (
                <p className="aurora-body text-white/80 text-sm line-clamp-2">{equipment.tecnologia}</p>
              )}
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className="text-xs border-aurora-electric-purple/30 text-aurora-electric-purple bg-aurora-electric-purple/10 aurora-pulse"
                >
                  {equipment.categoria === 'estetico' ? '🌟 Estético' : '🏥 Médico'}
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
