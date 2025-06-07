
import { cadastrarMentor, type Mentor } from '@/services/mentoresService';

const mentores = [
  {
    "nome": "Leandro Ladeira",
    "descricao": "Especialista em produtos digitais e vendas perpétuas. Criador do método 'Venda Todo Santo Dia'.",
    "estilo": "Direto e vendedor, com foco em escassez, autoridade e CTA forte.",
    "uso_ideal": "Campanhas de venda com urgência e apelo de conversão.",
    "tom": "direto",
    "exemplos": ["Últimas unidades!", "Você vai ficar de fora?", "Essa oferta acaba hoje."]
  },
  {
    "nome": "Ícaro de Carvalho",
    "descricao": "Copywriter e fundador da plataforma O Novo Mercado. Mestre em storytelling e posicionamento.",
    "estilo": "Storytelling emocional com profundidade, posicionamento pessoal e provocação.",
    "uso_ideal": "Vídeos de branding, reflexão e construção de autoridade.",
    "tom": "emocional",
    "exemplos": ["De onde eu venho...", "Poucas pessoas têm coragem de falar isso.", "Não é sobre marketing, é sobre visão."]
  },
  {
    "nome": "Paulo Cuenca",
    "descricao": "Especialista em storytelling criativo e marketing sensorial. Foco em estética e ritmo audiovisual.",
    "estilo": "Criativo, poético, visual e imersivo.",
    "uso_ideal": "Vídeos autorais, visuais, estéticos e emocionais.",
    "tom": "criativo",
    "exemplos": ["Transforme informação em arte.", "Deixe a imagem falar.", "Cada segundo tem que ter alma."]
  },
  {
    "nome": "Pedro Sobral",
    "descricao": "Especialista em copy para tráfego pago, CPL e geração de leads. Foco em performance e estrutura lógica.",
    "estilo": "Técnico, direto, estruturado e com antecipação de oferta.",
    "uso_ideal": "Campanhas de tráfego, CPL, ads e páginas de vendas.",
    "tom": "direto",
    "exemplos": ["Essa é a primeira aula do seu funil.", "Você entendeu errado sobre leads.", "Isso muda tudo no seu ROI."]
  },
  {
    "nome": "Camila Porto",
    "descricao": "Educadora digital com foco em redes sociais e marketing simples. Fala com linguagem acessível e didática.",
    "estilo": "Explicativo, passo a passo, leve e direto.",
    "uso_ideal": "Tutoriais, passo a passo e vídeos para iniciantes.",
    "tom": "didatico",
    "exemplos": ["Aprenda isso em 3 passos simples.", "É mais fácil do que parece.", "Você vai entender de uma vez por todas."]
  },
  {
    "nome": "Hyeser Souza",
    "descricao": "Influencer com foco em humor popular, virais de rua e linguagem de gíria. Mestre do gancho popular.",
    "estilo": "Engraçado, espontâneo, com linguagem de rua e ganchos virais.",
    "uso_ideal": "Reels virais, trends populares, engajamento orgânico.",
    "tom": "humor",
    "exemplos": ["Cê não tá preparado pra isso!", "Parece mentira, mas é real!", "Mostrei e ele ficou CHOCADO!"]
  },
  {
    "nome": "Washington Olivetto",
    "descricao": "Publicitário lendário. Criador de campanhas memoráveis. Mestre em frases impactantes e criatividade de marca.",
    "estilo": "Criativo, memorável, publicitário e com linguagem forte.",
    "uso_ideal": "Campanhas institucionais e conteúdos de branding.",
    "tom": "publicitario",
    "exemplos": ["O primeiro sutiã a gente nunca esquece.", "Isso tem que ter alma de marca.", "Não venda. Conquiste."]
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
    ]
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
