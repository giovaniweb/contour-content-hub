
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Equipment {
  id: string;
  nome: string;
}

export const useEquipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching equipment list...");
        
        const { data, error } = await supabase
          .from('equipamentos')
          .select('id, nome')
          .eq('ativo', true)
          .order('nome');
          
        if (error) {
          console.error('Error fetching equipments:', error);
          setError("Falha ao buscar equipamentos");
          toast.error("Erro ao buscar equipamentos", {
            description: "Não foi possível carregar a lista de equipamentos."
          });
          throw error;
        }
        
        console.log(`Successfully fetched ${data?.length || 0} equipments`);
        setEquipments(data || []);
      } catch (error: any) {
        console.error('Error fetching equipments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEquipments();
  }, []);

  return { equipments, loading, error };
};
