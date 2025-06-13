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
    console.log('📝 [parseStories10xSlides] Não é JSON, usando texto direto');
  }
  
  // CORREÇÃO CRÍTICA: Pattern mais robusto para detectar stories numerados
  const storyPatterns = [
    /Story\s+(\d+):\s*([^\n]+)(?:\n([^\n]*(?:\n(?!Story\s+\d)[^\n]*)*)?)/gi,
    /(\d+)\.\s*([^\n]+)(?:\n([^\n]*(?:\n(?!^\d+\.)[^\n]*)*)?)/gmi,
  ];
  
  let matches: RegExpMatchArray[] = [];
  
  // Tentar diferentes padrões
  for (const pattern of storyPatterns) {
    matches = [...cleanRoteiro.matchAll(pattern)];
    if (matches.length >= 3) {
      console.log(`📋 Stories encontrados com padrão: ${matches.length}`);
      break;
    }
  }
  
  // CORREÇÃO CRÍTICA: Processar matches encontrados de forma mais granular
  if (matches.length >= 3) {
    for (const match of matches) {
      const numero = parseInt(match[1]);
      const titulo = sanitizeText(match[2] || '');
      const conteudo = sanitizeText(match[3] || match[2] || '');
      
      if (!titulo.trim() && !conteudo.trim()) continue;
      
      // NOVA LÓGICA: Preservar conteúdo completo se estiver bem formatado
      const contentoPrincipal = conteudo || titulo;
      const conteudoProcessado = processContentForStory(contentoPrincipal, numero);
      
      const tipo = getStoryType(numero, contentoPrincipal);
      const tempo = getStoryTime(numero);
      const dispositivo = detectEngagementDevice(contentoPrincipal);
      
      slides.push({
        number: numero,
        titulo: extractBetterTitle(titulo, contentoPrincipal, tipo, numero),
        conteudo: conteudoProcessado,
        tempo,
        tipo,
        dispositivo
      });
    }
  } else {
    // FALLBACK INTELIGENTE MELHORADO: Dividir por frases menores
    console.log('🔍 [parseStories10xSlides] Usando fallback inteligente por frases');
    
    // Dividir por frases (pontos finais seguidos de espaço/quebra)
    const frases = cleanRoteiro
      .split(/(?<=\.)\s+|\n\s*\n/)
      .map(f => f.trim())
      .filter(f => f.length > 5); // Filtrar frases muito curtas
    
    console.log(`📝 [parseStories10xSlides] ${frases.length} frases encontradas`);
    
    if (frases.length >= 4) {
      // Distribuir frases de forma mais equilibrada
      const storiesCount = Math.min(5, Math.max(4, frases.length));
      
      // NOVA LÓGICA: Distribuir frases de forma mais inteligente
      const frasesPerStory = distributeContentIntelligently(frases, storiesCount);
      
      for (let i = 0; i < storiesCount; i++) {
        const storyFrases = frasesPerStory[i];
        if (storyFrases && storyFrases.length > 0) {
          const numero = i + 1;
          const conteudoCompleto = storyFrases.join(' ');
          const tipo = getStoryType(numero, conteudoCompleto);
          const titulo = extractBetterTitle('', conteudoCompleto, tipo, numero);
          const conteudoProcessado = processContentForStory(conteudoCompleto, numero);
          const tempo = getStoryTime(numero);
          const dispositivo = detectEngagementDevice(conteudoCompleto);
          
          slides.push({
            number: numero,
            titulo,
            conteudo: conteudoProcessado,
            tempo,
            tipo,
            dispositivo
          });
        }
      }
    } else {
      // ÚLTIMO FALLBACK: Dividir texto corrido em partes mais curtas
      console.log('🚨 [parseStories10xSlides] Último fallback - divisão por caracteres otimizada');
      
      const textLength = cleanRoteiro.length;
      const storiesCount = 4;
      const idealCharsPerStory = Math.ceil(textLength / storiesCount);
      
      for (let i = 0; i < storiesCount; i++) {
        const startPos = i * idealCharsPerStory;
        const endPos = Math.min(startPos + idealCharsPerStory, textLength);
        let storyContent = cleanRoteiro.substring(startPos, endPos);
        
        // Tentar quebrar em uma frase completa
        if (i < storiesCount - 1) {
          const lastSentenceEnd = storyContent.lastIndexOf('.');
          if (lastSentenceEnd > idealCharsPerStory * 0.4) {
            storyContent = storyContent.substring(0, lastSentenceEnd + 1);
          }
        }
        
        if (storyContent.trim()) {
          const numero = i + 1;
          const tipo = getStoryType(numero, storyContent);
          const titulo = extractBetterTitle('', storyContent, tipo, numero);
          const conteudoProcessado = processContentForStory(storyContent, numero);
          const tempo = getStoryTime(numero);
          const dispositivo = detectEngagementDevice(storyContent);
          
          slides.push({
            number: numero,
            titulo,
            conteudo: conteudoProcessado,
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

// NOVA FUNÇÃO: Processar conteúdo para ser adequado para story de 10s - MELHORADA
const processContentForStory = (content: string, storyNumber: number): string => {
  if (!content) return '';
  
  // Limpar o conteúdo
  const cleanContent = content.trim();
  
  // Se o conteúdo já está em um tamanho bom (até 30 palavras), manter integral
  const words = cleanContent.split(/\s+/);
  if (words.length <= 30) {
    return cleanContent;
  }
  
  // Se muito longo, pegar frases completas até um limite razoável
  const sentences = cleanContent.split(/(?<=\.)\s+/);
  let result = '';
  let wordCount = 0;
  const maxWords = getMaxWordsForStoryType(storyNumber);
  
  for (const sentence of sentences) {
    const sentenceWords = sentence.split(/\s+/).length;
    if (wordCount + sentenceWords <= maxWords) {
      result += (result ? ' ' : '') + sentence;
      wordCount += sentenceWords;
    } else {
      // Se a primeira frase já excede o limite, cortar mas manter completa
      if (!result && sentence.length > 0) {
        // Tentar encontrar um ponto de corte natural (vírgula, ponto)
        const cutPoints = ['.', ',', ';'];
        let bestCut = sentence.substring(0, maxWords * 6); // ~6 chars por palavra
        
        for (const cutPoint of cutPoints) {
          const cutIndex = bestCut.lastIndexOf(cutPoint);
          if (cutIndex > bestCut.length * 0.6) {
            bestCut = sentence.substring(0, cutIndex + 1);
            break;
          }
        }
        
        result = bestCut.trim();
      }
      break;
    }
  }
  
  return result.trim() || cleanContent.substring(0, 100).trim() + '...';
};

// NOVA FUNÇÃO: Definir limite de palavras por tipo de story
const getMaxWordsForStoryType = (storyNumber: number): number => {
  switch (storyNumber) {
    case 1: return 20; // Gancho: 15-20 palavras
    case 2: return 20; // Problema: 15-20 palavras
    case 3: return 25; // Solução: 15-25 palavras (pode ser um pouco maior)
    case 4: return 15; // CTA: 10-15 palavras
    case 5: return 20; // Bônus: 15-20 palavras
    default: return 20;
  }
};

// NOVA FUNÇÃO: Extrair título melhor baseado no conteúdo e tipo
const extractBetterTitle = (originalTitle: string, content: string, tipo: string, numero: number): string => {
  if (originalTitle && originalTitle.length > 5 && originalTitle.length < 40) {
    return originalTitle;
  }
  
  // Tentar extrair título do início do conteúdo
  const firstSentence = content.split(/[.!?]/)[0].trim();
  
  if (firstSentence.length > 5 && firstSentence.length < 50) {
    // Personalizar baseado no tipo
    switch (tipo) {
      case 'gancho':
        return firstSentence.length < 30 ? firstSentence : `Gancho: ${firstSentence.substring(0, 25)}...`;
      case 'erro':
        return firstSentence.includes('problema') || firstSentence.includes('erro') 
          ? firstSentence 
          : `O Problema: ${firstSentence.substring(0, 20)}...`;
      case 'virada':
        return firstSentence.includes('solução') || firstSentence.includes('descobr') 
          ? firstSentence 
          : `A Solução: ${firstSentence.substring(0, 20)}...`;
      case 'cta':
        return firstSentence.includes('compartilha') || firstSentence.includes('manda') 
          ? firstSentence 
          : `Ação: ${firstSentence.substring(0, 25)}...`;
      case 'bonus':
        return `Bônus: ${firstSentence.substring(0, 25)}...`;
    }
  }
  
  // Fallback para título padrão
  return getStoryTitle(tipo, numero);
};

// NOVA FUNÇÃO: Distribuir conteúdo de forma mais inteligente
const distributeContentIntelligently = (frases: string[], storiesCount: number): string[][] => {
  const resultado: string[][] = [];
  
  // Inicializar arrays para cada story
  for (let i = 0; i < storiesCount; i++) {
    resultado.push([]);
  }
  
  // Distribuir frases de forma mais equilibrada
  const frasesPerStory = Math.ceil(frases.length / storiesCount);
  
  for (let i = 0; i < frases.length; i++) {
    const storyIndex = Math.min(Math.floor(i / frasesPerStory), storiesCount - 1);
    resultado[storyIndex].push(frases[i]);
  }
  
  return resultado;
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
