
import { AkinatorStep, MentorProfile } from './types';

export const STEPS: AkinatorStep[] = [
  {
    id: 'contentType',
    question: '🎭 Que tipo de magia você quer criar hoje?',
    options: [
      { value: 'video', label: 'Vídeo' },
      { value: 'image', label: 'Imagem' },
      { value: 'carousel', label: 'Carrossel' },
      { value: 'bigIdea', label: 'Big Idea' }
    ]
  },
  {
    id: 'objective',
    question: '🎯 Qual é a sua verdadeira intenção?',
    options: [
      { value: 'vender', label: 'Vender' },
      { value: 'leads', label: 'Capturar Leads' },
      { value: 'engajar', label: 'Engajar' },
      { value: 'ensinar', label: 'Ensinar' },
      { value: 'posicionar', label: 'Posicionar' }
    ]
  },
  {
    id: 'style',
    question: '🎨 Que energia você quer transmitir?',
    options: [
      { value: 'emocional', label: 'Emocional/Tocante' },
      { value: 'direto', label: 'Direto/Objetivo' },
      { value: 'criativo', label: 'Criativo/Artístico' },
      { value: 'provocativo', label: 'Provocativo/Ousado' },
      { value: 'didático', label: 'Didático/Claro' },
      { value: 'humoristico', label: 'Divertido/Viral' }
    ]
  },
  {
    id: 'theme',
    question: '💭 Sobre o que vamos falar?',
    options: [
      { value: 'tendencia', label: 'Tendência do Momento' },
      { value: 'dor', label: 'Dor/Problema' },
      { value: 'transformacao', label: 'Transformação' },
      { value: 'curiosidade', label: 'Curiosidade/Segredo' },
      { value: 'autoridade', label: 'Autoridade/Expertise' },
      { value: 'livre', label: 'Tema Livre' }
    ]
  },
  {
    id: 'channel',
    question: '📱 Onde essa obra vai brilhar?',
    options: [
      { value: 'instagram', label: 'Instagram' },
      { value: 'tiktok', label: 'TikTok' },
      { value: 'youtube', label: 'YouTube Shorts' },
      { value: 'linkedin', label: 'LinkedIn' },
      { value: 'pinterest', label: 'Pinterest' },
      { value: 'facebook', label: 'Facebook' }
    ]
  }
];

export const MENTORS: Record<string, MentorProfile> = {
  viral: {
    estilo: "Divertido e envolvente",
    tom: "Descontraído, com humor inteligente",
    exemplos: ["Gente, isso aqui vai viralizar", "Prepara que vem textão", "Alguém mais passou por isso?"]
  },
  vendedor: {
    estilo: "Direto e persuasivo",
    tom: "Confiante, focado em resultados",
    exemplos: ["Vou direto ao ponto", "Isso aqui vai mudar sua vida", "Última chance de garantir"]
  },
  emocional: {
    estilo: "Conectivo e tocante",
    tom: "Empático, com profundidade emocional",
    exemplos: ["Você já se sentiu assim?", "Essa história me tocou profundamente", "Não estamos sozinhos nisso"]
  },
  criativo: {
    estilo: "Inovador e artístico",
    tom: "Inspirador, com visão única",
    exemplos: ["Vou mostrar uma perspectiva diferente", "Arte é transformação", "Beleza está nos detalhes"]
  },
  educador: {
    estilo: "Didático e claro",
    tom: "Acessível, focado no aprendizado",
    exemplos: ["Vou te ensinar passo a passo", "Conhecimento é poder", "Simplificando para você"]
  },
  visionario: {
    estilo: "Inspirador e estratégico",
    tom: "Assertivo, com visão de futuro",
    exemplos: ["O futuro já chegou", "Liderança é sobre visão", "Inovação começa com coragem"]
  },
  estrategista: {
    estilo: "Analítico e estruturado",
    tom: "Metodológico, baseado em dados",
    exemplos: ["Os números não mentem", "Estratégia é tudo", "Planejamento é chave do sucesso"]
  }
};

export const ENIGMAS = [
  "Foi feito pra vender. Mas com alma.",
  "Esse roteiro? Você não lê, você sente.",
  "Quem entende de narrativa vai sacar quem passou por aqui.",
  "Foi só uma virada... mas mudou tudo."
];
