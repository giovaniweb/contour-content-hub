
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
  diretoEscassez: {
    estilo: "Direto com urgência e escassez",
    tom: "Assertivo, focado em resultados mensuráveis",
    exemplos: ["Os números não mentem", "Última oportunidade", "Enquanto outros hesitam, você age"]
  },
  storytellingEmocional: {
    estilo: "Narrativo e tocante",
    tom: "Empático, conectivo, com profundidade humana",
    exemplos: ["Essa história mudou minha perspectiva", "Você já passou por isso?", "O que senti naquele momento foi..."]
  },
  criativoPoetico: {
    estilo: "Criativo e inspiracional",
    tom: "Artístico, poético, com visão estética",
    exemplos: ["Beleza é uma forma de arte", "Cada detalhe conta uma história", "Transformação que vem de dentro"]
  },
  didaticoPassoAPasso: {
    estilo: "Educativo e estruturado",
    tom: "Claro, didático, focado no aprendizado",
    exemplos: ["Vou te mostrar exatamente como fazer", "Passo 1, 2, 3...", "Simples de entender, fácil de aplicar"]
  },
  tecnicoEstruturado: {
    estilo: "Técnico e baseado em dados",
    tom: "Analítico, metodológico, orientado por métricas",
    exemplos: ["Dados comprovam que", "Metodologia testada", "ROI mensurável em 30 dias"]
  },
  humorViral: {
    estilo: "Descontraído e viral",
    tom: "Divertido, espontâneo, popular",
    exemplos: ["Gente, vocês não vão acreditar", "Quem mais já passou por isso?", "Para de julgar, vai"]
  },
  criativoInstitucional: {
    estilo: "Sofisticado e profissional",
    tom: "Elegante, confiável, premium",
    exemplos: ["Excelência é nosso padrão", "Inovação com propósito", "Resultados que honram sua confiança"]
  },
  estrategicoRacional: {
    estilo: "Estratégico e racional",
    tom: "Inteligente, visionário, fundamentado",
    exemplos: ["Visão de longo prazo", "Estratégia baseada em evidências", "Decisões que impactam o futuro"]
  }
};

export const ENIGMAS = [
  "Quem entende narrativa, sente a assinatura.",
  "Feito pra vender. Mas com alma.",
  "Isso aqui tem mais que copy. Tem vivência.",
  "Foi só uma virada... mas mudou tudo."
];
