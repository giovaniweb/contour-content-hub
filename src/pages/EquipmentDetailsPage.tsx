
import React from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useEquipmentDetails } from "@/hooks/useEquipmentDetails";
import { EquipmentHeader } from "@/components/equipment/EquipmentHeader";
import { EquipmentSidebar } from "@/components/equipment/EquipmentSidebar";
import { EquipmentTabs } from "@/components/equipment/EquipmentTabs";
import { EquipmentDetailsError } from "@/components/equipment/EquipmentDetailsError";
import { EquipmentLoading } from "@/components/equipment/EquipmentLoading";

const EquipmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    equipment, 
    isLoading, 
    relatedFiles, 
    relatedVideos, 
    activeTab,
    setActiveTab,
    error 
  } = useEquipmentDetails(id);

  // Adicionar console.logs para depuração
  console.log("Estado atual:", { isLoading, error, equipment, relatedFiles: relatedFiles.length, relatedVideos: relatedVideos.length });

  if (isLoading) {
    return <EquipmentLoading />;
  }

  if (error) {
    return (
      <EquipmentDetailsError 
        title="Erro" 
        message="Ocorreu um problema ao carregar os detalhes do equipamento."
      />
    );
  }

  if (!equipment) {
    return (
      <EquipmentDetailsError 
        title="Equipamento não encontrado" 
        message="O equipamento solicitado não existe ou foi removido."
      />
    );
  }

  return (
    <Layout title={`Equipamento: ${equipment.nome}`}>
      <div className="space-y-6">
        {/* Header with back button */}
        <EquipmentHeader equipment={equipment} />

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar with image */}
          <EquipmentSidebar equipment={equipment} />

          {/* Details tabs */}
          <div className="md:col-span-2">
            <EquipmentTabs
              equipment={equipment}
              relatedFiles={relatedFiles}
              relatedVideos={relatedVideos}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EquipmentDetailsPage;
