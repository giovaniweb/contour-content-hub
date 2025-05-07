
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { useEquipmentDetailsState } from '@/hooks/useEquipmentDetailsState';
import { EquipmentDetailsHeader } from '@/components/equipment-details/EquipmentDetailsHeader';
import { EquipmentDetailsTabsList } from '@/components/equipment-details/EquipmentDetailsTabs';
import { DetailsTab } from '@/components/equipment-details/tabs/DetailsTab';
import { DocumentsTab } from '@/components/equipment-details/tabs/DocumentsTab';
import { VideosTab } from '@/components/equipment-details/tabs/VideosTab';
import { ImportTab } from '@/components/equipment-details/tabs/ImportTab';
import { ContentTab } from '@/components/equipment-details/tabs/ContentTab';
import { EquipmentDetailsLoading } from '@/components/equipment-details/EquipmentDetailsLoading';
import { EquipmentDetailsError } from '@/components/equipment-details/EquipmentDetailsError';

const EquipmentDetails: React.FC = () => {
  // Get the equipment ID from the URL parameters
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { equipment, loading, error, activeTab, setActiveTab } = useEquipmentDetailsState(id);

  console.log("EquipmentDetails rendering with ID:", id);
  console.log("Equipment data:", equipment);

  const handleImportComplete = (importedData: any) => {
    toast({
      title: "Vídeo importado com sucesso!",
      description: `O vídeo "${importedData.titulo}" foi importado e associado a este equipamento.`,
    });
  };

  if (loading) {
    return <EquipmentDetailsLoading />;
  }

  if (error) {
    return <EquipmentDetailsError error={error} />;
  }

  if (!equipment) {
    return <EquipmentDetailsError error="Equipamento não encontrado" />;
  }

  return (
    <Layout title={equipment.nome}>
      <div className="space-y-6">
        <EquipmentDetailsHeader equipment={equipment} />

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <EquipmentDetailsTabsList activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <TabsContent value="details">
            <DetailsTab equipment={equipment} />
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentsTab />
          </TabsContent>
          
          <TabsContent value="videos">
            <VideosTab setActiveTab={setActiveTab} />
          </TabsContent>
          
          <TabsContent value="import">
            <ImportTab id={id} onCompleteImport={handleImportComplete} />
          </TabsContent>
          
          <TabsContent value="content">
            <ContentTab id={id} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EquipmentDetails;
