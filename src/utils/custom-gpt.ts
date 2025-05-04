
import { v4 as uuidv4 } from 'uuid';
import { Equipment } from '@/types/equipment';
import { ScriptResponse } from './api';

export type CustomGptType = "roteiro" | "bigIdea" | "stories";

export type ConteudoEstrategia = 
  | "🟡 Atrair Atenção" 
  | "🟢 Criar Conexão" 
  | "🔴 Fazer Comprar" 
  | "🔁 Reativar Interesse" 
  | "✅ Fechar Agora";

interface CustomGptRequestBase {
  tipo: CustomGptType;
  equipamento: string;
  quantidade?: number;
  tom?: string;
  estrategiaConteudo?: ConteudoEstrategia;
  equipamentoData?: Equipment;
}

interface AdvancedCustomGptRequest extends CustomGptRequestBase {
  topic?: string;
  bodyArea?: string;
  purposes?: string[];
  additionalInfo?: string;
  marketingObjective?: string;
}

export type CustomGptRequest = CustomGptRequestBase | AdvancedCustomGptRequest;

interface CustomGptResponse {
  id: string;
  content: string;
}

// Simulação de geração de conteúdo customizado (em um app real, isso seria uma chamada à API)
export async function generateCustomContent(request: CustomGptRequest): Promise<CustomGptResponse> {
  // Simular processamento
  console.log("Gerando conteúdo customizado:", request);
  
  // Aguardar por um tempo simulando processamento
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Gerar ID único para o conteúdo
  const contentId = uuidv4();
  
  // Gerar conteúdo baseado no tipo solicitado
  const contentIntro = getContentIntro(request);
  const contentBody = getContentBody(request);
  const contentEnding = getContentEnding(request);
  
  // Retornar resposta formatada
  return {
    id: contentId,
    content: `${contentIntro}\n\n${contentBody}\n\n${contentEnding}`
  };
}

// Funções auxiliares para geração de conteúdo
function getContentIntro(request: CustomGptRequest): string {
  const { tipo, equipamento, estrategiaConteudo } = request;
  
  switch (tipo) {
    case "roteiro":
      return `**ROTEIRO PARA ${equipamento.toUpperCase()}**\n\n${estrategiaConteudo ? `Estratégia: ${estrategiaConteudo}\n` : ''}Esse é um roteiro gerado para o equipamento ${equipamento}.`;
    case "bigIdea":
      return `**BIG IDEA: ${equipamento.toUpperCase()}**\n\n${estrategiaConteudo ? `Abordagem: ${estrategiaConteudo}\n` : ''}Uma ideia poderosa para comunicação do equipamento ${equipamento}.`;
    case "stories":
      return `**IDEIAS DE STORIES: ${equipamento.toUpperCase()}**\n\nSugestões criativas para stories sobre o equipamento ${equipamento}.`;
    default:
      return `**CONTEÚDO PERSONALIZADO: ${equipamento.toUpperCase()}**`;
  }
}

function getContentBody(request: CustomGptRequest): string {
  const { tipo, equipamento, equipamentoData } = request;
  
  const equipmentInfo = equipamentoData 
    ? `Tecnologia: ${equipamentoData.tecnologia || 'Avançada'}\n\nBenefícios: ${equipamentoData.beneficios || 'Resultados superiores'}\n\nIndicações: ${equipamentoData.indicacoes ? Array.isArray(equipamentoData.indicacoes) ? equipamentoData.indicacoes.join(", ") : equipamentoData.indicacoes : 'Diversos tratamentos'}`
    : `O ${equipamento} é um equipamento avançado com tecnologia de ponta.`;
  
  // Conteúdo adicional para o modo avançado
  let advancedContent = '';
  const advancedRequest = request as AdvancedCustomGptRequest;
  
  if (advancedRequest.topic) {
    advancedContent += `\n\nTópico principal: ${advancedRequest.topic}`;
  }
  
  if (advancedRequest.bodyArea) {
    advancedContent += `\n\nÁrea do corpo: ${advancedRequest.bodyArea}`;
  }
  
  if (advancedRequest.purposes && advancedRequest.purposes.length > 0) {
    advancedContent += `\n\nFinalidades: ${advancedRequest.purposes.join(", ")}`;
  }
  
  switch (tipo) {
    case "roteiro":
      return `## Informações sobre o equipamento\n${equipmentInfo}${advancedContent}\n\n## Gancho\n\nVocê já se perguntou como obter resultados profissionais sem precisar de procedimentos invasivos?\n\n## Corpo\n\nApresentamos o ${equipamento}, uma solução revolucionária que transforma o tratamento estético.\n\nEste equipamento utiliza tecnologia avançada para proporcionar resultados visíveis já nas primeiras sessões.\n\n## Chamada para ação\n\nAgende sua avaliação gratuita e descubra como o ${equipamento} pode transformar sua vida.`;
    
    case "bigIdea":
      return `## Conceito central\n\n"${equipamento}: Transformando o impossível em realidade"\n\n## Desenvolvimento\n${equipmentInfo}${advancedContent}\n\nEssa tecnologia revolucionária está mudando a forma como pensamos sobre tratamentos estéticos, proporcionando resultados que antes só eram possíveis com procedimentos invasivos.\n\n## Aplicações\n\nEssa ideia central pode ser aplicada em diversos formatos de conteúdo, desde postagens educativas até depoimentos de clientes satisfeitos, sempre enfatizando a transformação proporcionada.`;
    
    case "stories":
      return `## Sugestão 1: Antes e depois\n\nMostre resultados reais com o ${equipamento}, destacando a transformação em poucas sessões.\n\n## Sugestão 2: Por trás da tecnologia\n\nExplique de forma visual e simples como funciona a tecnologia do ${equipamento}.\n\n## Sugestão 3: Perguntas frequentes\n\nResponda as dúvidas mais comuns sobre o ${equipamento} em formato de stories interativos.\n\n## Sugestão 4: Depoimento de cliente\n\nCompartilhe a experiência de um cliente satisfeito com o tratamento usando o ${equipamento}.\n\n## Sugestão 5: Promoção relâmpago\n\nCrie urgência com uma oferta especial de tempo limitado para o ${equipamento}.`;
    
    default:
      return `Informações detalhadas sobre o ${equipamento}:\n\n${equipmentInfo}${advancedContent}`;
  }
}

function getContentEnding(request: CustomGptRequest): string {
  const { tipo, equipamento } = request;
  
  switch (tipo) {
    case "roteiro":
      return `## Considerações finais\n\nEste roteiro foi gerado especificamente para o ${equipamento}. Adapte conforme necessário para seu estilo de comunicação e público-alvo específico.\n\nRecomendamos gravar em ambiente bem iluminado e usar elementos visuais que destaquem os benefícios do equipamento.`;
    
    case "bigIdea":
      return `## Implementação\n\nEsta big idea pode ser desenvolvida em uma campanha completa, explorando diferentes aspectos da transformação proporcionada pelo ${equipamento}.\n\nRecomendamos criar conteúdos que mostrem o "antes e depois" da transformação, não apenas nos resultados físicos, mas também na qualidade de vida dos clientes.`;
    
    case "stories":
      return `## Dicas de produção\n\n- Use cores vibrantes e chamativas\n- Mantenha textos curtos e diretos\n- Inclua elementos interativos como enquetes e perguntas\n- Use música que combine com a energia do seu negócio\n- Finalize sempre com um call-to-action claro\n\nEstas sugestões foram criadas especificamente para promover o ${equipamento}.`;
    
    default:
      return `Conteúdo gerado para ${equipamento}. Personalize conforme necessário para sua estratégia de comunicação.`;
  }
}
