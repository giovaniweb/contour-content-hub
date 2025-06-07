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

export const generateDisneyScript = (originalScript: string, contentType?: string): string => {
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

  // Apply Disney magic transformation based on Walt Disney's 1928 perspective
  const disneyTransformations = [
    {
      // Emotional connection and dreams
      gancho: "Era uma vez uma pessoa que acreditava que já tinha encontrado tudo o que precisava...",
      conflito: "Até descobrir que estava vivendo apenas uma fração do que realmente merecia experimentar.",
      virada: "Foi quando ela encontrou algo que não apenas mudou sua realidade, mas despertou sonhos que nem sabia que tinha.",
      cta: "E agora é sua vez de descobrir essa magia. Toque no link e comece sua própria transformação!"
    },
    {
      // Journey and discovery
      gancho: "Imagine se eu te dissesse que existe um segredo escondido que pode mudar tudo...",
      conflito: "A maioria das pessoas passa a vida inteira procurando por algo especial, mas olhando nos lugares errados.",
      virada: "Quando você encontra a chave certa, não é apenas uma mudança - é uma verdadeira metamorfose mágica.",
      cta: "Sua aventura começa com um simples toque. Descubra o que te espera!"
    },
    {
      // Hope and transformation
      gancho: "Havia uma vez alguém que se sentia exatamente como você se sente agora...",
      conflito: "Cansada de tentar soluções que prometiam muito mas entregavam pouco, quase desistiu de sonhar.",
      virada: "Mas então descobriu que a verdadeira magia acontece quando encontramos exatamente o que nossa alma estava procurando.",
      cta: "Seu momento mágico está a um clique de distância. Permita-se sonhar novamente!"
    }
  ];

  // Select a random Disney transformation
  const selectedTransformation = disneyTransformations[Math.floor(Math.random() * disneyTransformations.length)];
  
  // Apply word limits for specific content types
  let finalGancho = selectedTransformation.gancho;
  if (contentType === 'carousel') {
    // Limit to 13 words for Card 1
    finalGancho = "Era uma vez alguém que acreditava ter encontrado tudo...";
  } else if (contentType === 'video') {
    // Limit to 14 words for Take 1  
    finalGancho = "Imagine se existisse um segredo que pode mudar tudo na sua vida...";
  }

  return `🎬 Gancho:\n${finalGancho}\n\n🎯 Conflito:\n${selectedTransformation.conflito}\n\n🔁 Virada:\n${selectedTransformation.virada}\n\n📣 CTA:\n${selectedTransformation.cta}\n\n✨ Transformado pela Magia Disney:\n"Uma história que faz as pessoas sonharem e acreditarem na transformação."`;
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
