
import { Equipment } from "@/types/equipment";
import { ScriptResponse } from "./api";

export type CustomGptType = "roteiro" | "bigIdea" | "stories";
export type ConteudoEstrategia = "🟡 Atrair Atenção" | "🟢 Criar Conexão" | "🔴 Fazer Comprar" | "🔁 Reativar Interesse" | "✅ Fechar Agora";

export interface CustomGptRequest {
  tipo: CustomGptType;
  equipamento: string;
  quantidade?: number;
  tom?: string;
  estrategiaConteudo?: ConteudoEstrategia;
  topic?: string;
  bodyArea?: string;
  purposes?: string[];
  additionalInfo?: string;
  marketingObjective?: string;
}

export interface CustomGptResult {
  id: string;
  content: string;
}

const sampleResponses: Record<CustomGptType, string[]> = {
  roteiro: [
    "# ROTEIRO: BENEFÍCIOS DO [EQUIPAMENTO]\n\n## GANCHO DE ABERTURA\n\"Você já se perguntou como conseguir resultados incríveis em tratamentos estéticos sem passar por procedimentos invasivos? Hoje vou te mostrar como o [EQUIPAMENTO] está revolucionando o mercado.\"\n\n## DESENVOLVIMENTO\n- Apresente o equipamento brevemente\n- Explique os 3 principais benefícios\n- Demonstre uma aplicação rápida\n- Mostre um antes e depois ou testimunho\n\n## CALL-TO-ACTION\n\"Marque uma avaliação gratuita e descubra como o [EQUIPAMENTO] pode transformar sua vida. Link na bio!\"",
    "# ROTEIRO: TRANSFORMAÇÕES COM [EQUIPAMENTO]\n\n## GANCHO DE ABERTURA\n\"O que torna um tratamento estético realmente eficaz? Vou te mostrar como o [EQUIPAMENTO] está transformando a vida das minhas pacientes.\"\n\n## DESENVOLVIMENTO\n- Conte a história de uma paciente (preservando identidade)\n- Explique o problema que ela enfrentava\n- Mostre como o [EQUIPAMENTO] resolveu esse problema\n- Apresente os resultados com antes e depois\n\n## CALL-TO-ACTION\n\"Quer conhecer mais histórias de transformação? Me siga e agende sua consulta para fazer parte destas histórias de sucesso!\"",
    "# ROTEIRO: COMO FUNCIONA O [EQUIPAMENTO]\n\n## GANCHO DE ABERTURA\n\"Muitas pessoas me perguntam como exatamente o [EQUIPAMENTO] consegue resultados tão impressionantes. Hoje vou te mostrar o que acontece nos bastidores.\"\n\n## DESENVOLVIMENTO\n- Explique de forma simples a tecnologia por trás do equipamento\n- Demonstre em um modelo ou paciente voluntário\n- Destaque a segurança e o conforto durante o tratamento\n- Explique quanto tempo leva para ver resultados\n\n## CALL-TO-ACTION\n\"Tem alguma dúvida sobre como o [EQUIPAMENTO] pode ajudar no seu caso específico? Deixe nos comentários ou me chame no direct!\""
  ],
  bigIdea: [
    "# BIG IDEA: CONQUISTE A MELHOR VERSÃO DE SI COM [EQUIPAMENTO]\n\n## HEADLINE PRINCIPAL\n\"Descubra como o [EQUIPAMENTO] está ajudando mulheres a recuperarem sua autoestima sem procedimentos invasivos\"\n\n## SUBHEADLINES\n1. \"A tecnologia que está revolucionando tratamentos estéticos\"\n2. \"Por que celebridades estão escolhendo esta opção?\"\n3. \"Resultados visíveis em apenas [X] sessões\"\n\n## ELEMENTOS DA CAMPANHA\n- Série de depoimentos em vídeo\n- Webinário gratuito sobre a tecnologia\n- Oferta especial para primeiras sessões\n- E-book sobre cuidados complementares\n\n## CALENDÁRIO DE PUBLICAÇÕES\n- Segunda: Live explicativa\n- Quarta: Destaque de resultados\n- Sexta: Promoção especial de fim de semana",
    "# BIG IDEA: REVOLUÇÃO ESTÉTICA: O PODER DO [EQUIPAMENTO]\n\n## HEADLINE PRINCIPAL\n\"A tecnologia que está fazendo cirurgiões plásticos repensarem procedimentos invasivos\"\n\n## SUBHEADLINES\n1. \"Como o [EQUIPAMENTO] atinge resultados sem cortes ou agulhas\"\n2. \"O segredo que as clínicas de luxo não querem que você saiba\"\n3. \"A ciência por trás dos resultados impressionantes\"\n\n## ELEMENTOS DA CAMPANHA\n- Comparativo antes e depois (série de posts)\n- Desafio de transformação de 30 dias\n- Quiz: Qual tratamento é ideal para você?\n- Consultas demonstrativas gratuitas\n\n## CALENDÁRIO DE PUBLICAÇÕES\n- Terça: Post educativo sobre a tecnologia\n- Quinta: Depoimento em vídeo\n- Domingo: Perguntas e respostas nos Stories",
    "# BIG IDEA: [EQUIPAMENTO] - SUA JORNADA PARA A CONFIANÇA\n\n## HEADLINE PRINCIPAL\n\"Transforme sua relação com o espelho em apenas [X] semanas com [EQUIPAMENTO]\"\n\n## SUBHEADLINES\n1. \"O método comprovado cientificamente para resultados duradouros\"\n2. \"Por que 95% das nossas pacientes recomendam este tratamento\"\n3. \"A solução definitiva para [problema específico]\"\n\n## ELEMENTOS DA CAMPANHA\n- Jornal de transformação (documentando resultados semanais)\n- Grupo exclusivo de suporte no WhatsApp\n- Evento presencial de demonstração\n- Parcerias com influenciadores locais\n\n## CALENDÁRIO DE PUBLICAÇÕES\n- Segunda a sexta: Mini-histórias diárias nos Stories\n- Terça e quinta: Posts de feed educativos\n- Sábado: Live com especialista convidado"
  ],
  stories: [
    "# STORY 1: CURIOSIDADE SOBRE [EQUIPAMENTO]\n\nTexto: \"Você sabia que o [EQUIPAMENTO] usa a mesma tecnologia utilizada por atletas olímpicos para recuperação muscular? 😮\"\n\nVisual: Imagem do equipamento com destaque para sua tecnologia\n\nInteração: Enquete \"Você já conhecia essa tecnologia?\" (Sim/Não)\n\n---\n\n# STORY 2: DÚVIDA COMUM\n\nTexto: \"Muitas pessoas me perguntam se o tratamento com [EQUIPAMENTO] dói... A resposta é: absolutamente não! 🙌\"\n\nVisual: Vídeo curto mostrando uma paciente relaxada durante o procedimento\n\nInteração: Caixa de perguntas \"Qual sua dúvida sobre o [EQUIPAMENTO]?\"\n\n---\n\n# STORY 3: RESULTADO DO DIA\n\nTexto: \"Olha só esse resultado incrível após apenas 3 sessões de [EQUIPAMENTO]! 😍\"\n\nVisual: Foto de antes e depois (com autorização)\n\nInteração: Contador regressivo \"Última vaga da semana em 3, 2, 1...\"",
    "# STORY 1: BASTIDORES\n\nTexto: \"Preparando a sala para mais um dia de tratamentos com [EQUIPAMENTO]! ✨\"\n\nVisual: Timelapse da preparação da sala e equipamento\n\nInteração: Caixa de perguntas \"Quer marcar seu horário hoje?\"\n\n---\n\n# STORY 2: QUIZ RÁPIDO\n\nTexto: \"Você sabe para que serve o [EQUIPAMENTO]? Deslize para descobrir! 👆\"\n\nVisual: Série de telas explicando as principais funções\n\nInteração: Quiz de verdadeiro ou falso sobre os benefícios\n\n---\n\n# STORY 3: PROMOÇÃO RELÂMPAGO\n\nTexto: \"APENAS HOJE: Avaliação gratuita + 15% OFF na primeira sessão de [EQUIPAMENTO]! 🔥\"\n\nVisual: Arte com detalhes da promoção\n\nInteração: Link direto para agendamento online",
    "# STORY 1: DEPOIMENTO RÁPIDO\n\nTexto: \"A Renata compartilhou sua experiência com o [EQUIPAMENTO]! Ouça o que ela tem a dizer: 🗣️\"\n\nVisual: Vídeo curto de depoimento de cliente\n\nInteração: Emoji slider \"Quão impressionante é esse resultado?\"\n\n---\n\n# STORY 2: COMPARATIVO\n\nTexto: \"[EQUIPAMENTO] vs. Métodos tradicionais: veja a diferença! 👀\"\n\nVisual: Tabela comparativa com pontos positivos e negativos\n\nInteração: Enquete \"Qual você prefere?\"\n\n---\n\n# STORY 3: DICA PROFISSIONAL\n\nTexto: \"Dica da expert: para potencializar os resultados do [EQUIPAMENTO], faça isso em casa: 💪\"\n\nVisual: Vídeo curto demonstrando uma dica complementar\n\nInteração: Caixa de mensagem \"Quer mais dicas como essa?\""
  ]
};

export async function generateCustomContent(request: CustomGptRequest): Promise<string> {
  const { tipo, equipamento, estrategiaConteudo } = request;
  
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Select a random response template based on the type
  const templates = sampleResponses[tipo] || [];
  const template = templates[Math.floor(Math.random() * templates.length)] || "Conteúdo não disponível para este tipo.";
  
  // Replace placeholders with actual values
  let content = template.replace(/\[EQUIPAMENTO\]/g, equipamento);
  
  // Add strategy-specific content if provided
  if (estrategiaConteudo) {
    content += `\n\n## ESTRATÉGIA DE CONTEÚDO\nEste conteúdo foi criado seguindo a estratégia: ${estrategiaConteudo}`;
    
    switch (estrategiaConteudo) {
      case "🟡 Atrair Atenção":
        content += "\n- Foco em criar curiosidade e despertar interesse inicial";
        break;
      case "🟢 Criar Conexão":
        content += "\n- Foco em estabelecer credibilidade e criar vínculo emocional";
        break;
      case "🔴 Fazer Comprar":
        content += "\n- Foco em apresentar benefícios claros e chamadas para ação";
        break;
      case "🔁 Reativar Interesse":
        content += "\n- Foco em reengajar clientes que já conhecem a marca";
        break;
      case "✅ Fechar Agora":
        content += "\n- Foco em urgência e conversão imediata";
        break;
    }
  }
  
  return content;
}

export async function translateScriptTypeToAPI(customType: CustomGptType): Promise<ScriptResponse["type"]> {
  // Map custom GPT types to API script types
  switch (customType) {
    case "roteiro":
      return "videoScript";
    case "bigIdea":
      return "bigIdea";
    case "stories":
      return "dailySales";
    default:
      return "videoScript";
  }
}
