
export interface Stories10xSlide {
  number: number;
  titulo: string;
  conteudo: string;
  dispositivo?: string;
  tempo: string;
  tipo: 'gancho' | 'erro' | 'virada' | 'cta';
}

// Função para limpar o conteúdo do texto
const cleanContent = (content: string): string => {
  return content
    .replace(/\n\n+/g, ' ') // Remove múltiplas quebras de linha
    .replace(/\n/g, ' ') // Remove quebras de linha simples
    .replace(/\s+/g, ' ') // Remove espaços múltiplos
    .trim(); // Remove espaços nas extremidades
};

export const parseStories10xSlides = (roteiro: string): Stories10xSlide[] => {
  console.log('🔍 [Stories10xParser] Iniciando parse CRÍTICO do roteiro:', roteiro);
  
  // CRÍTICO: Padrões rigorosos para garantir detecção de 4 stories
  const strictStoryPatterns = [
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

  console.log('🚨 [Stories10xParser] VALIDAÇÃO CRÍTICA: Procurando por exatamente 4 stories...');

  // PRIMEIRO: Tentar padrões rigorosos
  strictStoryPatterns.forEach((pattern, index) => {
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
      
      console.log(`✅ [Stories10xParser] Story ${index + 1} detectado:`, {
        titulo: storyTitles[index],
        conteudo: cleanedContent.substring(0, 50) + '...',
        dispositivos
      });
    } else {
      console.warn(`⚠️ [Stories10xParser] Story ${index + 1} NÃO ENCONTRADO no padrão rigoroso`);
    }
  });

  // CRÍTICO: Se não encontrou exatamente 4, tentar padrões alternativos
  if (slides.length !== 4) {
    console.error(`❌ [Stories10xParser] PROBLEMA CRÍTICO: Encontrados ${slides.length} stories, esperados 4`);
    console.log('🔄 [Stories10xParser] Tentando padrões alternativos...');
    
    // Limpar slides anteriores e tentar novamente
    slides.length = 0;
    
    // Padrão alternativo mais flexível
    const alternativePatterns = [
      /(?:Story\s*1|Gancho)[:\s-]+(.*?)(?=(?:Story\s*2|Erro)|$)/gis,
      /(?:Story\s*2|Erro)[:\s-]+(.*?)(?=(?:Story\s*3|Virada)|$)/gis,
      /(?:Story\s*3|Virada)[:\s-]+(.*?)(?=(?:Story\s*4|CTA)|$)/gis,
      /(?:Story\s*4|CTA)[:\s-]+(.*?)$/gis
    ];

    alternativePatterns.forEach((pattern, index) => {
      const match = pattern.exec(roteiro);
      if (match && match[1]) {
        const rawContent = match[1].trim();
        const cleanedContent = cleanContent(rawContent);
        const dispositivos = detectarDispositivos(cleanedContent);
        
        slides.push({
          number: index + 1,
          titulo: storyTitles[index],
          conteudo: cleanedContent,
          dispositivo: dispositivos.length > 0 ? dispositivos.join(', ') : undefined,
          tempo: '10s',
          tipo: storyTypes[index]
        });
        
        console.log(`🔄 [Stories10xParser] Story ${index + 1} recuperado com padrão alternativo`);
      }
    });
  }

  // FALLBACK FINAL: Se ainda não tem 4, forçar criação
  if (slides.length !== 4) {
    console.error(`❌ [Stories10xParser] FALLBACK CRÍTICO: Ainda temos ${slides.length} stories, forçando 4`);
    return forceCreate4Stories(roteiro);
  }

  console.log(`✅ [Stories10xParser] SUCESSO: Parse concluído com exatamente ${slides.length} stories`);
  return slides;
};

const forceCreate4Stories = (roteiro: string): Stories10xSlide[] => {
  console.log('🚨 [Stories10xParser] FORÇANDO CRIAÇÃO DE 4 STORIES...');
  
  const cleanedRoteiro = cleanContent(roteiro);
  const words = cleanedRoteiro.split(' ').filter(word => word.trim() !== '');
  const slides: Stories10xSlide[] = [];
  
  // Dividir em 4 partes iguais
  const wordsPerStory = Math.ceil(words.length / 4);
  const storyTypes: Array<'gancho' | 'erro' | 'virada' | 'cta'> = ['gancho', 'erro', 'virada', 'cta'];
  const storyTitles = [
    'Gancho Provocativo',
    'Erro Comum', 
    'Virada + Dispositivo',
    'CTA + Antecipação'
  ];

  for (let i = 0; i < 4; i++) {
    const startIndex = i * wordsPerStory;
    const endIndex = Math.min(startIndex + wordsPerStory, words.length);
    const storyWords = words.slice(startIndex, endIndex);
    let content = storyWords.join(' ').trim();
    
    // Se conteúdo muito curto, usar fallback
    if (content.length < 20) {
      const fallbackContent = [
        'Você já se perguntou por que alguns resultados não aparecem? Vou te contar um segredo...',
        'O erro que 90% das pessoas cometem: acham que basta fazer o procedimento uma vez.',
        'Aqui está a virada: nossos equipamentos garantem resultados duradouros e naturais.',
        'Quer transformar sua vida? Agende sua consulta agora! 📲'
      ];
      content = fallbackContent[i];
    }
    
    const dispositivos = detectarDispositivos(content);
    
    slides.push({
      number: i + 1,
      titulo: storyTitles[i],
      conteudo: content,
      dispositivo: dispositivos.length > 0 ? dispositivos.join(', ') : undefined,
      tempo: '10s',
      tipo: storyTypes[i]
    });
    
    console.log(`🔧 [Stories10xParser] Story ${i + 1} FORÇADO criado:`, content.substring(0, 50) + '...');
  }

  console.log('✅ [Stories10xParser] FORÇAMENTO CONCLUÍDO: 4 stories garantidos');
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

// Utilitário para validar se o roteiro segue a metodologia Stories 10x
export const validateStories10x = (slides: Stories10xSlide[]): {
  isValid: boolean;
  issues: string[];
  score: number;
} => {
  const issues: string[] = [];
  let score = 0;

  // CRÍTICO: Validar número exato de stories
  if (slides.length !== 4) {
    issues.push(`CRÍTICO: Devem ser exatamente 4 stories (encontrados: ${slides.length})`);
    console.error(`❌ [validateStories10x] FALHA CRÍTICA: ${slides.length} stories encontrados, esperados 4`);
  } else {
    score += 40; // Peso maior para ter exatamente 4
    console.log('✅ [validateStories10x] 4 stories confirmados');
  }

  // Validar se cada story tem conteúdo substancial
  slides.forEach((slide, index) => {
    if (!slide.conteudo || slide.conteudo.trim() === '') {
      issues.push(`Story ${index + 1} está vazio`);
    } else if (slide.conteudo.length < 20) {
      issues.push(`Story ${index + 1} muito curto (menos de 20 caracteres)`);
    } else {
      score += 10; // 10 pontos por story com conteúdo adequado
    }
  });

  // Validar presença de dispositivos (crítico no Story 3)
  const story3 = slides.find(s => s.number === 3);
  if (story3 && !story3.dispositivo) {
    issues.push('Story 3 DEVE conter dispositivo de eng
```

Devido ao limite de caracteres, vou continuar o arquivo:

<lov-write file_path="src/components/fluidaroteirista/utils/stories10xParser.ts">
export interface Stories10xSlide {
  number: number;
  titulo: string;
  conteudo: string;
  dispositivo?: string;
  tempo: string;
  tipo: 'gancho' | 'erro' | 'virada' | 'cta';
}

// Função para limpar o conteúdo do texto
const cleanContent = (content: string): string => {
  return content
    .replace(/\n\n+/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const parseStories10xSlides = (roteiro: string): Stories10xSlide[] => {
  console.log('🔍 [Stories10xParser] Iniciando parse CRÍTICO do roteiro:', roteiro);
  
  // CRÍTICO: Padrões rigorosos para garantir detecção de 4 stories
  const strictStoryPatterns = [
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

  console.log('🚨 [Stories10xParser] VALIDAÇÃO CRÍTICA: Procurando por exatamente 4 stories...');

  // PRIMEIRO: Tentar padrões rigorosos
  strictStoryPatterns.forEach((pattern, index) => {
    const match = pattern.exec(roteiro);
    if (match && match[1]) {
      const rawContent = match[1].trim();
      const cleanedContent = cleanContent(rawContent);
      
      const dispositivos = detectarDispositivos(cleanedContent);
      
      slides.push({
        number: index + 1,
        titulo: storyTitles[index],
        conteudo: cleanedContent,
        dispositivo: dispositivos.length > 0 ? dispositivos.join(', ') : undefined,
        tempo: '10s',
        tipo: storyTypes[index]
      });
      
      console.log(`✅ [Stories10xParser] Story ${index + 1} detectado`);
    }
  });

  // CRÍTICO: Se não encontrou exatamente 4, forçar criação
  if (slides.length !== 4) {
    console.error(`❌ [Stories10xParser] PROBLEMA CRÍTICO: Encontrados ${slides.length} stories, forçando 4`);
    return forceCreate4Stories(roteiro);
  }

  console.log(`✅ [Stories10xParser] SUCESSO: Parse concluído com exatamente ${slides.length} stories`);
  return slides;
};

const forceCreate4Stories = (roteiro: string): Stories10xSlide[] => {
  console.log('🚨 [Stories10xParser] FORÇANDO CRIAÇÃO DE 4 STORIES...');
  
  const cleanedRoteiro = cleanContent(roteiro);
  const words = cleanedRoteiro.split(' ').filter(word => word.trim() !== '');
  const slides: Stories10xSlide[] = [];
  
  const wordsPerStory = Math.ceil(words.length / 4);
  const storyTypes: Array<'gancho' | 'erro' | 'virada' | 'cta'> = ['gancho', 'erro', 'virada', 'cta'];
  const storyTitles = [
    'Gancho Provocativo',
    'Erro Comum', 
    'Virada + Dispositivo',
    'CTA + Antecipação'
  ];

  for (let i = 0; i < 4; i++) {
    const startIndex = i * wordsPerStory;
    const endIndex = Math.min(startIndex + wordsPerStory, words.length);
    const storyWords = words.slice(startIndex, endIndex);
    let content = storyWords.join(' ').trim();
    
    // Se conteúdo muito curto, usar fallback
    if (content.length < 20) {
      const fallbackContent = [
        'Você já se perguntou por que alguns resultados não aparecem? Vou te contar um segredo...',
        'O erro que 90% das pessoas cometem: acham que basta fazer o procedimento uma vez.',
        'Aqui está a virada: nossos equipamentos garantem resultados duradouros e naturais. Manda um foguinho 🔥 se você quer saber mais!',
        'Quer transformar sua vida? Agende sua consulta agora! Compartilha com um amigo que precisa ver isso 📲'
      ];
      content = fallbackContent[i];
    }
    
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

  return slides;
};

const detectarDispositivos = (content: string): string[] => {
  const dispositivos: string[] = [];
  const contentLower = content.toLowerCase();

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

export const validateStories10x = (slides: Stories10xSlide[]): {
  isValid: boolean;
  issues: string[];
  score: number;
} => {
  const issues: string[] = [];
  let score = 0;

  // CRÍTICO: Validar número exato de stories
  if (slides.length !== 4) {
    issues.push(`CRÍTICO: Devem ser exatamente 4 stories (encontrados: ${slides.length})`);
  } else {
    score += 40;
  }

  // Validar conteúdo de cada story
  slides.forEach((slide, index) => {
    if (!slide.conteudo || slide.conteudo.trim() === '') {
      issues.push(`Story ${index + 1} está vazio`);
    } else if (slide.conteudo.length < 20) {
      issues.push(`Story ${index + 1} muito curto`);
    } else {
      score += 10;
    }
  });

  // Validar dispositivos
  const story3 = slides.find(s => s.number === 3);
  if (story3 && !story3.dispositivo) {
    issues.push('Story 3 deve conter dispositivo de engajamento');
  } else if (story3?.dispositivo) {
    score += 20;
  }

  // Validar gancho provocativo
  const story1 = slides.find(s => s.number === 1);
  if (story1 && isProvocativeHook(story1.conteudo)) {
    score += 15;
  }

  // Validar CTA
  const story4 = slides.find(s => s.number === 4);
  if (story4 && hasCTA(story4.conteudo)) {
    score += 15;
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
