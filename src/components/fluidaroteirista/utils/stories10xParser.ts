
export interface Stories10xSlide {
  number: number;
  titulo: string;
  conteudo: string;
  dispositivo?: string;
  tempo: string;
  tipo: 'gancho' | 'erro' | 'virada' | 'cta';
}

// Função para limpar o conteúdo do texto COM LIMPEZA MUITO SUAVE
const cleanContent = (content: string): string => {
  // Limpeza mínima - apenas normalizar espaços sem remover conteúdo
  const cleaned = content
    .replace(/[ \t]+/g, ' ') // Remove apenas espaços e tabs múltiplos
    .replace(/\n{4,}/g, '\n\n\n') // Limita quebras excessivas mas permite mais respiração
    .trim();
  
  console.log('🧹 [cleanContent] Limpeza aplicada:', {
    original: content.length,
    cleaned: cleaned.length,
    removedChars: content.length - cleaned.length
  });
  
  return cleaned;
};

export const parseStories10xSlides = (roteiro: string): Stories10xSlide[] => {
  console.log('🔍 [Stories10xParser] Iniciando parse do roteiro:', roteiro.substring(0, 200) + '...');
  
  // Primeiro, tentar dividir por separadores "---" com detecção melhorada
  const separatorSections = roteiro.split(/\n?\s*---+\s*\n?/).filter(section => section.trim().length > 0);
  
  console.log(`🔍 [Stories10xParser] Seções encontradas por separador:`, separatorSections.length);
  separatorSections.forEach((section, index) => {
    console.log(`📄 [Stories10xParser] Seção ${index + 1}:`, section.substring(0, 100) + '...');
  });
  
  if (separatorSections.length >= 4) {
    console.log('✅ [Stories10xParser] Encontrados separadores "---", usando divisão por seções');
    return parseStoriesBySeparator(separatorSections);
  }
  
  // Padrões para identificar stories (mais restritivos para evitar captura excessiva)
  const storyPatterns = [
    /Story\s*1[:\s-]+(.*?)(?=Story\s*2|---|\n\n.*Story|$)/gis,
    /Story\s*2[:\s-]+(.*?)(?=Story\s*3|---|\n\n.*Story|$)/gis,
    /Story\s*3[:\s-]+(.*?)(?=Story\s*4|---|\n\n.*Story|$)/gis,
    /Story\s*4[:\s-]+(.*?)(?=Story\s*5|---|\n\n.*Story|$)/gis
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
    const match = pattern.exec(roteiro);
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
    return parseFallbackStories10x(roteiro);
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

// Nova função para processar stories divididos por separador "---"
const parseStoriesBySeparator = (sections: string[]): Stories10xSlide[] => {
  const slides: Stories10xSlide[] = [];
  const storyTypes: Array<'gancho' | 'erro' | 'virada' | 'cta'> = ['gancho', 'erro', 'virada', 'cta'];
  const storyTitles = [
    'Gancho Provocativo',
    'Erro Comum',
    'Virada + Dispositivo',
    'CTA + Antecipação'
  ];

  // Processar todos os stories disponíveis (não limitar a 4 se houver mais conteúdo)
  const storySections = sections.slice(0, Math.max(4, sections.length));
  
  storySections.forEach((section, index) => {
    // Tentar extrair título real da seção
    const extractTitle = (content: string, fallbackTitle: string): string => {
      const lines = content.trim().split('\n');
      const firstLine = lines[0]?.trim();
      
      // Padrões para títulos
      if (firstLine?.match(/^\[.*\]$/)) return firstLine.replace(/[\[\]]/g, '');
      if (firstLine?.match(/^Story \d+:/i)) return firstLine.replace(/^Story \d+:\s*/i, '');
      if (firstLine?.match(/^\d+[\.\)]\s/)) return firstLine.replace(/^\d+[\.\)]\s*/, '');
      if (firstLine?.length && firstLine.length < 50 && !firstLine.includes('.')) return firstLine;
      
      return fallbackTitle;
    };
    
    const originalContent = section.trim();
    const cleanedContent = cleanContent(originalContent);
    
    // USAR CONTEÚDO ORIGINAL COMO FALLBACK se a limpeza falhar
    const finalContent = cleanedContent || originalContent;
    
    console.log(`🔍 [Stories10xParser] Processando seção ${index + 1}:`);
    console.log(`📝 [Stories10xParser] Original (${originalContent.length} chars):`, originalContent.substring(0, 150) + '...');
    console.log(`🧹 [Stories10xParser] Limpo (${cleanedContent.length} chars):`, cleanedContent.substring(0, 150) + '...');
    console.log(`✅ [Stories10xParser] Final (${finalContent.length} chars):`, finalContent.substring(0, 150) + '...');
    
    // PROCESSAR TODAS AS SEÇÕES (não apenas as primeiras 4)
    if (finalContent && index < Math.max(4, storySections.length)) {
      const dispositivos = detectarDispositivos(finalContent);
      const extractedTitle = extractTitle(finalContent, storyTitles[index] || `Story ${index + 1}`);
      
      slides.push({
        number: index + 1,
        titulo: extractedTitle,
        conteudo: finalContent,
        dispositivo: dispositivos.length > 0 ? dispositivos.join(', ') : undefined,
        tempo: '10s',
        tipo: storyTypes[index] || 'cta'
      });
      
      console.log(`✅ [Stories10xParser] Story ${index + 1} criado:`, {
        titulo: extractedTitle,
        conteudoLength: finalContent.length,
        conteudoPreview: finalContent.substring(0, 100) + '...',
        dispositivos
      });
    } else if (!finalContent) {
      console.error(`❌ [Stories10xParser] ERRO: Seção ${index + 1} completamente vazia:`, {
        originalLength: originalContent.length,
        cleanedLength: cleanedContent.length
      });
    }
  });

  return slides;
};

const parseFallbackStories10x = (roteiro: string): Stories10xSlide[] => {
  const lines = roteiro.split('\n').filter(line => line.trim() !== '');
  const slides: Stories10xSlide[] = [];
  
  // Dividir em 4 partes aproximadamente iguais
  const linesPerStory = Math.ceil(lines.length / 4);
  const storyTypes: Array<'gancho' | 'erro' | 'virada' | 'cta'> = ['gancho', 'erro', 'virada', 'cta'];
  const storyTitles = [
    'Gancho Provocativo',
    'Erro Comum', 
    'Virada + Dispositivo',
    'CTA + Antecipação'
  ];

  for (let i = 0; i < 4; i++) {
    const startIndex = i * linesPerStory;
    const endIndex = Math.min(startIndex + linesPerStory, lines.length);
    const storyLines = lines.slice(startIndex, endIndex);
    const content = storyLines.join(' ').trim();
    
    if (content) {
      const cleanedContent = cleanContent(content);
      const dispositivos = detectarDispositivos(cleanedContent);
      
      slides.push({
        number: i + 1,
        titulo: storyTitles[i],
        conteudo: cleanedContent,
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

  // Validar número de stories
  if (slides.length !== 4) {
    issues.push(`Devem ser exatamente 4 stories (encontrados: ${slides.length})`);
  } else {
    score += 25;
  }

  // Validar se cada story tem conteúdo
  slides.forEach((slide, index) => {
    if (!slide.conteudo || slide.conteudo.trim() === '') {
      issues.push(`Story ${index + 1} está vazio`);
    } else if (slide.conteudo.length < 10) {
      issues.push(`Story ${index + 1} muito curto (menos de 10 caracteres)`);
    } else {
      score += 10;
    }
  });

  // Validar presença de dispositivos (pelo menos no Story 3)
  const story3 = slides.find(s => s.number === 3);
  if (story3 && !story3.dispositivo) {
    issues.push('Story 3 deve conter dispositivo de engajamento');
  } else if (story3?.dispositivo) {
    score += 20;
  }

  // Validar características específicas
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
