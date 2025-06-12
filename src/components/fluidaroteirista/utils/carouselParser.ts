
export const parseAndLimitCarousel = (roteiro: string): string => {
  console.log('🎠 [parseAndLimitCarousel] Processando roteiro do carrossel...');
  
  // Separar por linhas e identificar slides
  const lines = roteiro.split('\n').filter(line => line.trim());
  const slideLines: string[] = [];
  
  // Procurar por padrões de slide
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Identificar slides por números ou palavras-chave
    if (
      trimmedLine.match(/^(Slide|Card|Parte)\s*\d+/i) ||
      trimmedLine.match(/^\d+\.\s/) ||
      trimmedLine.match(/^\d+\s*-\s/) ||
      trimmedLine.match(/^[•·\-]\s/)
    ) {
      slideLines.push(trimmedLine);
    }
  }
  
  // Se não encontrou slides estruturados, dividir por parágrafos
  if (slideLines.length === 0) {
    const paragraphs = roteiro.split(/\n\s*\n/).filter(p => p.trim());
    slideLines.push(...paragraphs.slice(0, 5));
  }
  
  // Limitar a exatamente 5 slides
  const limitedSlides = slideLines.slice(0, 5);
  
  // Garantir que temos exatamente 5 slides
  while (limitedSlides.length < 5) {
    if (limitedSlides.length === 4) {
      limitedSlides.push('Slide 5: Quer saber mais? Entre em contato conosco! 📲');
    } else {
      limitedSlides.push(`Slide ${limitedSlides.length + 1}: Conteúdo adicional sobre o tema.`);
    }
  }
  
  // Renumerar slides para consistência
  const finalSlides = limitedSlides.map((slide, index) => {
    const slideNumber = index + 1;
    const cleanSlide = slide.replace(/^(Slide|Card|Parte)\s*\d+\s*:?\s*/i, '');
    return `Slide ${slideNumber}: ${cleanSlide}`;
  });
  
  console.log(`✅ [parseAndLimitCarousel] Carrossel limitado a ${finalSlides.length} slides`);
  return finalSlides.join('\n\n');
};

export const validateCarouselSlides = (roteiro: string): { isValid: boolean; slideCount: number; errors: string[] } => {
  const slides = roteiro.split('\n').filter(line => 
    line.trim().match(/^Slide\s*\d+/i)
  );
  
  const errors: string[] = [];
  const slideCount = slides.length;
  
  if (slideCount > 5) {
    errors.push(`Muitos slides detectados: ${slideCount}. Máximo permitido: 5`);
  }
  
  if (slideCount < 3) {
    errors.push(`Poucos slides detectados: ${slideCount}. Mínimo recomendado: 3`);
  }
  
  return {
    isValid: slideCount >= 3 && slideCount <= 5,
    slideCount,
    errors
  };
};
