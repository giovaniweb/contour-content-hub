
// Types for custom GPT integration
export type CustomGptType = "roteiro" | "bigIdea" | "stories";
export type ConteudoEstrategia = "atrair_atencao" | "criar_conexao" | "fazer_comprar" | "reativar_interesse" | "fechar_agora" | string;

// Request interface for Custom GPT
export interface CustomGptRequest {
  tipo: CustomGptType;
  equipamento?: string;
  quantidade: number;
  tom?: string;
  estrategiaConteudo?: ConteudoEstrategia;
  topic?: string;
  bodyArea?: string;
  purposes?: string[];
  additionalInfo?: string;
  marketingObjective?: string;
}

// Result interface for Custom GPT
export interface CustomGptResult {
  id: string;
  content: string;
}

// Function to generate custom content
export const generateCustomContent = async (request: CustomGptRequest): Promise<string> => {
  console.log("Generating custom content with request:", request);
  
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate different content based on type
  let baseContent = '';
  
  switch (request.tipo) {
    case "roteiro":
      baseContent = `# Roteiro para ${request.topic || 'Vídeo'}\n\n`;
      baseContent += `## Abertura\n- Olá, hoje vamos falar sobre ${request.topic}.\n- [Apresentação rápida do tema]\n\n`;
      baseContent += `## Desenvolvimento\n- Ponto 1: Benefícios do ${request.equipamento || 'equipamento'}\n`;
      baseContent += `- Ponto 2: Como funciona o tratamento\n`;
      baseContent += `- Ponto 3: Resultados esperados\n\n`;
      baseContent += `## Fechamento\n- CTA: Agende sua avaliação\n- Informações de contato\n\n`;
      
      if (request.additionalInfo) {
        baseContent += `## Observações adicionais\n${request.additionalInfo}\n\n`;
      }
      
      break;
      
    case "bigIdea":
      baseContent = `# Big Idea: ${request.topic || 'Campanha'}\n\n`;
      baseContent += `## Conceito Central\nUm novo conceito revolucionário para ${request.topic}.\n\n`;
      baseContent += `## Mensagem Principal\n"${request.tom || 'Transforme sua vida'} com ${request.equipamento || 'nossa tecnologia'}"\n\n`;
      baseContent += `## Elementos da Campanha\n1. Posts para redes sociais\n2. E-mail marketing\n3. Landing page\n\n`;
      baseContent += `## Cronograma\n- Semana 1: Teaser\n- Semana 2: Lançamento\n- Semana 3: Depoimentos\n- Semana 4: Oferta especial\n\n`;
      
      break;
      
    case "stories":
      baseContent = `# Story para Instagram\n\n`;
      baseContent += `## Slide 1\n👋 Você sabia que ${request.topic || 'nosso tratamento'} pode mudar sua vida?\n\n`;
      baseContent += `## Slide 2\n✨ ${request.equipamento || 'Nossa tecnologia'} oferece resultados incríveis.\n\n`;
      baseContent += `## Slide 3\n🔎 Veja o antes e depois!\n\n`;
      baseContent += `## Slide 4\n💬 Agende seu horário: [CONTATO]\n\n`;
      
      if (request.marketingObjective) {
        baseContent += `## Objetivo: ${request.marketingObjective}\n`;
      }
      
      break;
      
    default:
      baseContent = `# Conteúdo Personalizado\n\n`;
      baseContent += `Tópico: ${request.topic || 'Não especificado'}\n`;
      baseContent += `Equipamento: ${request.equipamento || 'Não especificado'}\n`;
      baseContent += `Informações adicionais: ${request.additionalInfo || 'Nenhuma'}\n`;
  }
  
  return baseContent;
};
