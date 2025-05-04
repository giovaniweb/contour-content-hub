
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Equipment } from "@/types/equipment";

interface EquipmentHeaderProps {
  equipment: Equipment;
}

export const EquipmentHeader: React.FC<EquipmentHeaderProps> = ({ equipment }) => {
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="sm" asChild>
        <Link to="/admin/equipments" className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <div>
        <h1 className="text-3xl font-bold">{equipment.nome}</h1>
        {equipment.efeito && (
          <p className="text-lg italic text-muted-foreground mt-1">
            "{equipment.efeito}"
          </p>
        )}
      </div>
    </div>
  );
};
