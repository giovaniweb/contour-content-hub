
import { AkinatorState, MentorProfile } from './types';
import { MENTORS, ENIGMAS } from './constants';

export const selectMentor = (answers: AkinatorState): string => {
  const { contentType, objective, style, channel, theme } = answers;
  
  // Regras específicas baseadas na nova lógica
  if (contentType === 'video' && objective === 'vender' && style === 'direto') {
    return 'diretoEscassez';
  }
  if (contentType === 'video' && style === 'emocional') {
    return 'storytellingEmocional';
  }
  if (contentType === 'image' && style === 'criativo') {
    return 'criativoPoetico';
  }
  if (contentType === 'carousel' && style === 'didático') {
    return 'didaticoPassoAPasso';
  }
  if (objective === 'leads' && style === 'direto') {
    return 'tecnicoEstruturado';
  }
  if (style === 'humoristico') {
    return 'humorViral';
  }
  if (style === 'publicitário') {
    return 'criativoInstitucional';
  }
  if (style === 'institucional') {
    return 'estrategicoRacional';
  }
  
  // Fallback para outros casos
  if (style === 'provocativo') return 'diretoEscassez';
  if (objective === 'ensinar') return 'didaticoPassoAPasso';
  if (objective === 'posicionar') return 'estrategicoRacional';
  
  return 'tecnicoEstruturado';
};

export const generateSpecificScript = (answers: AkinatorState, mentorKey: string) => {
  const mentor = MENTORS[mentorKey];
  const { contentType, objective, style, channel, theme } = answers;
  
  let gancho = "";
  let conflito = "";
  let virada = "";
  let cta = "";

  if (mentorKey === 'diretoEscassez') {
    gancho = "87% das pessoas perdem R$ 3.200 por mês sem saber desta estratégia";
    conflito = "Você trabalha 12 horas por dia, mas seu faturamento não cresce porque está usando métodos ultrapassados";
    virada = "Quando apliquei o funil de conversão otimizado, meu ticket médio saltou de R$ 150 para R$ 890 em 30 dias";
    cta = "Clica no link da bio e baixa a planilha que uso para calcular ROI de cada cliente";
  } else if (mentorKey === 'storytellingEmocional') {
    gancho = "Minha filha de 8 anos me perguntou: 'Pai, por que você chora olhando o celular?'";
    conflito = "Eu acabara de receber a mensagem de uma mãe dizendo que nosso tratamento salvou a autoestima da filha dela";
    virada = "Percebi que não estava só vendendo procedimentos, estava devolvendo a confiança que essas mulheres perderam";
    cta = "Se você também quer transformar vidas enquanto cresce profissionalmente, me chama no direct";
  } else if (mentorKey === 'criativoPoetico') {
    gancho = "Transformei um rosto cansado numa obra de arte que respira juventude";
    conflito = "Muitas pessoas acham que beleza é superficial, mas esquece que autoestima impacta toda nossa vida";
    virada = "Com HIFU 4D não invasivo, você conquista o resultado de cirurgia sem os riscos e o tempo de recuperação";
    cta = "Marca aquela amiga que merece se sentir radiante todos os dias";
  } else if (mentorKey === 'didaticoPassoAPasso') {
    gancho = "Vou te ensinar em 3 passos como aumentar suas vendas em 40% este mês";
    conflito = "90% dos empreendedores fazem prospecção errada porque não sabem qualificar leads de verdade";
    virada = "Passo 1: Mapeie a dor real. Passo 2: Apresente solução específica. Passo 3: Crie urgência genuína";
    cta = "Salva este post e aplica hoje mesmo na sua estratégia de vendas";
  } else if (mentorKey === 'tecnicoEstruturado') {
    gancho = "Analisei 847 campanhas e descobri o padrão que 95% ignora";
    conflito = "Você investe em anúncios, mas seu CAC está alto porque não otimiza a jornada de conversão";
    virada = "Implementando pixel de conversão + lookalike audience + landing page focada, reduzi CAC em 60%";
    cta = "Quer acesso ao meu checklist de otimização? Link na bio";
  } else if (mentorKey === 'humorViral') {
    gancho = "Gente, eu descobri por que minha sobrancelha estava mais torta que política brasileira";
    conflito = "Fui numa 'profissional' que cobrou R$ 80 e me deixou parecendo personagem de desenho animado";
    virada = "Quando encontrei uma micropigmentadora certificada, gastei R$ 300 mas economizei minha dignidade";
    cta = "Comenta AÍ quem já passou vergonha com procedimento barato";
  } else if (mentorKey === 'criativoInstitucional') {
    gancho = "Inovação não é sobre tecnologia. É sobre resolver problemas reais de forma elegante";
    conflito = "O mercado de estética está saturado de promessas vazias e resultados mediocres";
    virada = "Nossa abordagem combina ciência avançada com cuidado humanizado para resultados que honram sua essência";
    cta = "Agende sua consulta e descubra como a verdadeira transformação acontece";
  } else { // estrategicoRacional
    gancho = "ROI de 340% em procedimentos estéticos: os números que sua clínica precisa conhecer";
    conflito = "Clínicas faturam pouco porque tratam estética como gasto, não como investimento estratégico";
    virada = "Implementando protocolos baseados em evidências e fidelização inteligente, triplicamos o LTV dos pacientes";
    cta = "Baixe nossa análise completa de mercado no link da bio";
  }

  const enigma = getRandomEnigma();
  
  return `🎬 Gancho:\n${gancho}\n\n🎯 Conflito:\n${conflito}\n\n🔁 Virada:\n${virada}\n\n📣 CTA:\n${cta}\n\n🔮 Enigma do Mentor:\n"${enigma}"\n\n✨ Assinatura do Roteirista:\n"Feito com alma para vender com propósito."`;
};

export const generateDisneyScript = (originalScript: string, contentType?: string, generationData?: any): string => {
  // Parse the original script to extract components
  const lines = originalScript.split('\n');
  let gancho = "";
  let conflito = "";
  let virada = "";
  let cta = "";
  
  // Extract existing components for transformation
  lines.forEach(line => {
    if (line.includes('Gancho:')) {
      gancho = line.replace(/.*Gancho:\s*/, '');
    } else if (line.includes('Conflito:')) {
      conflito = line.replace(/.*Conflito:\s*/, '');
    } else if (line.includes('Virada:')) {
      virada = line.replace(/.*Virada:\s*/, '');
    } else if (line.includes('CTA:')) {
      cta = line.replace(/.*CTA:\s*/, '');
    }
  });

  // Criar contexto a partir dos dados de geração
  const objetivo = generationData?.objective || 'engajar';
  const tema = generationData?.theme || 'conteúdo criativo';
  const canal = generationData?.channel || 'redes sociais';
  const estilo = generationData?.style || 'criativo';
  const tom = 'encantador e emocional';
  const data_sazonal_ou_simbolismo = 'transformação pessoal';

  // Aplicar o prompt Walt Disney 1928 completo
  const disneyPromptContext = `
🎯 Objetivo: ${objetivo}
🧵 Tema: ${tema}  
📱 Canal: ${canal}
🎨 Estilo: ${estilo}
🗣️ Tom desejado: ${tom}
🌟 Emoção associada: ${data_sazonal_ou_simbolismo}

Script original analisado por Walt Disney em 1928:
${originalScript}
  `;

  // Aplicar transformação Disney com base no tipo de conteúdo
  let eraUmaVez = "";
  let ateQueUmDia = "";
  let entaoElaDescobriu = "";
  let eElesViveramFelizes = "";

  // Diferentes abordagens baseadas no tema e objetivo
  const disneyTransformations = [
    {
      eraUmaVez: "Era uma vez alguém que acreditava que já tinha encontrado tudo o que precisava na vida...",
      ateQueUmDia: "Até que um dia percebeu que estava vivendo apenas uma pequena parte do que realmente merecia experimentar.",
      entaoElaDescobriu: "Então ela descobriu algo que não apenas mudou sua realidade, mas despertou sonhos que nem sabia que tinha dentro de si.",
      eElesViveramFelizes: "E eles viveram felizes sabendo que a verdadeira magia acontece quando encontramos exatamente o que nossa alma estava procurando."
    },
    {
      eraUmaVez: "Era uma vez uma pessoa que se sentia exatamente como você se sente agora, em busca de algo especial...",
      ateQueUmDia: "Até que um dia, cansada de tentar soluções que prometiam muito mas entregavam pouco, quase desistiu de sonhar.",
      entaoElaDescobriu: "Então ela descobriu que a verdadeira transformação não vem de fora, mas de encontrar alguém que realmente entende sua jornada.",
      eElesViveramFelizes: "E eles viveram felizes descobrindo que alguns encontros mudam nossa vida para sempre, de formas que jamais imaginamos possível."
    },
    {
      eraUmaVez: "Era uma vez alguém que olhava no espelho e via apenas o que faltava, nunca o que já era belo...",
      ateQueUmDia: "Até que um dia entendeu que a verdadeira beleza não é sobre perfeição, mas sobre se sentir genuinamente bem consigo mesma.",
      entaoElaDescobriu: "Então ela descobriu que quando encontramos o cuidado certo, não mudamos quem somos - revelamos quem sempre fomos.",
      eElesViveramFelizes: "E eles viveram felizes sabendo que a autoestima não é sobre agradar outros, mas sobre se orgulhar do que vê no espelho."
    }
  ];

  // Selecionar transformação baseada no tema ou aleatoriamente
  let selectedTransformation;
  if (tema.toLowerCase().includes('beleza') || tema.toLowerCase().includes('estética')) {
    selectedTransformation = disneyTransformations[2];
  } else if (objetivo.toLowerCase().includes('vender') || objetivo.toLowerCase().includes('converter')) {
    selectedTransformation = disneyTransformations[1];
  } else {
    selectedTransformation = disneyTransformations[0];
  }

  // Aplicar limitações de palavras baseadas no tipo de conteúdo
  if (contentType === 'carousel') {
    selectedTransformation.eraUmaVez = "Era uma vez alguém que acreditava ter encontrado tudo...";
  } else if (contentType === 'video') {
    selectedTransformation.eraUmaVez = "Era uma vez alguém que se sentia exatamente como você agora...";
  }

  // Adicionar elementos únicos Disney
  const elementoUnico = getRandomDisneyElement();
  const licaoUniversal = getRandomUniversalLesson();

  return `🎬 Era uma vez...
${selectedTransformation.eraUmaVez}

🎯 Até que um dia...
${selectedTransformation.ateQueUmDia}

🔁 Então ela descobriu...
${selectedTransformation.entaoElaDescobriu}

📣 E eles viveram felizes...
${selectedTransformation.eElesViveramFelizes}

✨ Elemento Disney Único:
${elementoUnico}

🏰 Lição Universal:
${licaoUniversal}

🎠 Assinado com magia Disney 1928
"${getRandomDisneySignature()}"`;
};

const getRandomDisneyElement = (): string => {
  const elements = [
    "Como um castelo que se revela aos poucos, a verdadeira transformação acontece camada por camada.",
    "Assim como Mickey encontrou sua voz, você também pode encontrar sua essência mais autêntica.",
    "É como descobrir uma porta secreta no seu próprio castelo - sempre esteve lá, esperando ser aberta.",
    "Como uma estrela cadente que realiza desejos, alguns momentos mudam nossa história para sempre."
  ];
  return elements[Math.floor(Math.random() * elements.length)];
};

const getRandomUniversalLesson = (): string => {
  const lessons = [
    "Toda grande jornada começa com um único passo corajoso em direção ao que realmente desejamos.",
    "A magia mais poderosa é aquela que nos ajuda a enxergar nossa própria luz interior.",
    "Os sonhos mais belos são aqueles que nos transformam no processo de realizá-los.",
    "Às vezes, o que procuramos no mundo todo estava dentro de nós desde o início."
  ];
  return lessons[Math.floor(Math.random() * lessons.length)];
};

const getRandomDisneySignature = (): string => {
  const signatures = [
    "Onde há sonhos, há sempre um caminho para torná-los realidade.",
    "A verdadeira magia acontece quando acreditamos no impossível.",
    "Todo final feliz começa com a coragem de dar o primeiro passo.",
    "As histórias mais belas são aquelas que vivemos quando ousamos sonhar.",
    "Em cada coração existe um castelo esperando para ser descoberto."
  ];
  return signatures[Math.floor(Math.random() * signatures.length)];
};

export const getRandomEnigma = (): string => {
  const newEnigmas = [
    "Quem entende narrativa, sente a assinatura.",
    "Feito pra vender. Mas com alma.",
    "Isso aqui tem mais que copy. Tem vivência.",
    "Foi só uma virada... mas mudou tudo."
  ];
  return newEnigmas[Math.floor(Math.random() * newEnigmas.length)];
};
