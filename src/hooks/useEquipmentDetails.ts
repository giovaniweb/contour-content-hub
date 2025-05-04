
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getEquipmentById } from '@/api/equipment/getEquipment';
import { fetchEquipmentFiles, fetchEquipmentVideos } from '@/api/equipment/equipmentFiles';
import { Equipment } from "@/types/equipment";

export const useEquipmentDetails = (id?: string) => {
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedFiles, setRelatedFiles] = useState<any[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("info");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadEquipment(id);
    } else {
      setError("ID do equipamento não especificado");
      setIsLoading(false);
      console.error("ID do equipamento não fornecido na URL");
    }
  }, [id]);

  const loadEquipment = async (equipmentId: string) => {
    try {
      console.log(`EquipmentDetailsPage: Carregando equipamento com ID ${equipmentId}`);
      setIsLoading(true);
      setError(null);
      
      const equipmentData = await getEquipmentById(equipmentId);
      console.log("EquipmentDetailsPage: Dados recebidos:", equipmentData);
      
      if (equipmentData) {
        setEquipment(equipmentData);
        
        // Load related content
        if (equipmentData.nome) {
          console.log(`EquipmentDetailsPage: Buscando arquivos para ${equipmentData.nome}`);
          const filesData = await fetchEquipmentFiles(equipmentData.nome);
          const videosData = await fetchEquipmentVideos(equipmentData.nome);
          
          console.log(`EquipmentDetailsPage: Arquivos encontrados: ${filesData?.length || 0}`);
          console.log(`EquipmentDetailsPage: Vídeos encontrados: ${videosData?.length || 0}`);
          
          setRelatedFiles(filesData || []);
          setRelatedVideos(videosData || []);
        }
      } else {
        console.error(`EquipmentDetailsPage: Equipamento não encontrado para ID ${equipmentId}`);
        setError("Equipamento não encontrado");
        toast({
          variant: "destructive",
          title: "Equipamento não encontrado",
          description: "O equipamento solicitado não foi encontrado."
        });
      }
    } catch (error) {
      console.error("EquipmentDetailsPage: Erro ao carregar equipamento:", error);
      setError("Erro ao carregar dados do equipamento");
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os dados do equipamento."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    equipment,
    isLoading,
    relatedFiles,
    relatedVideos,
    activeTab,
    setActiveTab,
    error
  };
};
