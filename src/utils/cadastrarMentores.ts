import { cadastrarMentor, type Mentor } from '@/services/mentoresService';

// Estrutura universal dos 2 mentores permitidos juridicamente
const mentores = [
  {
    "nome": "Mentor do Storytelling",
    "descricao": "Especialista em narrativas que conectam e vendem por meio de histórias reais e emocionais.",
    "estilo": "Emocional, direto e vendedor, uso intenso de storytelling, analogias e CTA forte.",
    "uso_ideal": "Posts em carrossel, copy para vendas, stories magnéticos.",
    "tom": "emocional",
    "exemplos": ["Você vai achar que eu tô mentindo, mas...", "Meu pai me obrigou a trabalhar com 14 anos...", "Começo forte muda tudo."],
    "elementos_universais": {
      storytelling: 10,
      copywriting: 9,
      conhecimento_publico: 8,
      analises_dados: 7,
      gatilhos_mentais: 10,
      logica_argumentativa: 7,
      premissas_educativas: 7,
      mapas_empatia: 9,
      headlines: 10,
      ferramentas_especificas: 8
    },
    "especialidades": ["storytelling", "copy up", "funis de venda", "analogias", "bordões"]
  },
  {
    "nome": "Mentor da Viralização",
    "descricao": "Especialista em roteiros virais, criação de ganchos e copy para formatos rápidos (Reels, TikTok etc).",
    "estilo": "Direto, dinâmico, persuasivo, usa estruturas rápidas e envolventes.",
    "uso_ideal": "Reels, TikTok, vídeos curtos, desafios, tendências virais.",
    "tom": "criativo",
    "exemplos": ["Você sente que ninguém engaja nos seus posts?", "Gancho: Você está perdendo conversão AGORA!", "Desafio: Marca um amigo que precisa ver isso!"],
    "elementos_universais": {
      storytelling: 8,
      copywriting: 10,
      conhecimento_publico: 10,
      analises_dados: 9,
      gatilhos_mentais: 10,
      logica_argumentativa: 8,
      premissas_educativas: 7,
      mapas_empatia: 10,
      headlines: 9,
      ferramentas_especificas: 10
    },
    "especialidades": ["viralização", "copy viral", "formato rápido", "trend", "engajamento"]
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
