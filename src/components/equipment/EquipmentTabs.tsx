
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Equipment } from "@/types/equipment";
import { InfoTab } from "./tabs/InfoTab";
import { FilesTab } from "./tabs/FilesTab";
import { VideosTab } from "./tabs/VideosTab";
import { EquipmentPhotosTab } from "./tabs/EquipmentPhotosTab";
import { EquipmentVideosTab } from "./tabs/EquipmentVideosTab";
import { EquipmentArtsTab } from "./tabs/EquipmentArtsTab";

interface EquipmentTabsProps {
  equipment: Equipment;
  relatedFiles: any[];
  relatedVideos: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const EquipmentTabs: React.FC<EquipmentTabsProps> = ({ 
  equipment, 
  relatedFiles, 
  relatedVideos, 
  activeTab,
  setActiveTab
}) => {
  return (
    <Card>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardHeader>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="files">Arquivos</TabsTrigger>
            <TabsTrigger value="photos">Fotos</TabsTrigger>
            <TabsTrigger value="videos">Vídeos</TabsTrigger>
            <TabsTrigger value="arts">Artes</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent className="p-6">
          <TabsContent value="info">
            <InfoTab equipment={equipment} />
          </TabsContent>
          
          <TabsContent value="files">
            <FilesTab files={relatedFiles} equipmentName={equipment.nome} />
          </TabsContent>
          
          <TabsContent value="photos">
            <EquipmentPhotosTab equipmentName={equipment.nome} />
          </TabsContent>
          
          <TabsContent value="videos">
            <EquipmentVideosTab equipmentId={equipment.id} equipmentName={equipment.nome} />
          </TabsContent>
          
          <TabsContent value="arts">
            <EquipmentArtsTab equipmentId={equipment.id} equipmentName={equipment.nome} />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};
