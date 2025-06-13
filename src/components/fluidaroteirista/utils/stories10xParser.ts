
import { sanitizeText, sanitizeScriptStructure, validateTextCleanliness } from './textSanitizer';

export interface Stories10xSlide {
  number: number;
  titulo: string;
  conteudo: string;
  tempo: string;
  tipo: 'gancho' | 'erro' | 'virada' | 'cta' | 'bonus';
  dispositivo?: string;
}

export interface Stories10xValidation {
  isValid: boolean;
  score: number;
  issues: string[];
}

export const parseStories10xSlides = (roteiro: string): Stories10xSlide[] => {
  console.log('🔥 [parseStories10xSlides] Processando Stories 10x:', roteiro.substring(0, 200));
  
  const cleanRoteiro = sanitizeScriptStructure(roteiro);
  const slides: Stories10xSlide[] = [];
  
  // Pattern para detectar stories numerados
  const storyPattern = /story\s*(\d+)\s*:?\s*([^\n]*(?:\n(?!story\s*\d)[^\n]*)*)/gi;
  const matches = [...cleanRoteiro.matchAll(storyPattern)];
  
  console.log(`📋 Stories encontrados: ${matches.length}`);
  
  for (const match of matches) {
    const numero = parseInt(match[1]);
    const conteudo = sanitizeText(match[2]);
    
    if (!conteudo.trim()) continue;
    
    // Detectar tipo baseado no número e conteúdo
    const tipo = getStoryType(numero, conteudo);
    const titulo = getStoryTitle(tipo, numero);
    const tempo = getStoryTime(numero);
    const dispositivo = detectEngagementDevice(conteudo);
    
    slides.push({
      number: numero,
      titulo,
      conteudo: sanitizeText(conteudo),
      tempo,
      tipo,
      dispositivo
    });
  }
  
  // Ordenar por número
  slides.sort((a, b) => a.number - b.number);
  
  console.log(`✅ Stories processados: ${slides.length}`);
  return slides;
};

const getStoryType = (numero: number, conteudo: string): 'gancho' | 'erro' | 'virada' | 'cta' | 'bonus' => {
  const content = conteudo.toLowerCase();
  
  switch (numero) {
    case 1:
      return 'gancho';
    case 2:
      return 'erro';
    case 3:
      return 'virada';
    case 4:
      return 'cta';
    case 5:
      return 'bonus';
    default:
      // Detectar por conteúdo
      if (content.includes('gancho') || content.includes('você')) return 'gancho';
      if (content.includes('erro') || content.includes('problema')) return 'erro';
      if (content.includes('solução') || content.includes('descobri')) return 'virada';
      if (content.includes('compartilha') || content.includes('manda')) return 'cta';
      return 'bonus';
  }
};

const getStoryTitle = (tipo: string, numero: number): string => {
  const titles = {
    gancho: `Story ${numero}: Gancho Provocativo`,
    erro: `Story ${numero}: Erro Comum`,
    virada: `Story ${numero}: Virada + Engajamento`,
    cta: `Story ${numero}: CTA Social`,
    bonus: `Story ${numero}: Bônus/Antecipação`
  };
  
  return titles[tipo as keyof typeof titles] || `Story ${numero}`;
};

const getStoryTime = (numero: number): string => {
  // Stories 10x: 10 segundos cada (máximo 50s total para 5 stories)
  return '10s';
};

const detectEngagementDevice = (conteudo: string): string | undefined => {
  const content = conteudo.toLowerCase();
  
  if (content.includes('🔥') || content.includes('foguinho')) {
    return 'Emoji Foguinho 🔥';
  }
  if (content.includes('enquete') || content.includes('[enquete')) {
    return 'Enquete Interativa';
  }
  if (content.includes('?') && (content.includes('você') || content.includes('qual'))) {
    return 'Pergunta Direta';
  }
  if (content.includes('compartilha') || content.includes('manda pra')) {
    return 'Compartilhamento Social';
  }
  if (content.includes('se') && content.includes('eu')) {
    return 'Reciprocidade';
  }
  
  return undefined;
};

export const validateStories10x = (slides: Stories10xSlide[]): Stories10xValidation => {
  const issues: string[] = [];
  let score = 0;
  
  // Verificar quantidade ideal (4-5 stories)
  if (slides.length < 4) {
    issues.push(`Poucos stories: ${slides.length}. Mínimo recomendado: 4`);
  } else if (slides.length > 5) {
    issues.push(`Muitos stories: ${slides.length}. Máximo recomendado: 5`);
  } else {
    score += 20; // Quantidade ideal
  }
  
  // Verificar se tem gancho
  const hasGancho = slides.some(s => s.tipo === 'gancho');
  if (hasGancho) {
    score += 20;
  } else {
    issues.push('Falta gancho provocativo no início');
  }
  
  // Verificar dispositivos de engajamento
  const devicesCount = slides.filter(s => s.dispositivo).length;
  if (devicesCount >= 2) {
    score += 25;
  } else if (devicesCount === 1) {
    score += 15;
    issues.push('Pelo menos 2 dispositivos de engajamento são recomendados');
  } else {
    issues.push('Faltam dispositivos de engajamento (emojis, enquetes, perguntas)');
  }
  
  // Verificar CTA social
  const hasCTA = slides.some(s => 
    s.tipo === 'cta' || 
    s.conteudo.toLowerCase().includes('compartilha') ||
    s.conteudo.toLowerCase().includes('manda')
  );
  if (hasCTA) {
    score += 20;
  } else {
    issues.push('Falta call-to-action social (compartilhar, mandar para alguém)');
  }
  
  // Verificar sequência narrativa
  const hasSequence = slides.length >= 3 && 
    slides.some(s => s.tipo === 'erro' || s.tipo === 'virada');
  if (hasSequence) {
    score += 15;
  } else {
    issues.push('Falta sequência narrativa (problema → solução)');
  }
  
  return {
    isValid: score >= 70,
    score,
    issues
  };
};
