import { cadastrarMentor, type Mentor } from '@/services/mentoresService';

// Estrutura universal dos 10 elementos base
export interface ElementosUniversais {
  storytelling: number;
  copywriting: number;
  conhecimento_publico: number;
  analises_dados: number;
  gatilhos_mentais: number;
  logica_argumentativa: number;
  premissas_educativas: number;
  mapas_empatia: number;
  headlines: number;
  ferramentas_especificas: number;
}

const mentores = [
  {
    "nome": "Leandro Ladeira",
    "descricao": "Especialista em produtos digitais e vendas perpétuas. Criador do método 'Venda Todo Santo Dia'.",
    "estilo": "Direto e vendedor, com foco em escassez, autoridade e CTA forte.",
    "uso_ideal": "Campanhas de venda com urgência e apelo de conversão.",
    "tom": "direto",
    "exemplos": ["Últimas unidades!", "Você vai ficar de fora?", "Essa oferta acaba hoje."],
    "elementos_universais": {
      storytelling: 9,
      copywriting: 10,
      conhecimento_publico: 10,
      analises_dados: 9,
      gatilhos_mentais: 10,
      logica_argumentativa: 9,
      premissas_educativas: 8,
      mapas_empatia: 8,
      headlines: 10,
      ferramentas_especificas: 10
    },
    "especialidades": ["escassez", "urgência", "gatilhos de conversão", "funis de venda", "autoridade"]
  },
  {
    "nome": "Ícaro de Carvalho",
    "descricao": "Copywriter e fundador da plataforma O Novo Mercado. Mestre em storytelling e posicionamento.",
    "estilo": "Storytelling emocional com profundidade, posicionamento pessoal e provocação.",
    "uso_ideal": "Vídeos de branding, reflexão e construção de autoridade.",
    "tom": "emocional",
    "exemplos": ["De onde eu venho...", "Poucas pessoas têm coragem de falar isso.", "Não é sobre marketing, é sobre visão."],
    "elementos_universais": {
      storytelling: 10,
      copywriting: 9,
      conhecimento_publico: 8,
      analises_dados: 6,
      gatilhos_mentais: 7,
      logica_argumentativa: 8,
      premissas_educativas: 9,
      mapas_empatia: 10,
      headlines: 8,
      ferramentas_especificas: 7
    },
    "especialidades": ["narrativas pessoais", "posicionamento", "provocação", "autoridade", "reflexão"]
  },
  {
    "nome": "Paulo Cuenca",
    "descricao": "Especialista em storytelling criativo e marketing sensorial. Foco em estética e ritmo audiovisual.",
    "estilo": "Criativo, poético, visual e imersivo.",
    "uso_ideal": "Vídeos autorais, visuais, estéticos e emocionais.",
    "tom": "criativo",
    "exemplos": ["Transforme informação em arte.", "Deixe a imagem falar.", "Cada segundo tem que ter alma."],
    "elementos_universais": {
      storytelling: 9,
      copywriting: 8,
      conhecimento_publico: 7,
      analises_dados: 6,
      gatilhos_mentais: 6,
      logica_argumentativa: 7,
      premissas_educativas: 8,
      mapas_empatia: 9,
      headlines: 10,
      ferramentas_especificas: 9
    },
    "especialidades": ["estética visual", "ritmo audiovisual", "criatividade", "sensorial", "artístico"]
  },
  {
    "nome": "Pedro Sobral",
    "descricao": "Especialista em copy para tráfego pago, CPL e geração de leads. Foco em performance e estrutura lógica.",
    "estilo": "Técnico, direto, estruturado e com antecipação de oferta.",
    "uso_ideal": "Campanhas de tráfego, CPL, ads e páginas de vendas.",
    "tom": "direto",
    "exemplos": ["Essa é a primeira aula do seu funil.", "Você entendeu errado sobre leads.", "Isso muda tudo no seu ROI."],
    "elementos_universais": {
      storytelling: 6,
      copywriting: 9,
      conhecimento_publico: 9,
      analises_dados: 10,
      gatilhos_mentais: 8,
      logica_argumentativa: 10,
      premissas_educativas: 9,
      mapas_empatia: 7,
      headlines: 8,
      ferramentas_especificas: 10
    },
    "especialidades": ["tráfego pago", "CPL", "estrutura lógica", "performance", "ROI"]
  },
  {
    "nome": "Camila Porto",
    "descricao": "Educadora digital com foco em redes sociais e marketing simples. Fala com linguagem acessível e didática.",
    "estilo": "Explicativo, passo a passo, leve e direto.",
    "uso_ideal": "Tutoriais, passo a passo e vídeos para iniciantes.",
    "tom": "didatico",
    "exemplos": ["Aprenda isso em 3 passos simples.", "É mais fácil do que parece.", "Você vai entender de uma vez por todas."],
    "elementos_universais": {
      storytelling: 7,
      copywriting: 8,
      conhecimento_publico: 8,
      analises_dados: 7,
      gatilhos_mentais: 6,
      logica_argumentativa: 9,
      premissas_educativas: 10,
      mapas_empatia: 8,
      headlines: 7,
      ferramentas_especificas: 8
    },
    "especialidades": ["didática", "simplicidade", "passo a passo", "iniciantes", "clareza"]
  },
  {
    "nome": "Hyeser Souza",
    // NOVO: Metodologia COCA
    "descricao": "Especialista em viralização e roteiros dinâmicos para Instagram, agora focado no método COCA (Conexão, Objeção, Crescimento, Autoridade). Entregas rápidas e altamente engajadoras, utilizando estrutura estratégica de impacto em até 40 segundos.",
    // Novo estilo baseado no prompt enviado
    "estilo": "Assertivo, dinâmico, criativo e persuasivo, com linguagem acessível e aplicação do método COCA (Conexão, Objeção, Crescimento, Autoridade).",
    "uso_ideal": "Conteúdos para Instagram focados em aumentar conexão, quebrar objeções, crescer audiência ou reforçar autoridade.",
    "tom": "criativo",
    "exemplos": [
      "Gancho: Você sente que ninguém engaja nos seus posts? Dá só 3 segundos e eu te mostro o segredo!",
      "Desenvolvimento: Separe seu público por idade e foque no que realmente interessa para eles.",
      "CTA: Se fez sentido pra você, salva esse post ou manda pra um amigo seguir o perfil!"
    ],
    "elementos_universais": {
      storytelling: 8,
      copywriting: 9,
      conhecimento_publico: 10,
      analises_dados: 8,
      gatilhos_mentais: 10,
      logica_argumentativa: 9,
      premissas_educativas: 8,
      mapas_empatia: 10,
      headlines: 9,
      ferramentas_especificas: 9
    },
    "especialidades": [
      "roteiros COCA",
      "conexão e engajamento",
      "quebra de objeções",
      "crescimento orgânico",
      "autoridade para Instagram"
    ]
  },
  {
    "nome": "Washington Olivetto",
    "descricao": "Publicitário lendário. Criador de campanhas memoráveis. Mestre em frases impactantes e criatividade de marca.",
    "estilo": "Criativo, memorável, publicitário e com linguagem forte.",
    "uso_ideal": "Campanhas institucionais e conteúdos de branding.",
    "tom": "publicitario",
    "exemplos": ["O primeiro sutiã a gente nunca esquece.", "Isso tem que ter alma de marca.", "Não venda. Conquiste."],
    "elementos_universais": {
      storytelling: 9,
      copywriting: 10,
      conhecimento_publico: 8,
      analises_dados: 7,
      gatilhos_mentais: 8,
      logica_argumentativa: 8,
      premissas_educativas: 7,
      mapas_empatia: 9,
      headlines: 10,
      ferramentas_especificas: 8
    },
    "especialidades": ["big ideas", "branding memorável", "frases icônicas", "criatividade publicitária", "conquista"]
  },
  {
    "nome": "John Kotter",
    "descricao": "Professor de Harvard e referência mundial em liderança e gestão de mudanças. Criador do modelo de 8 passos.",
    "estilo": "Estruturado, estratégico, com foco em liderança e transformação organizacional.",
    "uso_ideal": "Projetos de mudança, cultura organizacional, motivação e transformação de equipes.",
    "tom": "institucional",
    "exemplos": [
      "Sem senso de urgência, toda transformação falha.",
      "Crie uma visão e comunique com clareza.",
      "Transformações só funcionam com pequenas vitórias contínuas."
    ],
    "elementos_universais": {
      storytelling: 8,
      copywriting: 8,
      conhecimento_publico: 9,
      analises_dados: 9,
      gatilhos_mentais: 7,
      logica_argumentativa: 10,
      premissas_educativas: 9,
      mapas_empatia: 8,
      headlines: 7,
      ferramentas_especificas: 8
    },
    "especialidades": ["liderança", "transformação", "estratégia", "mudança organizacional", "visão"]
  }
];

export const executarCadastroMentores = async () => {
  console.log('Iniciando cadastro de mentores...');
  
  for (let i = 0; i < mentores.length; i++) {
    const mentor = mentores[i];
    try {
      await cadastrarMentor({
        nome: mentor.nome,
        descricao: mentor.descricao,
        estilo: mentor.estilo,
        uso_ideal: mentor.uso_ideal,
        tom: mentor.tom,
        exemplos: mentor.exemplos
      });
      console.log(`✅ ${mentor.nome} - ok`);
    } catch (error) {
      console.error(`❌ Erro ao cadastrar ${mentor.nome}:`, error);
    }
  }
  
  console.log('Cadastro de mentores finalizado!');
};

// Função para obter elementos universais por mentor
export const getElementosUniversaisByMentor = (mentorNome: string): ElementosUniversais | null => {
  const mentor = mentores.find(m => m.nome === mentorNome);
  return mentor?.elementos_universais || null;
};

// Função para obter especialidades por mentor
export const getEspecialidadesByMentor = (mentorNome: string): string[] => {
  const mentor = mentores.find(m => m.nome === mentorNome);
  return mentor?.especialidades || [];
};

// Função para cadastrar um mentor específico por índice
export const cadastrarMentorPorIndice = async (indice: number) => {
  if (indice < 0 || indice >= mentores.length) {
    throw new Error('Índice inválido');
  }
  
  const mentor = mentores[indice];
  await cadastrarMentor({
    nome: mentor.nome,
    descricao: mentor.descricao,
    estilo: mentor.estilo,
    uso_ideal: mentor.uso_ideal,
    tom: mentor.tom,
    exemplos: mentor.exemplos
  });
  
  return `✅ ${mentor.nome} - ok`;
};

export { mentores };
