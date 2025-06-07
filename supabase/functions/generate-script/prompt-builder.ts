
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
  // Novos parâmetros para SmartScriptGenerator
  contentType?: string;
  objective?: string;
  channel?: string;
  style?: string;
  mentor?: string;
}

export interface PromptResult {
  systemPrompt: string;
  userPrompt: string;
}

const MENTOR_STYLES = {
  'leandro_ladeira': {
    name: 'Leandro Ladeira',
    style: 'Gatilhos mentais diretos, escassez, copy persuasiva e CTAs fortes que geram ação imediata.',
    characteristics: 'Use frases de impacto, crie urgência, destaque benefícios únicos e termine sempre com CTA claro.'
  },
  'icaro_carvalho': {
    name: 'Ícaro de Carvalho',
    style: 'Storytelling emocional profundo, narrativas pessoais e posicionamento autêntico.',
    characteristics: 'Conte histórias reais, conecte emocionalmente, use experiências pessoais e crie identificação.'
  },
  'paulo_cuenca': {
    name: 'Paulo Cuenca',
    style: 'Criatividade audiovisual, ritmo dinâmico, estética visual e emoção cinematográfica.',
    characteristics: 'Pense visualmente, crie ritmo, use transições criativas e desperte emoções visuais.'
  },
  'pedro_sobral': {
    name: 'Pedro Sobral',
    style: 'Clareza lógica cristalina, antecipação de objeções e CTAs inteligentes.',
    characteristics: 'Seja claro e direto, antecipe dúvidas, use lógica simples e CTAs bem pensados.'
  },
  'camila_porto': {
    name: 'Camila Porto',
    style: 'Linguagem acessível, didática e próxima do público.',
    characteristics: 'Use linguagem simples, explique de forma didática, seja próxima e educativa.'
  },
  'hyeser_souza': {
    name: 'Hyeser Souza',
    style: 'Humor viral, ganchos cômicos e linguagem de rua autêntica.',
    characteristics: 'Use humor natural, linguagem descontraída, ganchos virais e seja genuinamente engraçado.'
  },
  'washington_olivetto': {
    name: 'Washington Olivetto',
    style: 'Big ideas publicitárias, frases marcantes e criatividade conceitual.',
    characteristics: 'Crie conceitos únicos, use frases memoráveis, pense grande e seja conceitualmente criativo.'
  }
};

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
    marketingObjective,
    contentType,
    objective,
    channel,
    style,
    mentor
  } = params;

  const lang = language === "PT" ? "português" : "inglês";
  
  // Verificar se é SmartScriptGenerator
  if (contentType && ['bigIdea', 'stories', 'carousel', 'image', 'video'].includes(contentType)) {
    return buildSmartScriptPrompt(params);
  }

  // Manter lógica original para compatibilidade
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

  let systemPrompt = "";
  let userPrompt = "";

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

function buildSmartScriptPrompt(params: PromptBuilderParams): PromptResult {
  const { contentType, objective, channel, style, topic, additionalInfo, mentor } = params;
  
  const mentorInfo = mentor ? MENTOR_STYLES[mentor as keyof typeof MENTOR_STYLES] : null;
  
  let systemPrompt = `Você é o SmartScriptGenerator do sistema Fluida, especializado em criar conteúdo para redes sociais seguindo o estilo de grandes especialistas em marketing digital.

${mentorInfo ? `
🧠 MENTOR ESCOLHIDO: ${mentorInfo.name}
📝 ESTILO: ${mentorInfo.style}
✨ CARACTERÍSTICAS: ${mentorInfo.characteristics}

Você deve criar todo o conteúdo seguindo EXATAMENTE o estilo e características deste mentor.
` : ''}

🎯 OBJETIVO: ${objective || 'Engajar a audiência'}
📱 CANAL: ${channel || 'Redes sociais'}
🎨 ESTILO: ${style || 'Criativo'}
📝 TEMA: ${topic}
${additionalInfo ? `📋 OBSERVAÇÕES: ${additionalInfo}` : ''}`;

  let userPrompt = '';

  switch (contentType) {
    case 'bigIdea':
      userPrompt = `Crie EXATAMENTE 5 big ideas criativas e virais sobre "${topic}".

FORMATO DE SAÍDA OBRIGATÓRIO:
1. [Primeira ideia - título impactante]
2. [Segunda ideia - com gancho viral]  
3. [Terceira ideia - ângulo diferente]
4. [Quarta ideia - foque na transformação]
5. [Quinta ideia - gere curiosidade]

Cada ideia deve:
- Ter máximo 15 palavras
- Ser viral e impactante
- Conectar com o ${objective?.toLowerCase()}
- Seguir o estilo do mentor ${mentorInfo?.name || 'escolhido'}
- Ser adequada para ${channel}`;
      break;

    case 'video':
      userPrompt = `Crie um roteiro para vídeo de até 40 segundos sobre "${topic}".

FORMATO DE SAÍDA OBRIGATÓRIO:
🎬 Gancho:
[3-5 segundos - frase que para o scroll]

🎯 Conflito:
[10-15 segundos - problema que o público enfrenta]

🔁 Virada:
[15-20 segundos - solução ou revelação]

📣 CTA:
[5-7 segundos - chamada para ação clara]

REGRAS:
- Máximo 40 segundos total
- Gancho deve parar o scroll nos primeiros 3 segundos
- Siga o estilo do mentor ${mentorInfo?.name || 'escolhido'}
- Adapte para ${channel}
- Foque em ${objective?.toLowerCase()}`;
      break;

    case 'carousel':
      userPrompt = `Crie textos para um carrossel de 5 slides sobre "${topic}".

FORMATO DE SAÍDA OBRIGATÓRIO:
SLIDE 1 - CAPA:
[Título impactante]
[Subtítulo chamativo]

SLIDE 2 - PROBLEMA:
[Identifique a dor do público]

SLIDE 3 - SOLUÇÃO:
[Apresente a solução]

SLIDE 4 - BENEFÍCIOS:
[Liste 3 benefícios principais]

SLIDE 5 - CTA:
[Chamada para ação forte]

Cada slide deve:
- Ter texto conciso e direto
- Seguir o estilo do mentor ${mentorInfo?.name || 'escolhido'}
- Ser otimizado para ${channel}
- Focar em ${objective?.toLowerCase()}`;
      break;

    case 'image':
      userPrompt = `Crie texto para uma arte única sobre "${topic}".

FORMATO DE SAÍDA OBRIGATÓRIO:
TÍTULO PRINCIPAL:
[Título impactante em destaque]

SUBTÍTULO:
[Complemento explicativo]

TEXTO PRINCIPAL:
[Mensagem central - máximo 2 linhas]

CTA:
[Chamada para ação clara]

HASHTAGS:
[5-8 hashtags relevantes]

REGRAS:
- Texto deve caber em uma arte
- Seja direto e impactante
- Siga o estilo do mentor ${mentorInfo?.name || 'escolhido'}
- Otimize para ${channel}
- Foque em ${objective?.toLowerCase()}`;
      break;

    case 'stories':
      userPrompt = `Crie sequência de 4 stories sobre "${topic}".

FORMATO DE SAÍDA OBRIGATÓRIO:
STORIES 1:
[Gancho inicial - pare o scroll]

STORIES 2:
[Desenvolva o problema/curiosidade]

STORIES 3:
[Apresente a solução/revelação]

STORIES 4:
[CTA forte para ação]

Cada stories deve:
- Ter texto curto (máximo 2 linhas)
- Gerar expectativa para o próximo
- Seguir o estilo do mentor ${mentorInfo?.name || 'escolhido'}
- Ser adequado para stories do ${channel}
- Focar em ${objective?.toLowerCase()}`;
      break;
  }

  return { systemPrompt, userPrompt };
}
