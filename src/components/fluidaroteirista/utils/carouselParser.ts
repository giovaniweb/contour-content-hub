
export const parseAndLimitCarousel = (roteiro: string): string => {
  console.log('🎠 [parseAndLimitCarousel] Processando roteiro do carrossel...');
  
  // Separar por slides numerados
  const slidePattern = /Slide\s*(\d+):\s*/gi;
  const slides = roteiro.split(slidePattern).filter(part => part.trim());
  
  // Agrupar slides (número + conteúdo)
  const processedSlides: string[] = [];
  
  for (let i = 0; i < slides.length; i += 2) {
    if (i + 1 < slides.length) {
      const slideNumber = slides[i];
      const slideContent = slides[i + 1].trim();
      
      // Verificar se tem estrutura Texto/Imagem
      if (slideContent.includes('Texto:') && slideContent.includes('Imagem:')) {
        processedSlides.push(`Slide ${slideNumber}:\n${slideContent}`);
      } else {
        // Forçar estrutura se não tiver
        const lines = slideContent.split('\n').filter(line => line.trim());
        const texto = lines[0] || 'Conteúdo do slide';
        const imagem = lines[1] || 'Descrição visual do slide';
        
        processedSlides.push(`Slide ${slideNumber}:\nTexto: ${texto}\nImagem: ${imagem}`);
      }
    }
  }
  
  // Se não encontrou slides estruturados, criar estrutura básica
  if (processedSlides.length === 0) {
    const paragraphs = roteiro.split(/\n\s*\n/).filter(p => p.trim());
    
    for (let i = 0; i < Math.min(5, paragraphs.length); i++) {
      processedSlides.push(`Slide ${i + 1}:\nTexto: ${paragraphs[i]}\nImagem: Descrição visual para o slide ${i + 1}`);
    }
  }
  
  // Limitar a exatamente 5 slides
  const limitedSlides = processedSlides.slice(0, 5);
  
  // Garantir que temos exatamente 5 slides
  while (limitedSlides.length < 5) {
    const slideNum = limitedSlides.length + 1;
    if (slideNum === 5) {
      limitedSlides.push(`Slide 5:\nTexto: Quer saber mais? Entre em contato conosco! 📲\nImagem: Profissional sorridente em ambiente clínico acolhedor, com informações de contato visíveis`);
    } else {
      limitedSlides.push(`Slide ${slideNum}:\nTexto: Conteúdo adicional sobre o tema.\nImagem: Visual complementar sobre o assunto`);
    }
  }
  
  // Renumerar slides para consistência
  const finalSlides = limitedSlides.map((slide, index) => {
    const slideNumber = index + 1;
    return slide.replace(/^Slide\s*\d+:/, `Slide ${slideNumber}:`);
  });
  
  console.log(`✅ [parseAndLimitCarousel] Carrossel limitado a ${finalSlides.length} slides`);
  return finalSlides.join('\n\n');
};

export const validateCarouselSlides = (roteiro: string): { isValid: boolean; slideCount: number; errors: string[] } => {
  const slides = roteiro.match(/Slide\s*\d+:/gi) || [];
  const errors: string[] = [];
  const slideCount = slides.length;
  
  if (slideCount > 5) {
    errors.push(`Muitos slides detectados: ${slideCount}. Máximo permitido: 5`);
  }
  
  if (slideCount < 3) {
    errors.push(`Poucos slides detectados: ${slideCount}. Mínimo recomendado: 3`);
  }
  
  // Verificar estrutura Texto/Imagem
  const slideContents = roteiro.split(/Slide\s*\d+:/gi).slice(1);
  slideContents.forEach((content, index) => {
    if (!content.includes('Texto:') || !content.includes('Imagem:')) {
      errors.push(`Slide ${index + 1} não tem estrutura Texto/Imagem obrigatória`);
    }
  });
  
  return {
    isValid: slideCount >= 3 && slideCount <= 5 && errors.length === 0,
    slideCount,
    errors
  };
};

export const parseCarouselSlides = (roteiro: string) => {
  const slidePattern = /Slide\s*(\d+):\s*/gi;
  const parts = roteiro.split(slidePattern).filter(part => part.trim());
  const slides = [];
  
  for (let i = 0; i < parts.length; i += 2) {
    if (i + 1 < parts.length) {
      const slideNumber = parseInt(parts[i]);
      const slideContent = parts[i + 1].trim();
      
      // Extrair texto e imagem
      const textoMatch = slideContent.match(/Texto:\s*([^\n]+)/i);
      const imagemMatch = slideContent.match(/Imagem:\s*([^\n]+)/i);
      
      slides.push({
        number: slideNumber,
        texto: textoMatch ? textoMatch[1].trim() : slideContent.split('\n')[0] || 'Texto do slide',
        imagem: imagemMatch ? imagemMatch[1].trim() : 'Descrição visual do slide',
        content: slideContent
      });
    }
  }
  
  return slides;
};
