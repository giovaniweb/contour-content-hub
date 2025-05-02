
import { supabase } from '@/integrations/supabase/client';
import { Equipment } from '@/types/equipment';
import { getEquipments } from './api-equipment';

export type CustomGptType = 'roteiro' | 'bigIdea' | 'stories';

export type ConteudoEstrategia = 
  '🟡 Atrair Atenção' | 
  '🟢 Criar Conexão' | 
  '🔴 Fazer Comprar' | 
  '🔁 Reativar Interesse' | 
  '✅ Fechar Agora';

export interface CustomGptRequest {
  tipo: CustomGptType;
  equipamento: string;
  quantidade?: number;
  tom?: string;
  estrategiaConteudo?: ConteudoEstrategia;
}

export interface CustomGptResponse {
  content: string;
  tipo: CustomGptType;
  equipamento: string;
  promptUtilizado?: string;
}

/**
 * Gera conteúdo personalizado usando o prompting específico para equipamentos estéticos
 */
export const generateCustomContent = async (request: CustomGptRequest): Promise<CustomGptResponse> => {
  try {
    console.log("Iniciando geração de conteúdo personalizado:", request);
    
    // Buscar todos os equipamentos para passar ao prompt
    const equipamentos = await getEquipments();
    
    // Chamar edge function para gerar conteúdo
    const { data, error } = await supabase.functions.invoke('custom-gpt', {
      body: {
        ...request,
        equipamentosData: equipamentos
      }
    });
    
    if (error) {
      console.error("Erro ao invocar função custom-gpt:", error);
      throw error;
    }
    
    console.log("Conteúdo personalizado gerado com sucesso");
    
    return data as CustomGptResponse;
  } catch (error) {
    console.error('Erro ao gerar conteúdo personalizado:', error);
    throw error;
  }
};
