
import { sanitizeText, sanitizeScriptStructure, validateTextCleanliness } from './textSanitizer';

export const parseAndLimitCarousel = (roteiro: string): string => {
  console.log('🎠 [parseAndLimitCarousel] Processando roteiro do carrossel...');
  
  // Limpar roteiro com função universal
  const cleanRoteiro = sanitizeScriptStructure(roteiro);
  
  // Validar limpeza
  const validation = validateTextCleanliness(cleanRoteiro);
  if (!validation.isClean) {
    console.warn('⚠️ Texto ainda tem problemas:', validation.issues);
  }
  
  // Padrão mais flexível para slides
  const slidePattern = /(?:slide\s*\d*:?\s*|slide\s+)([^\n]*(?:\n(?!slide)[^\n]*)*)/gi;
  const matches = [...cleanRoteiro.matchAll(slidePattern)];
  
  if (matches.length === 0) {
    console.log('⚠️ Nenhum slide encontrado, criando estrutura padrão');
    return createDefaultCarousel();
  }
  
  const processedSlides: string[] = [];
  
  // Processar cada slide encontrado
  for (let i = 0; i < Math.min(matches.length, 5); i++) {
    const match = matches[i];
    const slideContent = sanitizeText(match[1] || match[0]);
    const lines = slideContent.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) continue;
    
    // Primeira linha como título
    const slideTitle = sanitizeText(lines[0]);
    let texto = '';
    let imagem = '';
    
    // Processar linhas seguintes
    for (let j = 1; j < lines.length; j++) {
      const line = sanitizeText(lines[j]);
      
      if (line.toLowerCase().includes('texto:')) {
        texto = sanitizeText(line.replace(/texto:\s*/i, ''));
      } else if (line.toLowerCase().includes('imagem:')) {
        imagem = sanitizeText(line.replace(/imagem:\s*/i, ''));
      } else if (!texto && line.trim()) {
        // Se não encontrou estrutura específica, usar como texto
        texto = line;
      }
    }
    
    // Fallbacks se campos estão vazios
    if (!texto) {
      texto = slideContent.substring(0, 120) || 'Conteúdo do slide';
    }
    if (!imagem) {
      imagem = 'Ambiente clínico moderno e acolhedor, profissional sorridente';
    }
    
    processedSlides.push(`Slide: ${slideTitle}\nTexto: ${texto}\nImagem: ${imagem}`);
  }
  
  // Garantir que temos pelo menos 3 e no máximo 5 slides
  while (processedSlides.length < 3) {
    const slideNum = processedSlides.length + 1;
    const defaultTitles = ['Introdução', 'O Problema', 'Nossa Solução', 'Benefícios', 'Call to Action'];
    const title = defaultTitles[slideNum - 1] || `Slide ${slideNum}`;
    
    processedSlides.push(`Slide: ${title}\nTexto: Conteúdo adicional sobre o tema\nImagem: Ambiente clínico especializado, equipamentos modernos`);
  }
  
  console.log(`✅ [parseAndLimitCarousel] Carrossel processado com ${processedSlides.length} slides`);
  return processedSlides.join('\n\n');
};

const createDefaultCarousel = (): string => {
  const defaultSlides = [
    `Slide: Introdução\nTexto: Descubra a revolução na estética moderna\nImagem: Ambiente clínico luxuoso, paciente confiante conversando com profissional`,
    `Slide: O Desafio\nTexto: Sinais do tempo que incomodam e afetam sua autoestima\nImagem: Pessoa observando reflexo no espelho, luz natural suave`,
    `Slide: Nossa Solução\nTexto: Tecnologia avançada para resultados surpreendentes\nImagem: Equipamento moderno, profissional especializado operando`,
    `Slide: Benefícios\nTexto: Resultados naturais e duradouros que você merece\nImagem: Paciente radiante após tratamento, sorriso genuíno`,
    `Slide: Call to Action\nTexto: Agende sua consulta e transforme sua vida hoje!\nImagem: Recepcionista atendendo, ambiente profissional e convidativo`
  ];
  
  return defaultSlides.join('\n\n');
};

export const parseCarouselSlides = (roteiro: string) => {
  console.log('🎠 [parseCarouselSlides] Analisando roteiro:', roteiro.substring(0, 200));
  
  // Limpar roteiro primeiro
  const cleanRoteiro = sanitizeScriptStructure(roteiro);
  
  // Parser mais robusto para estrutura: Slide:, Texto:, Imagem:
  const slidePattern = /slide\s*:?\s*([^\n]*(?:\n(?!slide)[^\n]*)*)/gi;
  const matches = [...cleanRoteiro.matchAll(slidePattern)];
  const slides = [];
  
  for (const match of matches) {
    const slideContent = sanitizeText(match[1]);
    const lines = slideContent.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) continue;
    
    const slideTitle = sanitizeText(lines[0]);
    
    // Extrair texto e imagem
    let texto = '';
    let imagem = '';
    
    for (const line of lines) {
      const cleanLine = sanitizeText(line);
      if (cleanLine.toLowerCase().includes('texto:')) {
        texto = sanitizeText(cleanLine.replace(/texto:\s*/i, ''));
      } else if (cleanLine.toLowerCase().includes('imagem:')) {
        imagem = sanitizeText(cleanLine.replace(/imagem:\s*/i, ''));
      }
    }
    
    // Fallback se não encontrou estrutura específica
    if (!texto) {
      texto = lines.slice(1).join(' ').trim() || 'Texto do slide';
    }
    if (!imagem) {
      imagem = 'Ambiente clínico moderno, profissional especializado';
    }
    
    slides.push({
      number: slides.length + 1,
      title: slideTitle,
      texto: sanitizeText(texto),
      imagem: sanitizeText(imagem),
      content: slideContent
    });
  }
  
  console.log(`🎯 Total de slides processados: ${slides.length}`);
  return slides;
};

export const validateCarouselSlides = (roteiro: string): { isValid: boolean; slideCount: number; errors: string[] } => {
  const cleanRoteiro = sanitizeScriptStructure(roteiro);
  const slides = cleanRoteiro.match(/slide\s*:?\s*[^\n]*/gi) || [];
  const errors: string[] = [];
  const slideCount = slides.length;
  
  if (slideCount > 5) {
    errors.push(`Muitos slides detectados: ${slideCount}. Máximo permitido: 5`);
  }
  
  if (slideCount < 3) {
    errors.push(`Poucos slides detectados: ${slideCount}. Mínimo recomendado: 3`);
  }
  
  return {
    isValid: slideCount >= 3 && slideCount <= 5 && errors.length === 0,
    slideCount,
    errors
  };
};
