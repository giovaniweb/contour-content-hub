
import React from "react";
import { Equipment } from "@/types/equipment";

interface InfoTabProps {
  equipment: Equipment;
}

export const InfoTab: React.FC<InfoTabProps> = ({ equipment }) => {
  return (
    <div className="space-y-4 mt-0">
      <div>
        <h3 className="text-lg font-semibold">Tecnologia</h3>
        <p className="mt-1 text-gray-600">{equipment.tecnologia}</p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Indicações</h3>
        <p className="mt-1 text-gray-600">{Array.isArray(equipment.indicacoes) 
          ? equipment.indicacoes.join(", ") 
          : equipment.indicacoes}</p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Benefícios</h3>
        <p className="mt-1 text-gray-600">{equipment.beneficios}</p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Efeito</h3>
        <p className="mt-1 text-gray-600">{equipment.efeito || "Não informado"}</p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Diferenciais</h3>
        <p className="mt-1 text-gray-600">{equipment.diferenciais}</p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Linguagem Recomendada</h3>
        <p className="mt-1 text-gray-600">{equipment.linguagem}</p>
      </div>
    </div>
  );
};
