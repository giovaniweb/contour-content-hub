
export interface Stories10xSlide {
  number: number;
  titulo: string;
  conteudo: string;
  dispositivo?: string;
  tempo: string;
  tipo: 'gancho' | 'erro' | 'virada' | 'cta';
}

// Função para limpar JSON do conteúdo do texto
const cleanJsonFromText = (content: string): string => {
  // Remove blocos JSON que começam com { e terminam com }
  let cleaned = content.replace(/\{[\s\S]*?\}/g, '');
  
  // Remove linhas que contêm apenas aspas e vírgulas (restos de JSON)
  cleaned = cleaned.replace(/^["',\s]*$/gm, '');
  
  // Remove múltiplas quebras de linha
  cleaned = cleaned.replace(/\n\n+/g, '\n\n');
  
  // Remove espaços múltiplos
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  // Remove backticks de markdown
  cleaned = cleaned.replace(/```json|```/g, '');
  
  return cleaned.trim();
};

// Função para limpar o conteúdo do texto
const cleanContent = (content: string): string => {
  return cleanJsonFromText(content)
    .replace(/\n\n+/g, ' ') // Remove múltiplas quebras de linha
    .replace(/\n/g, ' ') // Remove quebras de linha simples
    .replace(/\s+/g, ' ') // Remove espaços múltiplos
    .trim(); // Remove espaços nas extremidades
};

export const parseStories10xSlides = (roteiro: string): Stories10xSlide[] => {
  console.log('🔍 [Stories10xParser] Iniciando parse do roteiro:', roteiro);
  
  // Primeiro, limpar JSON do roteiro completo
  const cleanedRoteiro = cleanJsonFromText(roteiro);
  console.log('🧹 [Stories10xParser] Roteiro limpo:', cleanedRoteiro);
  
  // Padrões para identificar stories
  const storyPatterns = [
    /Story\s*1[:\s-]+(.*?)(?=Story\s*2|$)/gis,
    /Story\s*2[:\s-]+(.*?)(?=Story\s*3|$)/gis,
    /Story\s*3[:\s-]+(.*?)(?=Story\s*4|$)/gis,
    /Story\s*4[:\s-]+(.*?)$/gis
  ];

  const slides: Stories10xSlide[] = [];
  const storyTypes: Array<'gancho' | 'erro' | 'virada' | 'cta'> = ['gancho', 'erro', 'virada', 'cta'];
  const storyTitles = [
    'Gancho Provocativo',
    'Erro Comum',
    'Virada + Dispositivo',
    'CTA + Antecipação'
  ];

  storyPatterns.forEach((pattern, index) => {
    const match = pattern.exec(cleanedRoteiro);
    if (match && match[1]) {
      const rawContent = match[1].trim();
      const cleanedContent = cleanContent(rawContent);
      
      // Detectar dispositivos no conteúdo
      const dispositivos = detectarDispositivos(cleanedContent);
      
      slides.push({
        number: index + 1,
        titulo: storyTitles[index],
        conteudo: cleanedContent,
        dispositivo: dispositivos.length > 0 ? dispositivos.join(', ') : undefined,
        tempo: '10s',
        tipo: storyTypes[index]
      });
      
      console.log(`✅ [Stories10xParser] Story ${index + 1} parseado:`, {
        titulo: storyTitles[index],
        conteudo: cleanedContent.substring(0, 50) + '...',
        dispositivos
      });
    }
  });

  // Fallback: se não encontrou stories estruturados, dividir por quebras de linha
  if (slides.length === 0) {
    console.warn('⚠️ [Stories10xParser] Padrão de Story não encontrado, usando fallback');
    return parseFallbackStories10x(cleanedRoteiro);
  }

  console.log(`✅ [Stories10xParser] Parse concluído: ${slides.length} stories encontrados`);
  return slides;
};

const detectarDispositivos = (content: string): string[] => {
  const dispositivos: string[] = [];
  const contentLower = content.toLowerCase();

  // Detectar diferentes tipos de dispositivos
  if (contentLower.includes('foguinho') || contentLower.includes('🔥')) {
    dispositivos.push('Emoji Foguinho 🔥');
  }
  
  if (contentLower.includes('enquete') || contentLower.includes('pergunta:')) {
    dispositivos.push('Enquete 📊');
  }
  
  if (contentLower.includes('manda') && (contentLower.includes('comentário') || contentLower.includes('dm'))) {
    dispositivos.push('Reciprocidade 🔄');
  }
  
  if (contentLower.includes('compartilha') || contentLower.includes('marca um amigo')) {
    dispositivos.push('Compartilhamento 📲');
  }
  
  if (contentLower.includes('qual') && contentLower.includes('?')) {
    dispositivos.push('Pergunta Direta ❓');
  }

  return dispositivos;
};

const parseFallbackStories10x = (roteiro: string): Stories10xSlide[] => {
  const cleanedRoteiro = cleanContent(roteiro);
  const lines = cleanedRoteiro.split(' ').filter(word => word.trim() !== '');
  const slides: Stories10xSlide[] = [];
  
  // Dividir em 4 partes aproximadamente iguais
  const wordsPerStory = Math.ceil(lines.length / 4);
  const storyTypes: Array<'gancho' | 'erro' | 'virada' | 'cta'> = ['gancho', 'erro', 'virada', 'cta'];
  const storyTitles = [
    'Gancho Provocativo',
    'Erro Comum', 
    'Virada + Dispositivo',
    'CTA + Antecipação'
  ];

  for (let i = 0; i < 4; i++) {
    const startIndex = i * wordsPerStory;
    const endIndex = Math.min(startIndex + wordsPerStory, lines.length);
    const storyWords = lines.slice(startIndex, endIndex);
    const content = storyWords.join(' ').trim();
    
    if (content) {
      const dispositivos = detectarDispositivos(content);
      
      slides.push({
        number: i + 1,
        titulo: storyTitles[i],
        conteudo: content,
        dispositivo: dispositivos.length > 0 ? dispositivos.join(', ') : undefined,
        tempo: '10s',
        tipo: storyTypes[i]
      });
    }
  }

  console.log('✅ [Stories10xParser] Fallback parse concluído:', slides.length, 'stories');
  return slides;
};

// Utilitário para validar se o roteiro segue a metodologia Stories 10x
export const validateStories10x = (slides: Stories10xSlide[]): {
  isValid: boolean;
  issues: string[];
  score: number;
} => {
  const issues: string[] = [];
  let score = 0;

  if (slides.length !== 4) {
    issues.push(`Devem ser exatamente 4 stories (encontrados: ${slides.length})`);
  } else {
    score += 25;
  }

  slides.forEach((slide, index) => {
    if (!slide.conteudo || slide.conteudo.trim() === '') {
      issues.push(`Story ${index + 1} está vazio`);
    } else if (slide.conteudo.length < 10) {
      issues.push(`Story ${index + 1} muito curto (menos de 10 caracteres)`);
    } else {
      score += 10;
    }
  });

  const story3 = slides.find(s => s.number === 3);
  if (story3 && !story3.dispositivo) {
    issues.push('Story 3 deve conter dispositivo de engajamento');
  } else if (story3?.dispositivo) {
    score += 20;
  }

  const story1 = slides.find(s => s.number === 1);
  if (story1 && !isProvocativeHook(story1.conteudo)) {
    issues.push('Story 1 deve ter gancho provocativo');
  } else if (story1) {
    score += 15;
  }

  const story4 = slides.find(s => s.number === 4);
  if (story4 && !hasCTA(story4.conteudo)) {
    issues.push('Story 4 deve conter call-to-action');
  } else if (story4) {
    score += 10;
  }

  return {
    isValid: issues.length === 0,
    issues,
    score: Math.min(score, 100)
  };
};

const isProvocativeHook = (content: string): boolean => {
  const provocativeWords = [
    'você', 'vocês', 'será que', 'imagine', 'já pensou',
    'por que', 'como', 'quando', 'onde', 'quem',
    'nunca', 'sempre', 'todo mundo', 'ninguém'
  ];
  
  const contentLower = content.toLowerCase();
  return provocativeWords.some(word => contentLower.includes(word)) ||
         content.includes('?') ||
         contentLower.includes('para');
};

const hasCTA = (content: string): boolean => {
  const ctaWords = [
    'compartilha', 'marca', 'manda', 'clica', 'acesse',
    'vem', 'vamos', 'bora', 'chama', 'liga',
    'agenda', 'agende', 'entre em contato'
  ];
  
  const contentLower = content.toLowerCase();
  return ctaWords.some(word => contentLower.includes(word));
};
