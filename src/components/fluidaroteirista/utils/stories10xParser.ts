
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
  
  // CORREÇÃO: Padrões mais precisos para detectar exatamente 4 stories
  const storyPatterns = [
    /Story\s*1\s*[:\-]\s*(.*?)(?=Story\s*2|$)/gis,
    /Story\s*2\s*[:\-]\s*(.*?)(?=Story\s*3|$)/gis,
    /Story\s*3\s*[:\-]\s*(.*?)(?=Story\s*4|$)/gis,
    /Story\s*4\s*[:\-]\s*(.*?)$/gis
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
  storyPatterns.forEach((pattern, index) => {
    // Reset regex lastIndex para garantir busca correta
    pattern.lastIndex = 0;
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
        conteudo: cleanedContent.substring(0, 100) + '...',
        dispositivos
      });
    } else {
      console.warn(`⚠️ [Stories10xParser] Story ${index + 1} NÃO ENCONTRADO no padrão rigoroso`);
    }
  });

  // CRÍTICO: Se não encontrou exatamente 4, tentar métodos alternativos
  if (slides.length !== 4) {
    console.error(`❌ [Stories10xParser] PROBLEMA CRÍTICO: Encontrados ${slides.length} stories, esperados 4`);
    console.log('🔄 [Stories10xParser] Tentando divisão por seções...');
    
    // Limpar slides anteriores
    slides.length = 0;
    
    // MÉTODO ALTERNATIVO: Dividir por Story X:
    const storyMatches = roteiro.match(/Story\s*\d+\s*[:\-][^]*?(?=Story\s*\d+\s*[:\-]|$)/gi);
    
    if (storyMatches && storyMatches.length >= 4) {
      console.log(`🔍 [Stories10xParser] Encontradas ${storyMatches.length} seções de story`);
      
      for (let i = 0; i < Math.min(4, storyMatches.length); i++) {
        const storySection = storyMatches[i].trim();
        
        // Extrair conteúdo removendo o cabeçalho "Story X:"
        const contentMatch = storySection.match(/Story\s*\d+\s*[:\-]\s*(.*)/is);
        const rawContent = contentMatch ? contentMatch[1].trim() : storySection;
        const cleanedContent = cleanContent(rawContent);
        
        if (cleanedContent.length > 10) { // Garantir que tem conteúdo mínimo
          const dispositivos = detectarDispositivos(cleanedContent);
          
          slides.push({
            number: i + 1,
            titulo: storyTitles[i],
            conteudo: cleanedContent,
            dispositivo: dispositivos.length > 0 ? dispositivos.join(', ') : undefined,
            tempo: '10s',
            tipo: storyTypes[i]
          });
          
          console.log(`✅ [Stories10xParser] Story ${i + 1} extraído por seção:`, {
            titulo: storyTitles[i],
            conteudo: cleanedContent.substring(0, 100) + '...'
          });
        }
      }
    }
  }

  // ÚLTIMO RECURSO: Se ainda não tem 4, forçar criação
  if (slides.length !== 4) {
    console.error(`❌ [Stories10xParser] FORÇANDO CRIAÇÃO: ${slides.length} stories encontrados`);
    return forceCreate4Stories(roteiro);
  }

  console.log(`✅ [Stories10xParser] SUCESSO: Parse concluído com exatamente ${slides.length} stories`);
  return slides;
};

const forceCreate4Stories = (roteiro: string): Stories10xSlide[] => {
  console.log('🚨 [Stories10xParser] FORÇANDO CRIAÇÃO DE 4 STORIES...');
  
  const cleanedRoteiro = cleanContent(roteiro);
  const sentences = cleanedRoteiro.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const slides: Stories10xSlide[] = [];
  
  const sentencesPerStory = Math.ceil(sentences.length / 4);
  const storyTypes: Array<'gancho' | 'erro' | 'virada' | 'cta'> = ['gancho', 'erro', 'virada', 'cta'];
  const storyTitles = [
    'Gancho Provocativo',
    'Erro Comum', 
    'Virada + Dispositivo',
    'CTA + Antecipação'
  ];

  for (let i = 0; i < 4; i++) {
    const startIndex = i * sentencesPerStory;
    const endIndex = Math.min(startIndex + sentencesPerStory, sentences.length);
    const storySentences = sentences.slice(startIndex, endIndex);
    let content = storySentences.join('. ').trim();
    
    // Se conteúdo muito curto, usar fallback temático
    if (content.length < 30) {
      const fallbackContent = [
        'Você já se perguntou por que alguns resultados não aparecem como esperado? Vou te contar um segredo que pode mudar tudo...',
        'O erro que 90% das pessoas cometem: acham que basta fazer o procedimento uma vez e pronto. Mas a verdade é bem diferente.',
        'Aqui está a virada: nossos equipamentos garantem resultados duradouros e naturais. Manda um foguinho 🔥 se você quer saber mais!',
        'Quer transformar sua vida de verdade? Agende sua consulta agora! Compartilha com um amigo que precisa ver isso 📲'
      ];
      content = fallbackContent[i];
    }
    
    // Garantir que Story 3 tenha dispositivo
    if (i === 2 && !detectarDispositivos(content).length) {
      content += ' Manda um foguinho 🔥 nos comentários se você concorda!';
    }
    
    // Garantir que Story 4 tenha CTA
    if (i === 3 && !content.toLowerCase().includes('compartilha') && !content.toLowerCase().includes('marca') && !content.toLowerCase().includes('dm')) {
      content += ' Compartilha com um amigo que precisa ver isso! 📲';
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
    
    console.log(`🔧 [Stories10xParser] Story ${i + 1} criado forçadamente:`, {
      titulo: storyTitles[i],
      conteudo: content.substring(0, 80) + '...',
      dispositivos
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
    score += 40; // 40 pontos por ter exatamente 4 stories
  }

  // Validar conteúdo de cada story
  slides.forEach((slide, index) => {
    if (!slide.conteudo || slide.conteudo.trim() === '') {
      issues.push(`Story ${index + 1} está vazio`);
    } else if (slide.conteudo.length < 20) {
      issues.push(`Story ${index + 1} muito curto (${slide.conteudo.length} caracteres)`);
    } else {
      score += 10; // 10 pontos por story com conteúdo adequado
    }
  });

  // Validar dispositivos de engajamento
  const storiesWithDevices = slides.filter(s => s.dispositivo && s.dispositivo.length > 0);
  if (storiesWithDevices.length >= 2) {
    score += 20; // 20 pontos por ter pelo menos 2 dispositivos
  } else {
    issues.push(`Poucos dispositivos de engajamento (${storiesWithDevices.length}/2 recomendados)`);
  }

  // Validar gancho provocativo (Story 1)
  const story1 = slides.find(s => s.number === 1);
  if (story1 && isProvocativeHook(story1.conteudo)) {
    score += 15; // 15 pontos por gancho provocativo
  }

  // Validar CTA (Story 4)
  const story4 = slides.find(s => s.number === 4);
  if (story4 && hasCTA(story4.conteudo)) {
    score += 15; // 15 pontos por CTA adequado
  }

  return {
    isValid: slides.length === 4 && issues.filter(i => i.includes('CRÍTICO')).length === 0,
    issues,
    score: Math.min(score, 100)
  };
};

const isProvocativeHook = (content: string): boolean => {
  const provocativeWords = [
    'você', 'vocês', 'será que', 'imagine', 'já pensou',
    'por que', 'como', 'quando', 'onde', 'quem',
    'nunca', 'sempre', 'todo mundo', 'ninguém', 'segredo'
  ];
  
  const contentLower = content.toLowerCase();
  return provocativeWords.some(word => contentLower.includes(word)) ||
         content.includes('?') ||
         contentLower.includes('sabia');
};

const hasCTA = (content: string): boolean => {
  const ctaWords = [
    'compartilha', 'marca', 'manda', 'clica', 'acesse',
    'vem', 'vamos', 'bora', 'chama', 'liga',
    'agenda', 'agende', 'entre em contato', 'dm'
  ];
  
  const contentLower = content.toLowerCase();
  return ctaWords.some(word => contentLower.includes(word));
};
