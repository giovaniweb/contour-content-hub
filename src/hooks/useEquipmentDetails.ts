
import { useState, useEffect } from 'react';
import { getEquipmentById } from '@/api/equipment';
import { Equipment } from '@/types/equipment';
import { supabase } from '@/integrations/supabase/client';

export const useEquipmentDetails = (id?: string) => {
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedFiles, setRelatedFiles] = useState<any[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      if (!id) {
        setError('ID não fornecido');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch equipment details
        const equipmentData = await getEquipmentById(id);
        
        if (!equipmentData) {
          setError('Equipamento não encontrado');
          setIsLoading(false);
          return;
        }
        
        setEquipment(equipmentData);
        
        try {
          // Fetch related files
          const { data: filesData, error: filesError } = await supabase
            .from('documentos_tecnicos')
            .select('*')
            .eq('equipamento_id', id)
            .eq('status', 'ativo');
          
          if (filesError) {
            console.error('Error fetching files:', filesError);
          }
          
          console.log('Files for equipment:', filesData);
          setRelatedFiles(filesData || []);
          
          // Fetch related videos
          const { data: videosData, error: videosError } = await supabase
            .from('videos')
            .select('*')
            .contains('equipamentos', [equipmentData.nome]);
            
          if (videosError) {
            console.error('Error fetching videos:', videosError);
          }
          
          setRelatedVideos(videosData || []);
        } catch (supabaseError) {
          console.error('Supabase query error:', supabaseError);
          // Continue with the equipment data we have
        }
      } catch (err) {
        console.error('Error fetching equipment details:', err);
        setError('Erro ao carregar detalhes do equipamento');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEquipmentDetails();
  }, [id]);

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
