
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
    <TabsList className="grid grid-cols-4 lg:grid-cols-4 mb-6">
      <TabsTrigger value="details">Detalhes</TabsTrigger>
      <TabsTrigger value="articles">Artigos Científicos</TabsTrigger>
      <TabsTrigger value="videos">Vídeos</TabsTrigger>
      <TabsTrigger value="arts">Artes</TabsTrigger>
    </TabsList>
  );
};
