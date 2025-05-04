
// Se este arquivo não puder ser editado, precisaríamos criar uma versão atualizada
// ou criar um arquivo intermediário que corrige as tipagens

import { MarketingObjectiveType } from '@/types/script';

export type CustomGptType = 'roteiro' | 'bigIdea' | 'stories';

// Adding ConteudoEstrategia type that was missing
export type ConteudoEstrategia = MarketingObjectiveType;

export interface CustomGptRequest {
  tipo: CustomGptType;
  equipamento: string;
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
}

export async function generateCustomContent(request: CustomGptRequest): Promise<string> {
  // Simulando uma chamada de API com uma promessa resolvida após um atraso
  return new Promise((resolve) => {
    setTimeout(() => {
      // Modelo de resposta simulada baseada no tipo de conteúdo
      let content = '';
      
      switch (request.tipo) {
        case 'roteiro':
          content = `# Roteiro: ${request.topic || 'Sem título'}\n\n## Introdução\nComece com um gancho forte sobre ${request.bodyArea || 'o tratamento'} usando ${request.equipamento || 'o equipamento'}.\n\n## Desenvolvimento\nExplique os benefícios principais:\n- Resultado rápido\n- Sem dor\n- Tecnologia avançada\n\n## Conclusão\nChame para ação com foco em ${request.marketingObjective || 'agendar consulta'}.`;
          break;
        case 'bigIdea':
          content = `# Big Idea: ${request.topic || 'Transformação'}\n\n## Conceito Principal\nA grande ideia é mostrar como ${request.bodyArea || 'o tratamento'} pode transformar a vida do cliente.\n\n## Elementos Emocionais\n- Antes e depois emocional\n- Histórias de superação\n- Conexão com valores pessoais\n\n## Call-to-Action\nConvide para conhecer mais sobre ${request.equipamento || 'o tratamento'}.`;
          break;
        case 'stories':
          content = `# Story: ${request.topic || 'Dica rápida'}\n\n## Slide 1\nPergunta intrigante sobre ${request.bodyArea || 'tratamento estético'}?\n\n## Slide 2\nRevele o problema comum que muitos enfrentam.\n\n## Slide 3\nApresente ${request.equipamento || 'a solução'} como resposta ideal.\n\n## Slide 4\nMostre resultados concretos e chame para ação.`;
          break;
        default:
          content = `# Conteúdo Genérico\n\nConteúdo genérico sobre ${request.topic || 'tema não especificado'}.`;
      }
      
      resolve(content);
    }, 2000); // Simula um atraso de 2 segundos
  });
}
