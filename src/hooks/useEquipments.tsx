
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logQuery, logQueryResult } from "@/utils/validation/loggingUtils";

export interface Equipment {
  id: string;
  nome: string;
  tecnologia?: string;
  beneficios?: string;
  indicacoes?: string[] | string;
  diferenciais?: string;
  linguagem?: string;
  ativo?: boolean;
  image_url?: string;
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
        logQuery('select', 'equipamentos', { active: true });
        
        // Use any to break the type inference chain
        const query = supabase
          .from('equipamentos')
          .select('id, nome, tecnologia, beneficios, indicacoes, diferenciais, linguagem, ativo, image_url')
          .eq('ativo', true)
          .order('nome') as any;
          
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching equipments:', error);
          setError("Falha ao buscar equipamentos");
          toast.error("Erro ao buscar equipamentos", {
            description: "Não foi possível carregar a lista de equipamentos."
          });
          logQueryResult('select', 'equipamentos', false, null, error);
          return;
        }
        
        // Log success with count
        console.log(`Successfully fetched ${data?.length || 0} equipments`);
        logQueryResult('select', 'equipamentos', true, { count: data?.length || 0 });
        
        // Process the data with explicit typing
        const processedData = data as unknown as Equipment[];
        setEquipments(processedData || []);
      } catch (error: any) {
        console.error('Error in equipment fetch operation:', error);
        setError(error.message || "Erro desconhecido ao buscar equipamentos");
      } finally {
        setLoading(false);
      }
    };
    
    fetchEquipments();
  }, []);

  return { equipments, loading, error };
};
