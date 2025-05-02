
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
  equipamentoData?: Equipment; // Dados completos do equipamento selecionado
  // Campos adicionais para o modo avançado
  topic?: string;
  bodyArea?: string;
  purposes?: string[];
  additionalInfo?: string;
  marketingObjective?: string;
}

export interface CustomGptResponse {
  content: string;
  tipo: CustomGptType;
  equipamento: string;
  promptUtilizado?: string;
  id?: string; // Adding the optional id property
}

/**
 * Gera conteúdo personalizado usando o prompting específico para equipamentos estéticos
 */
export const generateCustomContent = async (request: CustomGptRequest): Promise<CustomGptResponse> => {
  try {
    console.log("Iniciando geração de conteúdo personalizado:", request);
    
    // Verificar se temos os dados do equipamento
    const equipamentoData = request.equipamentoData;
    
    if (!equipamentoData) {
      console.error("Dados do equipamento não fornecidos");
      throw new Error("Dados do equipamento não fornecidos. Selecione um equipamento válido.");
    }
    
    console.log("Dados do equipamento para o prompt:", equipamentoData);
    
    // Chamar edge function para gerar conteúdo
    const { data, error } = await supabase.functions.invoke('custom-gpt', {
      body: {
        ...request,
        equipamentoData: equipamentoData // Enviar os dados do equipamento selecionado e todos os campos adicionais
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
