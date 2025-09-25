
// Função responsável por construir os prompts para diferentes tipos de roteiro

import { getElementosUniversaisByMentor, getEspecialidadesByMentor, type ElementosUniversais } from './mentor-elements.ts';

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

// Estrutura universal dos 10 elementos
const buildUniversalElementsPrompt = (mentor: string | undefined, elementos: ElementosUniversais): string => {
  if (!mentor) return '';
  const especialidades = getEspecialidadesByMentor(mentor);
  
  return `
🎯 ESTRUTURA UNIVERSAL DOS 10 ELEMENTOS (Método Leandro Ladeira adaptado):

1. STORYTELLING (Intensidade: ${elementos.storytelling}/10)
   ${elementos.storytelling >= 8 ? '- Narrativas envolventes e emocionais' : elementos.storytelling >= 6 ? '- Histórias simples e diretas' : '- Elementos narrativos sutis'}

2. COPYWRITING (Intensidade: ${elementos.copywriting}/10)
   ${elementos.copywriting >= 8 ? '- Textos persuasivos e impactantes' : elementos.copywriting >= 6 ? '- Copy clara e objetiva' : '- Linguagem simples e acessível'}

3. CONHECIMENTO DO PÚBLICO-ALVO (Intensidade: ${elementos.conhecimento_publico}/10)
   ${elementos.conhecimento_publico >= 8 ? '- Segmentação precisa e personalizada' : elementos.conhecimento_publico >= 6 ? '- Perfil básico definido' : '- Público geral'}

4. ANÁLISES E DADOS (Intensidade: ${elementos.analises_dados}/10)
   ${elementos.analises_dados >= 8 ? '- Métricas detalhadas e otimização' : elementos.analises_dados >= 6 ? '- Dados básicos de performance' : '- Foco na criatividade'}

5. GATILHOS MENTAIS (Intensidade: ${elementos.gatilhos_mentais}/10)
   ${elementos.gatilhos_mentais >= 8 ? '- Escassez, urgência, prova social' : elementos.gatilhos_mentais >= 6 ? '- Gatilhos sutis' : '- Persuasão natural'}

6. LÓGICA ARGUMENTATIVA (Intensidade: ${elementos.logica_argumentativa}/10)
   ${elementos.logica_argumentativa >= 8 ? '- Argumentos estruturados e convincentes' : elementos.logica_argumentativa >= 6 ? '- Razões claras' : '- Abordagem emocional'}

7. PREMISSAS EDUCATIVAS (Intensidade: ${elementos.premissas_educativas}/10)
   ${elementos.premissas_educativas >= 8 ? '- Educação antes da oferta' : elementos.premissas_educativas >= 6 ? '- Informações básicas' : '- Foco na ação'}

8. MAPAS DE EMPATIA (Intensidade: ${elementos.mapas_empatia}/10)
   ${elementos.mapas_empatia >= 8 ? '- Perspectiva profunda do cliente' : elementos.mapas_empatia >= 6 ? '- Compreensão básica' : '- Abordagem direta'}

9. HEADLINES (Intensidade: ${elementos.headlines}/10)
   ${elementos.headlines >= 8 ? '- Títulos magnéticos e irresistíveis' : elementos.headlines >= 6 ? '- Títulos claros e atrativos' : '- Títulos simples'}

10. FERRAMENTAS ESPECÍFICAS (Intensidade: ${elementos.ferramentas_especificas}/10)
    ${elementos.ferramentas_especificas >= 8 ? '- CTAs, funis, vídeos de venda' : elementos.ferramentas_especificas >= 6 ? '- CTAs básicos' : '- Chamadas simples'}

🎨 ESPECIALIDADES DO MENTOR: ${especialidades.join(', ')}
`;
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
  const elementos = mentor ? getElementosUniversaisByMentor(mentor) : null;
  
  let systemPrompt = `Você é o SmartScriptGenerator do sistema Fluida, especializado em criar conteúdo para redes sociais seguindo o estilo de grandes especialistas em marketing digital.

${mentorInfo && elementos ? `
🧠 MENTOR ESCOLHIDO: ${mentorInfo.name}
📝 ESTILO: ${mentorInfo.style}
✨ CARACTERÍSTICAS: ${mentorInfo.characteristics}

${buildUniversalElementsPrompt(mentor, elementos)}

Você deve criar todo o conteúdo seguindo EXATAMENTE o estilo e características deste mentor, aplicando os 10 elementos universais com as intensidades especificadas.
` : ''}

🎯 OBJETIVO: ${objective || 'Engajar a audiência'}
📱 CANAL: ${channel || 'Redes sociais'}
🎨 ESTILO: ${style || 'Criativo'}
📝 TEMA: ${topic}
${additionalInfo ? `📋 OBSERVAÇÕES: ${additionalInfo}` : ''}`;

  let userPrompt = '';

  switch (contentType) {
    case 'bigIdea':
      userPrompt = `Crie EXATAMENTE 5 big ideas criativas e virais sobre "${topic}" seguindo a estrutura dos 10 elementos universais.

FORMATO DE SAÍDA OBRIGATÓRIO:
1. [Primeira ideia - aplique headline magnético]
2. [Segunda ideia - use storytelling + gatilhos mentais]  
3. [Terceira ideia - foque em lógica argumentativa]
4. [Quarta ideia - mapas de empatia + copywriting]
5. [Quinta ideia - ferramentas específicas + premissas educativas]

Cada ideia deve:
- Ter máximo 15 palavras
- Ser viral e impactante
- Conectar com o ${objective?.toLowerCase()}
- Seguir os elementos universais do mentor ${mentorInfo?.name || 'escolhido'}
- Ser adequada para ${channel}`;
      break;

    case 'video':
      userPrompt = `Crie um roteiro para vídeo de até 40 segundos sobre "${topic}" aplicando os 10 elementos universais.

FORMATO DE SAÍDA OBRIGATÓRIO:
🎬 Gancho (Headlines + Storytelling):
[3-5 segundos - frase que para o scroll]

🎯 Conflito (Mapas de Empatia + Conhecimento do Público):
[10-15 segundos - problema que o público enfrenta]

🔁 Virada (Lógica Argumentativa + Premissas Educativas):
[15-20 segundos - solução ou revelação]

📣 CTA (Gatilhos Mentais + Ferramentas Específicas):
[5-7 segundos - chamada para ação clara]

REGRAS:
- Máximo 40 segundos total
- Aplique copywriting persuasivo em todo o roteiro
- Use análises e dados quando relevante
- Siga o estilo do mentor ${mentorInfo?.name || 'escolhido'}
- Adapte para ${channel}
- Foque em ${objective?.toLowerCase()}`;
      break;

    case 'carousel':
      userPrompt = `Crie textos para um carrossel de 5 slides sobre "${topic}" seguindo os 10 elementos universais.

FORMATO DE SAÍDA OBRIGATÓRIO:
SLIDE 1 - CAPA (Headlines + Copywriting):
[Título impactante]
[Subtítulo chamativo]

SLIDE 2 - PROBLEMA (Mapas de Empatia + Conhecimento do Público):
[Identifique a dor do público]

SLIDE 3 - EDUCAÇÃO (Premissas Educativas + Lógica Argumentativa):
[Eduque antes de vender]

SLIDE 4 - SOLUÇÃO (Storytelling + Análises e Dados):
[Apresente a solução com prova]

SLIDE 5 - CTA (Gatilhos Mentais + Ferramentas Específicas):
[Chamada para ação forte]

Cada slide deve:
- Ter texto conciso e direto
- Seguir os elementos universais do mentor ${mentorInfo?.name || 'escolhido'}
- Ser otimizado para ${channel}
- Focar em ${objective?.toLowerCase()}`;
      break;

    case 'image':
      userPrompt = `Crie texto para uma arte única sobre "${topic}" aplicando os 10 elementos universais.

FORMATO DE SAÍDA OBRIGATÓRIO:
TÍTULO PRINCIPAL (Headlines + Copywriting):
[Título impactante em destaque]

SUBTÍTULO (Conhecimento do Público + Mapas de Empatia):
[Complemento explicativo]

TEXTO PRINCIPAL (Storytelling + Lógica Argumentativa):
[Mensagem central - máximo 2 linhas]

DADOS/PROVA (Análises e Dados + Premissas Educativas):
[Estatística ou informação relevante]

CTA (Gatilhos Mentais + Ferramentas Específicas):
[Chamada para ação clara]

HASHTAGS:
[5-8 hashtags relevantes]

REGRAS:
- Texto deve caber em uma arte
- Seja direto e impactante
- Siga os elementos universais do mentor ${mentorInfo?.name || 'escolhido'}
- Otimize para ${channel}
- Foque em ${objective?.toLowerCase()}`;
      break;

    case 'stories':
      userPrompt = `Crie sequência de 4 stories sobre "${topic}" aplicando os 10 elementos universais.

FORMATO DE SAÍDA OBRIGATÓRIO:
STORIES 1 (Headlines + Gatilhos Mentais):
[Gancho inicial - pare o scroll]

STORIES 2 (Storytelling + Mapas de Empatia):
[Desenvolva o problema/curiosidade]

STORIES 3 (Lógica Argumentativa + Premissas Educativas):
[Apresente a solução/revelação]

STORIES 4 (Copywriting + Ferramentas Específicas):
[CTA forte para ação]

Cada stories deve:
- Ter texto curto (máximo 2 linhas)
- Gerar expectativa para o próximo
- Seguir os elementos universais do mentor ${mentorInfo?.name || 'escolhido'}
- Ser adequado para stories do ${channel}
- Focar em ${objective?.toLowerCase()}`;
      break;
  }

  return { systemPrompt, userPrompt };
}
