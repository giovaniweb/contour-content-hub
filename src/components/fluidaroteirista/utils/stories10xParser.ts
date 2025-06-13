
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
  
  let cleanRoteiro = sanitizeScriptStructure(roteiro);
  const slides: Stories10xSlide[] = [];
  
  // CORREÇÃO CRÍTICA: Melhorar parsing de JSON aninhado
  try {
    const jsonContent = JSON.parse(cleanRoteiro);
    if (jsonContent.roteiro) {
      cleanRoteiro = jsonContent.roteiro;
      console.log('📋 [parseStories10xSlides] Conteúdo extraído do JSON:', cleanRoteiro.substring(0, 200));
    }
  } catch (error) {
    // Se não for JSON, continuar com o texto original
    console.log('📝 [parseStories10xSlides] Não é JSON, usando texto direto');
  }
  
  // CORREÇÃO: Pattern mais robusto para detectar stories numerados
  const storyPatterns = [
    /Story\s+(\d+):\s*([^\n]+)(?:\n([^\n]*(?:\n(?!Story\s+\d)[^\n]*)*)?)/gi,
    /(\d+)\.\s*([^\n]+)(?:\n([^\n]*(?:\n(?!^\d+\.)[^\n]*)*)?)/gmi,
  ];
  
  let matches: RegExpMatchArray[] = [];
  
  // Tentar diferentes padrões
  for (const pattern of storyPatterns) {
    matches = [...cleanRoteiro.matchAll(pattern)];
    if (matches.length >= 3) { // Mínimo 3 stories para considerar válido
      console.log(`📋 Stories encontrados com padrão: ${matches.length}`);
      break;
    }
  }
  
  // CORREÇÃO: Processar matches encontrados de forma mais robusta
  if (matches.length >= 3) {
    for (const match of matches) {
      const numero = parseInt(match[1]);
      const titulo = sanitizeText(match[2] || '');
      const conteudo = sanitizeText(match[3] || match[2] || '');
      
      if (!titulo.trim() && !conteudo.trim()) continue;
      
      const tipo = getStoryType(numero, titulo + ' ' + conteudo);
      const tempo = getStoryTime(numero);
      const dispositivo = detectEngagementDevice(titulo + ' ' + conteudo);
      
      slides.push({
        number: numero,
        titulo: titulo || getStoryTitle(tipo, numero),
        conteudo: conteudo || titulo,
        tempo,
        tipo,
        dispositivo
      });
    }
  } else {
    // FALLBACK INTELIGENTE: Dividir por parágrafos naturais
    console.log('🔍 [parseStories10xSlides] Usando fallback inteligente por parágrafos');
    
    // Dividir por quebras duplas de linha ou pontos finais seguidos de quebra
    const paragraphs = cleanRoteiro
      .split(/\n\s*\n|\.\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 10); // Filtrar parágrafos muito curtos
    
    if (paragraphs.length >= 3) {
      // Dividir em 4-5 stories baseado no conteúdo
      const storiesCount = Math.min(5, Math.max(4, paragraphs.length));
      const itemsPerStory = Math.ceil(paragraphs.length / storiesCount);
      
      for (let i = 0; i < storiesCount; i++) {
        const startIndex = i * itemsPerStory;
        const endIndex = Math.min(startIndex + itemsPerStory, paragraphs.length);
        const storyContent = paragraphs.slice(startIndex, endIndex).join('\n\n');
        
        if (storyContent.trim()) {
          const numero = i + 1;
          const tipo = getStoryType(numero, storyContent);
          const titulo = getStoryTitle(tipo, numero);
          const tempo = getStoryTime(numero);
          const dispositivo = detectEngagementDevice(storyContent);
          
          slides.push({
            number: numero,
            titulo,
            conteudo: sanitizeText(storyContent),
            tempo,
            tipo,
            dispositivo
          });
        }
      }
    } else {
      // ÚLTIMO FALLBACK: Dividir texto corrido em partes iguais
      console.log('🚨 [parseStories10xSlides] Último fallback - divisão por caracteres');
      
      const textLength = cleanRoteiro.length;
      const storiesCount = 4;
      const charsPerStory = Math.ceil(textLength / storiesCount);
      
      for (let i = 0; i < storiesCount; i++) {
        const startPos = i * charsPerStory;
        const endPos = Math.min(startPos + charsPerStory, textLength);
        let storyContent = cleanRoteiro.substring(startPos, endPos);
        
        // Tentar quebrar em uma frase completa
        if (i < storiesCount - 1) {
          const lastSentenceEnd = storyContent.lastIndexOf('.');
          if (lastSentenceEnd > charsPerStory * 0.5) {
            storyContent = storyContent.substring(0, lastSentenceEnd + 1);
          }
        }
        
        if (storyContent.trim()) {
          const numero = i + 1;
          const tipo = getStoryType(numero, storyContent);
          const titulo = getStoryTitle(tipo, numero);
          const tempo = getStoryTime(numero);
          const dispositivo = detectEngagementDevice(storyContent);
          
          slides.push({
            number: numero,
            titulo,
            conteudo: sanitizeText(storyContent),
            tempo,
            tipo,
            dispositivo
          });
        }
      }
    }
  }
  
  // Garantir pelo menos 4 stories
  while (slides.length < 4) {
    const numero = slides.length + 1;
    const tipo = getStoryType(numero, '');
    slides.push({
      number: numero,
      titulo: getStoryTitle(tipo, numero),
      conteudo: 'Conteúdo personalizado baseado no tema escolhido.',
      tempo: '10s',
      tipo,
      dispositivo: undefined
    });
  }
  
  // Ordenar por número e limitar a 5 stories
  slides.sort((a, b) => a.number - b.number);
  const finalSlides = slides.slice(0, 5);
  
  console.log(`✅ Stories processados: ${finalSlides.length}`);
  finalSlides.forEach(slide => {
    console.log(`📋 Story ${slide.number}: ${slide.titulo} (${slide.conteudo.substring(0, 50)}...)`);
  });
  
  return finalSlides;
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
