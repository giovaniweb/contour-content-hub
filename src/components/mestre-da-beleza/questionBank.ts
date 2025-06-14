
/**
 * Banco configurável de perguntas para o Mestre da Beleza.
 * Sistema sequencial com perguntas inteligentes para diagnóstico estético.
 */

export type Question = {
  id: string;
  text: string;
  options: string[];
  context: string;
  type?: 'profile' | 'intention' | 'diagnosis' | 'nostalgia' | 'technical';
  scoring?: { [option: string]: number };
  required?: boolean;
};

export const questionBank: Question[] = [
  // Perguntas de Perfil (obrigatórias)
  {
    id: 'perfil_usuario',
    text: 'Primeiro, me conte: quem é você no mundo da estética?',
    options: ['Sou médico(a)', 'Sou profissional de estética', 'Sou cliente interessado(a)'],
    context: 'perfil',
    type: 'profile',
    required: true,
    scoring: {
      'Sou médico(a)': 10,
      'Sou profissional de estética': 8,
      'Sou cliente interessado(a)': 5
    }
  },

  // Perguntas de Intenção
  {
    id: 'intencao_consulta',
    text: 'Qual é seu principal objetivo hoje?',
    options: ['Resolver um problema específico', 'Explorar opções disponíveis', 'Apenas curiosidade', 'Comparar equipamentos'],
    context: 'intencao',
    type: 'intention',
    scoring: {
      'Resolver um problema específico': 15,
      'Explorar opções disponíveis': 10,
      'Apenas curiosidade': 5,
      'Comparar equipamentos': 12
    }
  },

  // Diagnóstico - Área de Interesse
  {
    id: 'area_foco',
    text: 'Qual área do corpo é seu foco principal?',
    options: ['Rosto', 'Corpo', 'Ambos igualmente', 'Ainda não sei'],
    context: 'area_problema',
    type: 'diagnosis',
    scoring: {
      'Rosto': 10,
      'Corpo': 10,
      'Ambos igualmente': 8,
      'Ainda não sei': 3
    }
  },

  // Diagnóstico Específico - Flacidez Facial
  {
    id: 'flacidez_facial',
    text: 'Você percebe sinais de flacidez ou perda de firmeza no rosto?',
    options: ['Sim, é uma preocupação constante', 'Um pouco, mas ainda não me incomoda muito', 'Não, minha pele está firme', 'Não sei identificar'],
    context: 'flacidez_facial',
    type: 'diagnosis',
    scoring: {
      'Sim, é uma preocupação constante': 20,
      'Um pouco, mas ainda não me incomoda muito': 10,
      'Não, minha pele está firme': 0,
      'Não sei identificar': 5
    }
  },

  // Diagnóstico Específico - Flacidez Corporal
  {
    id: 'flacidez_corporal',
    text: 'E em relação ao corpo, percebe flacidez ou falta de tonicidade?',
    options: ['Sim, principalmente em braços e abdômen', 'Um pouco, mas não é grave', 'Não tenho esse problema', 'Prefiro não comentar'],
    context: 'flacidez_corporal',
    type: 'diagnosis',
    scoring: {
      'Sim, principalmente em braços e abdômen': 20,
      'Um pouco, mas não é grave': 10,
      'Não tenho esse problema': 0,
      'Prefiro não comentar': 2
    }
  },

  // Diagnóstico - Gordura Localizada
  {
    id: 'gordura_localizada',
    text: 'Tem áreas com acúmulo de gordura que gostaria de tratar?',
    options: ['Sim, me incomoda bastante', 'Sim, mas é algo leve', 'Não tenho esse problema', 'Estou em dúvida'],
    context: 'gordura_localizada',
    type: 'diagnosis',
    scoring: {
      'Sim, me incomoda bastante': 18,
      'Sim, mas é algo leve': 10,
      'Não tenho esse problema': 0,
      'Estou em dúvida': 5
    }
  },

  // Diagnóstico - Manchas e Melasma
  {
    id: 'manchas_melasma',
    text: 'Possui manchas, melasma ou irregularidades na pele do rosto?',
    options: ['Sim, é algo que me incomoda muito', 'Sim, mas são poucas', 'Não tenho manchas', 'Não sei identificar'],
    context: 'melasma_manchas',
    type: 'diagnosis',
    scoring: {
      'Sim, é algo que me incomoda muito': 18,
      'Sim, mas são poucas': 8,
      'Não tenho manchas': 0,
      'Não sei identificar': 3
    }
  },

  // Perguntas Nostálgicas para Estimativa de Idade
  {
    id: 'nostalgia_brasil_penta',
    text: 'Você lembra de ter vibrado com o Brasil Pentacampeão em 2002?',
    options: ['Sim, lembro perfeitamente!', 'Sim, mas era muito jovem', 'Não, era muito novo(a)', 'Não lembro'],
    context: 'brasil_penta',
    type: 'nostalgia',
    scoring: {
      'Sim, lembro perfeitamente!': 5,
      'Sim, mas era muito jovem': 3,
      'Não, era muito novo(a)': 1,
      'Não lembro': 0
    }
  },

  {
    id: 'nostalgia_orkut',
    text: 'Você chegou a usar o Orkut nos seus tempos áureos?',
    options: ['Sim, era viciado(a)!', 'Sim, mas pouco', 'Não, era muito jovem', 'Não conhecia'],
    context: 'orkut',
    type: 'nostalgia',
    scoring: {
      'Sim, era viciado(a)!': 5,
      'Sim, mas pouco': 3,
      'Não, era muito jovem': 1,
      'Não conhecia': 0
    }
  },

  // Perguntas Técnicas
  {
    id: 'experiencia_estetica',
    text: 'Qual sua experiência com tratamentos estéticos?',
    options: ['Sou iniciante, nunca fiz nada', 'Já fiz alguns tratamentos básicos', 'Tenho bastante experiência', 'Sou profissional da área'],
    context: 'experiencia',
    type: 'technical',
    scoring: {
      'Sou iniciante, nunca fiz nada': 5,
      'Já fiz alguns tratamentos básicos': 8,
      'Tenho bastante experiência': 12,
      'Sou profissional da área': 15
    }
  },

  {
    id: 'expectativa_resultados',
    text: 'Qual sua expectativa em relação aos resultados?',
    options: ['Quero resultados rápidos e visíveis', 'Prefiro resultados graduais e naturais', 'Não tenho pressa', 'Quero o melhor que existe'],
    context: 'expectativa',
    type: 'technical',
    scoring: {
      'Quero resultados rápidos e visíveis': 10,
      'Prefiro resultados graduais e naturais': 8,
      'Não tenho pressa': 5,
      'Quero o melhor que existe': 12
    }
  },

  // Pergunta Final
  {
    id: 'finalizar_diagnostico',
    text: 'Pronto! Com base nas suas respostas, posso fazer minha recomendação. Quer ver?',
    options: ['Sim, estou ansioso(a)!', 'Sim, mas quero detalhes', 'Prefiro ver opções', 'Vamos lá!'],
    context: 'finalizar',
    type: 'technical',
    scoring: {
      'Sim, estou ansioso(a)!': 5,
      'Sim, mas quero detalhes': 8,
      'Prefiro ver opções': 6,
      'Vamos lá!': 7
    }
  }
];

// Função helper para obter próxima pergunta baseada no contexto
export function getNextQuestionContext(currentContext: string, response: string): string | null {
  const questionMap: Record<string, string> = {
    'perfil': 'intencao',
    'intencao': 'area_problema',
    'area_problema': 'flacidez_facial',
    'flacidez_facial': 'flacidez_corporal',
    'flacidez_corporal': 'gordura_localizada',
    'gordura_localizada': 'melasma_manchas',
    'melasma_manchas': 'brasil_penta',
    'brasil_penta': 'orkut',
    'orkut': 'experiencia',
    'experiencia': 'expectativa',
    'expectativa': 'finalizar'
  };

  return questionMap[currentContext] || null;
}

// Função para verificar se deve pular para recomendação
export function shouldSkipToRecommendation(responses: Record<string, any>): boolean {
  // Se o usuário demonstrou problemas específicos claros, pode acelerar
  const hasSpecificProblems = 
    responses.flacidez_facial?.includes('preocupação constante') ||
    responses.flacidez_corporal?.includes('principalmente') ||
    responses.gordura_localizada?.includes('incomoda bastante') ||
    responses.melasma_manchas?.includes('incomoda muito');

  return hasSpecificProblems && Object.keys(responses).length >= 6;
}
