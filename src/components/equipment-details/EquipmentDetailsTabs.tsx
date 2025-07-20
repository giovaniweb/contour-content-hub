
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Video, Palette, Images, MessageCircle, Info } from "lucide-react";

interface EquipmentDetailsTabsListProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const EquipmentDetailsTabsList: React.FC<EquipmentDetailsTabsListProps> = ({ 
  activeTab, 
  setActiveTab
}) => {
  return (
    <TabsList className="grid grid-cols-6 lg:grid-cols-6 mb-6 aurora-glass">
      <TabsTrigger 
        value="details"
        className="flex items-center gap-2 data-[state=active]:bg-aurora-electric-purple/20 data-[state=active]:text-aurora-electric-purple"
      >
        <Info className="h-4 w-4" />
        Detalhes
      </TabsTrigger>
      <TabsTrigger 
        value="articles"
        className="flex items-center gap-2 data-[state=active]:bg-aurora-electric-purple/20 data-[state=active]:text-aurora-electric-purple"
      >
        <FileText className="h-4 w-4" />
        Artigos
      </TabsTrigger>
      <TabsTrigger 
        value="videos"
        className="flex items-center gap-2 data-[state=active]:bg-aurora-electric-purple/20 data-[state=active]:text-aurora-electric-purple"
      >
        <Video className="h-4 w-4" />
        Vídeos
      </TabsTrigger>
      <TabsTrigger 
        value="photos"
        className="flex items-center gap-2 data-[state=active]:bg-aurora-electric-purple/20 data-[state=active]:text-aurora-electric-purple"
      >
        <Images className="h-4 w-4" />
        Fotos
      </TabsTrigger>
      <TabsTrigger 
        value="arts"
        className="flex items-center gap-2 data-[state=active]:bg-aurora-electric-purple/20 data-[state=active]:text-aurora-electric-purple"
      >
        <Palette className="h-4 w-4" />
        Artes
      </TabsTrigger>
      <TabsTrigger 
        value="chat"
        className="flex items-center gap-2 data-[state=active]:bg-aurora-electric-purple/20 data-[state=active]:text-aurora-electric-purple"
      >
        <MessageCircle className="h-4 w-4" />
        Chat IA
      </TabsTrigger>
    </TabsList>
  );
};
