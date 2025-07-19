
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Equipment } from '@/types/equipment';
import { Eye } from 'lucide-react';

interface EquipmentListProps {
  equipments: Equipment[];
  onEquipmentSelect?: (equipmentId: string) => void;
  onEquipmentView?: (equipmentId: string) => void;
  selectedEquipment?: string | null;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ 
  equipments, 
  onEquipmentSelect, 
  onEquipmentView,
  selectedEquipment 
}) => {
  const navigate = useNavigate();

  const handleEquipmentClick = (equipmentId: string) => {
    console.log('🔍 EquipmentList - Clicou no equipamento:', equipmentId);
    console.log('🔍 EquipmentList - Navegando para:', `/equipment/${equipmentId}`);
    // Always navigate to equipment details when clicking the card
    navigate(`/equipment/${equipmentId}`);
  };

  return (
    <div className="space-y-4">
      {equipments.map((equipment) => (
        <Card 
          key={equipment.id} 
          className={`aurora-card hover:aurora-glow-blue transition-all duration-500 hover:scale-[1.02] aurora-glass cursor-pointer ${
            selectedEquipment === equipment.id 
              ? 'border-aurora-emerald/60 aurora-glow-emerald' 
              : 'border-aurora-electric-purple/30'
          }`}
          onClick={() => handleEquipmentClick(equipment.id)}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {/* Equipment Image */}
                {equipment.thumbnail_url || equipment.image_url ? (
                  <div className="relative">
                    <img 
                      src={equipment.thumbnail_url || equipment.image_url} 
                      alt={equipment.nome} 
                      className="w-16 h-16 object-cover rounded-xl border border-aurora-electric-purple/30"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-aurora-electric-purple/20 to-aurora-neon-blue/20"></div>
                  </div>
                ) : (
                  <div className="w-16 h-16 aurora-glass rounded-xl flex items-center justify-center text-aurora-electric-purple border border-aurora-electric-purple/30">
                    <Eye className="h-6 w-6" />
                  </div>
                )}
                
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
                  {equipment.tecnologia && (
                    <p className="aurora-body text-white/80 text-sm mt-2 max-w-2xl">{equipment.tecnologia}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3">
                    <Badge 
                      variant="outline" 
                      className="text-xs border-aurora-electric-purple/30 text-aurora-electric-purple bg-aurora-electric-purple/10 aurora-shimmer"
                    >
                      {equipment.categoria === 'estetico' ? '🌟 Estético' : '🏥 Médico'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {onEquipmentSelect ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEquipmentSelect(equipment.id);
                    }}
                    className="text-aurora-electric-purple hover:text-white hover:bg-aurora-electric-purple/20 flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Filtrar
                  </Button>
                ) : (
                  <div className="aurora-floating">
                    <Eye className="h-5 w-5 text-aurora-electric-purple" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EquipmentList;
