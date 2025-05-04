
// Função responsável por construir os prompts para diferentes tipos de roteiro

export interface PromptBuilderParams {
  type: string;
  topic: string | null;
  equipment?: string[];
  bodyArea?: string;
  purpose?: string[];
  additionalInfo?: string;
  tone?: string;
  language?: string;
  marketingObjective?: string;
}

export interface PromptResult {
  systemPrompt: string;
  userPrompt: string;
}

export function buildPrompt(params: PromptBuilderParams): PromptResult {
  const { 
    type, 
    topic, 
    equipment, 
    bodyArea, 
    purpose, 
    additionalInfo, 
    tone, 
    language,
    marketingObjective 
  } = params;

  let systemPrompt = "";
  let userPrompt = "";

  const lang = language === "PT" ? "português" : "inglês";
  
  const toneText = tone === "professional" ? "profissional" 
                 : tone === "friendly" ? "descontraído"
                 : tone === "provocative" ? "provocativo"
                 : tone === "educational" ? "educativo" 
                 : "profissional";

  // Adicionar contexto com base no objetivo de marketing
  let marketingContext = "";
  if (marketingObjective) {
    switch (marketingObjective) {
      case "🟡 Atrair Atenção":
        marketingContext = "O conteúdo deve ser impactante, chamar atenção nos primeiros segundos e criar curiosidade para quem não conhece o tratamento. Use frases de efeito e estatísticas surpreendentes.";
        break;
      case "🟢 Criar Conexão":
        marketingContext = "O conteúdo deve humanizar a marca, contar histórias pessoais e criar conexão emocional. Foque em experiências e sentimentos dos pacientes, não apenas nos resultados técnicos.";
        break;
      case "🔴 Fazer Comprar":
        marketingContext = "O conteúdo deve focar nos benefícios concretos, apresentar provas sociais e ter chamadas para ação claras. Destaque o valor do tratamento e como ele resolve problemas específicos.";
        break;
      case "🔁 Reativar Interesse":
        marketingContext = "O conteúdo deve lembrar a audiência de problemas que ainda não resolveram e trazer novidades ou abordagens diferentes. Reforce a autoridade da clínica e o diferencial do tratamento.";
        break;
      case "✅ Fechar Agora":
        marketingContext = "O conteúdo deve criar senso de urgência, destacar limitação de tempo/vagas e ter múltiplas chamadas para ação. Use frases como 'últimas vagas' e destaque condições especiais.";
        break;
    }
  }

  switch (type) {
    case "videoScript":
      systemPrompt = `Você é um especialista em marketing para clínicas estéticas. Sua tarefa é criar roteiros detalhados para vídeos educativos sobre tratamentos estéticos.`;
      userPrompt = `Crie um roteiro completo para um vídeo sobre ${topic || "tratamento estético"} em ${lang} com um tom ${toneText}.
        ${equipment?.length ? `O vídeo deve destacar o uso dos seguintes equipamentos: ${equipment.join(", ")}.` : ""}
        ${bodyArea ? `O tratamento é focado na área: ${bodyArea}.` : ""}
        ${purpose ? `O propósito do tratamento é: ${purpose}.` : ""}
        ${additionalInfo ? `Informações adicionais: ${additionalInfo}` : ""}
        ${marketingContext ? `\n\nObjetivo de marketing: ${marketingContext}` : ""}
        
        O roteiro deve incluir:
        1. Uma introdução cativante (10-15 segundos)
        2. Explicação do tratamento (30-45 segundos)
        3. Benefícios e resultados esperados (20-30 segundos)
        4. Dicas e cuidados (15-20 segundos)
        5. Chamada para ação (5-10 segundos)
        
        Formate o roteiro em Markdown com cabeçalhos para cada seção.`;
      break;
    case "bigIdea":
      systemPrompt = `Você é um estrategista de marketing especializado em criar campanhas impactantes para clínicas estéticas.`;
      userPrompt = `Desenvolva uma agenda criativa completa para uma campanha sobre ${topic || "tratamento estético"} em ${lang} com um tom ${toneText}.
        ${equipment?.length ? `A campanha deve destacar os seguintes equipamentos: ${equipment.join(", ")}.` : ""}
        ${bodyArea ? `O foco da campanha é na área: ${bodyArea}.` : ""}
        ${purpose ? `O propósito desta campanha é: ${purpose}.` : ""}
        ${additionalInfo ? `Considerações adicionais: ${additionalInfo}` : ""}
        ${marketingContext ? `\n\nObjetivo de marketing: ${marketingContext}` : ""}
        
        A agenda deve incluir:
        1. Conceito principal da campanha
        2. Pontos-chave de mensagem (mínimo 3)
        3. Estratégia de conteúdo para redes sociais
        4. Sugestões de temas para posts semanais
        
        Formate a agenda em Markdown com seções bem definidas.`;
      break;
    case "dailySales":
      systemPrompt = `Você é um especialista em copy para redes sociais de clínicas estéticas, especializado em stories que geram conversões.`;
      userPrompt = `Crie um texto curto e persuasivo para stories sobre ${topic || "tratamento estético"} em ${lang} com um tom ${toneText}.
        ${equipment?.length ? `Mencione os seguintes equipamentos: ${equipment.join(", ")}.` : ""}
        ${bodyArea ? `O foco do story é na área: ${bodyArea}.` : ""}
        ${purpose ? `O propósito desta promoção é: ${purpose}.` : ""}
        ${additionalInfo ? `Considerações adicionais: ${additionalInfo}` : ""}
        ${marketingContext ? `\n\nObjetivo de marketing: ${marketingContext}` : ""}
        
        O texto deve:
        1. Capturar a atenção nos primeiros 5-7 segundos
        2. Destacar um benefício exclusivo
        3. Criar senso de urgência
        4. Terminar com uma chamada para ação clara
        
        Limite o texto a no máximo 280 caracteres para que seja eficaz em stories.`;
      break;
  }

  return { systemPrompt, userPrompt };
}
