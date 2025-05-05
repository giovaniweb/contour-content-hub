
// Se este arquivo não puder ser editado, precisaríamos criar uma versão atualizada
// ou criar um arquivo intermediário que corrige as tipagens

import { MarketingObjectiveType } from '@/types/script';
import { Equipment } from '@/hooks/useEquipments';
import { supabase, SUPABASE_BASE_URL } from '@/integrations/supabase/client';

export type CustomGptType = 'roteiro' | 'bigIdea' | 'stories';

// Adding ConteudoEstrategia type that was missing
export type ConteudoEstrategia = MarketingObjectiveType;

export interface CustomGptRequest {
  tipo: CustomGptType;
  equipamento: string;
  equipamentoData?: Equipment;
  quantidade: number;
  tom?: string;
  estrategiaConteudo?: MarketingObjectiveType;
  topic?: string;
  bodyArea?: string;
  purposes?: string[];
  additionalInfo?: string;
  marketingObjective?: MarketingObjectiveType;
}

export interface CustomGptResult {
  id: string;
  content: string;
  title?: string;
  type?: string;
}

export async function generateCustomContent(request: CustomGptRequest): Promise<string> {
  // Verificar se estamos em ambiente de produção com Supabase disponível
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    try {
      console.log("Chamando Supabase Edge Function para geração de conteúdo");
      
      // Get authentication token
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      
      if (!token) {
        console.error('Usuário não autenticado');
        throw new Error('Usuário não autenticado');
      }
      
      if (!SUPABASE_BASE_URL) {
        console.error('SUPABASE_BASE_URL não definido');
        throw new Error('SUPABASE_BASE_URL não definido');
      }
      
      // Chamar a Edge Function do Supabase diretamente
      const response = await fetch(`${SUPABASE_BASE_URL}/functions/v1/custom-gpt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      console.log("Resposta da Edge Function recebida com sucesso");
      return data.content;
    } catch (error) {
      console.error('Erro ao chamar a API de conteúdo personalizado:', error);
      // Fallback para simulação local em caso de erro
      return simulateResponse(request);
    }
  } else {
    // Simulação local para desenvolvimento
    return simulateResponse(request);
  }
}

// Função de simulação para desenvolvimento local
function simulateResponse(request: CustomGptRequest): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Modelo de resposta simulada baseada no tipo de conteúdo
      let content = '';
      const equipmentName = request.equipamentoData?.nome || request.equipamento || 'equipamento';
      const equipmentTech = request.equipamentoData?.tecnologia || 'tecnologia avançada';
      const equipmentBenefits = request.equipamentoData?.beneficios || 'resultados rápidos';
      
      switch (request.tipo) {
        case 'roteiro':
          content = `# Roteiro: ${request.topic || 'Sem título'}\n\n## Introdução\nComece com um gancho forte sobre ${request.bodyArea || 'o tratamento'} usando ${equipmentName}.\n\n## Desenvolvimento\nExplique os benefícios principais:\n- ${equipmentBenefits.split(',')[0] || 'Resultado rápido'}\n- ${equipmentBenefits.split(',')[1] || 'Sem dor'}\n- ${equipmentTech}\n\n## Conclusão\nChame para ação com foco em ${request.marketingObjective || 'agendar consulta'}.`;
          break;
        case 'bigIdea':
          content = `# Big Idea: ${request.topic || 'Transformação'}\n\n## Conceito Principal\nA grande ideia é mostrar como ${request.bodyArea || 'o tratamento'} pode transformar a vida do cliente com ${equipmentName}.\n\n## Elementos Emocionais\n- Antes e depois emocional\n- Histórias de superação\n- Conexão com valores pessoais\n\n## Call-to-Action\nConvide para conhecer mais sobre ${equipmentName}.`;
          break;
        case 'stories':
          content = `# Story: ${request.topic || 'Dica rápida'}\n\n## Slide 1\nPergunta intrigante sobre ${request.bodyArea || 'tratamento estético'} com ${equipmentName}?\n\n## Slide 2\nRevele o problema comum que muitos enfrentam.\n\n## Slide 3\nApresente ${equipmentName} como resposta ideal.\n\n## Slide 4\nMostre resultados concretos e chame para ação.`;
          break;
        default:
          content = `# Conteúdo Genérico\n\nConteúdo genérico sobre ${request.topic || equipmentName}.`;
      }
      
      resolve(content);
    }, 2000); // Simula um atraso de 2 segundos
  });
}
