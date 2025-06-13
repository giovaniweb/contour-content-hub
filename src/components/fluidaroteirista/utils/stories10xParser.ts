
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
  
  // CORREÇÃO CRÍTICA: Tentar parsear como JSON primeiro
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
  
  // Pattern melhorado para detectar stories numerados
  const storyPatterns = [
    /story\s*(\d+)\s*:?\s*([^\n]*(?:\n(?!story\s*\d)[^\n]*)*)/gi,
    /(\d+)\s*[-.:]\s*([^\n]*(?:\n(?!^\d+\s*[-.])[^\n]*)*)/gmi,
    /slide\s*(\d+)\s*:?\s*([^\n]*(?:\n(?!slide\s*\d)[^\n]*)*)/gi
  ];
  
  let matches: RegExpMatchArray[] = [];
  
  // Tentar diferentes padrões
  for (const pattern of storyPatterns) {
    matches = [...cleanRoteiro.matchAll(pattern)];
    if (matches.length > 0) {
      console.log(`📋 Stories encontrados com padrão: ${matches.length}`);
      break;
    }
  }
  
  // Se não encontrou padrões, tentar dividir por quebras de linha e números
  if (matches.length === 0) {
    console.log('🔍 [parseStories10xSlides] Tentando fallback por linhas');
    const lines = cleanRoteiro.split('\n').filter(line => line.trim());
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Procurar por linhas que começam com número
      const numberMatch = line.match(/^(\d+)[.\-:\s]/);
      if (numberMatch) {
        const numero = parseInt(numberMatch[1]);
        let conteudo = line.replace(/^\d+[.\-:\s]*/, '').trim();
        
        // Pegar próximas linhas até encontrar outro número ou fim
        let j = i + 1;
        while (j < lines.length && !lines[j].match(/^\d+[.\-:\s]/)) {
          conteudo += '\n' + lines[j].trim();
          j++;
        }
        
        if (conteudo.trim()) {
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
        
        i = j - 1; // Pular linhas já processadas
      }
    }
  } else {
    // Processar matches encontrados
    for (const match of matches) {
      const numero = parseInt(match[1]);
      const conteudo = sanitizeText(match[2]);
      
      if (!conteudo.trim()) continue;
      
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
  }
  
  // FALLBACK FINAL: Se ainda não encontrou nada, criar slides baseado no conteúdo completo
  if (slides.length === 0 && cleanRoteiro.trim()) {
    console.log('🚨 [parseStories10xSlides] Usando fallback - criando slides do conteúdo completo');
    
    // Dividir o conteúdo em partes menores (aproximadamente por parágrafos)
    const paragraphs = cleanRoteiro.split(/\n\s*\n/).filter(p => p.trim());
    
    if (paragraphs.length > 0) {
      paragraphs.slice(0, 5).forEach((paragraph, index) => {
        const numero = index + 1;
        const tipo = getStoryType(numero, paragraph);
        const titulo = getStoryTitle(tipo, numero);
        const tempo = getStoryTime(numero);
        const dispositivo = detectEngagementDevice(paragraph);
        
        slides.push({
          number: numero,
          titulo,
          conteudo: sanitizeText(paragraph),
          tempo,
          tipo,
          dispositivo
        });
      });
    } else {
      // Último fallback: criar um slide único
      slides.push({
        number: 1,
        titulo: 'Story 1: Gancho Provocativo',
        conteudo: sanitizeText(cleanRoteiro),
        tempo: '10s',
        tipo: 'gancho',
        dispositivo: detectEngagementDevice(cleanRoteiro)
      });
    }
  }
  
  // Ordenar por número
  slides.sort((a, b) => a.number - b.number);
  
  console.log(`✅ Stories processados: ${slides.length}`);
  slides.forEach(slide => {
    console.log(`📋 Story ${slide.number}: ${slide.titulo} (${slide.conteudo.substring(0, 50)}...)`);
  });
  
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
