
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Equipment } from '@/types/equipment';

interface EquipmentDetailsHeaderProps {
  equipment: Equipment;
}

export const EquipmentDetailsHeader: React.FC<EquipmentDetailsHeaderProps> = ({ equipment }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/equipments')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">{equipment.nome}</h1>
        {equipment.ativo ? (
          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Ativo</span>
        ) : (
          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Inativo</span>
        )}
      </div>
    </div>
  );
};
