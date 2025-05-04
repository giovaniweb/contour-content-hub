
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, PlusSquare } from "lucide-react";
import { Equipment } from "@/types/equipment";

interface EquipmentSidebarProps {
  equipment: Equipment;
}

export const EquipmentSidebar: React.FC<EquipmentSidebarProps> = ({ equipment }) => {
  return (
    <Card className="md:col-span-1 h-fit">
      <CardContent className="p-4 flex flex-col items-center">
        {equipment.image_url ? (
          <img 
            src={equipment.image_url} 
            alt={equipment.nome} 
            className="w-full h-auto rounded-lg object-cover"
          />
        ) : (
          <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
            <ImageIcon className="h-24 w-24 text-gray-400" />
          </div>
        )}
        
        <div className="mt-4 w-full">
          <Button className="w-full" asChild>
            <Link to={`/admin/content?equipment=${equipment.nome}`}>
              <PlusSquare className="mr-2 h-4 w-4" />
              Cadastrar Arquivo Relacionado
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
