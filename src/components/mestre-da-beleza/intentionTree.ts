/**
 * Intention Tree Akinator Style – Versão Ramificada (descoberta)
 */

export type IntentionNode = {
  id: string;
  text: string;
  options: string[];
  type: 'inicio' | 'area' | 'sintoma' | 'profundidade' | 'final' | 'perfil';
  next?: Record<string, string> | string;
  emoji?: string;
  destaque?: boolean;
};

export const INTENTION_TREE: IntentionNode[] = [
  // INÍCIO: Detecção de perfil
  {
    id: 'init',
    type: 'inicio',
    text: 'Com qual das situações abaixo você mais se identifica?',
    emoji: '🔍',
    options: [
      'Quero tratar algo na minha pele ou corpo',
      'Atendo clientes na área da estética',
      'Só curioso(a), não estou buscando nada',
    ],
    next: {
      'Quero tratar algo na minha pele ou corpo': 'area_desejo',
      'Atendo clientes na área da estética': 'perfil_profissional',
      'Só curioso(a), não estou buscando nada': 'final_curioso',
    }
  },

  // Novo: caminhos curtos, diagnóstico já no 2º passo
  // - Cliente
  {
    id: 'area_desejo',
    type: 'area',
    text: 'Qual dessas áreas é seu maior desejo de melhorar?',
    emoji: '🪞',
    options: ['Rosto', 'Corpo', 'Não tenho preferência'],
    next: {
      'Rosto': 'final_rosto',
      'Corpo': 'final_corpo',
      'Não tenho preferência': 'final_prevencao'
    }
  },
  {
    id: 'final_rosto',
    type: 'final',
    destaque: true,
    text: '💜 Diagnóstico inicial: Sinais de interesse em procedimentos faciais! Considere cuidar da pele com ativos e tecnologias avançadas.',
    options: []
  },
  {
    id: 'final_corpo',
    type: 'final',
    destaque: true,
    text: '💚 Diagnóstico inicial: Busca por resultados corporais! Consulte um especialista para potenciais protocolos de flacidez ou gordura localizada.',
    options: []
  },

  // PROFISSIONAL (já finaliza no 2º passo)
  {
    id: 'perfil_profissional',
    type: 'perfil',
    text: 'Você já atua na estética ou está começando?',
    emoji: '👩‍⚕️',
    options: ['Já atuo', 'Começando agora', 'Quero transição de carreira'],
    next: {
      'Já atuo': 'final_prof_rosto',
      'Começando agora': 'final_novato',
      'Quero transição de carreira': 'final_transicao'
    }
  },
  {
    id: 'final_prof_rosto',
    type: 'final',
    destaque: true,
    text: '💙 Perfil profissional: Especialista em procedimentos faciais! Continue investindo em protocolos e inovação para surpreender seus clientes.',
    options: []
  },
  {
    id: 'final_novato',
    type: 'final',
    destaque: true,
    text: '🚀 Novato(a) na estética! A base sólida traz segurança: invista em formação e conexão com clientes.',
    options: []
  },
  {
    id: 'final_transicao',
    type: 'final',
    destaque: true,
    text: '🔄 Pronto(a) para transição! Reforce conhecimentos e busque mentoria para acelerar a nova fase.',
    options: []
  },
  // Curioso
  {
    id: 'final_curioso',
    type: 'final',
    destaque: true,
    text: '🙃 Curiosidade é ótima! Quando quiser personalizar, volte aqui 😉',
    options: []
  },
  // Prevenção
  {
    id: 'final_prevencao',
    type: 'final',
    destaque: true,
    text: '🛡️ Diagnóstico: Parabéns pelo foco em prevenção! Proteção solar e hábitos saudáveis são o segredo.',
    options: []
  }
];
