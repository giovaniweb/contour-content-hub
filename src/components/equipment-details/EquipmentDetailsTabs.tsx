
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EquipmentDetailsTabsListProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const EquipmentDetailsTabsList: React.FC<EquipmentDetailsTabsListProps> = ({ 
  activeTab, 
  setActiveTab
}) => {
  return (
    <TabsList className="grid grid-cols-3 lg:grid-cols-5 mb-6">
      <TabsTrigger value="details">Detalhes</TabsTrigger>
      <TabsTrigger value="documents">Documentos</TabsTrigger>
      <TabsTrigger value="videos">Vídeos</TabsTrigger>
      <TabsTrigger value="import">Importar</TabsTrigger>
      <TabsTrigger value="content">Criar Conteúdo</TabsTrigger>
    </TabsList>
  );
};
