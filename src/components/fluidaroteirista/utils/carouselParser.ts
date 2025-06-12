
export const parseAndLimitCarousel = (roteiro: string): string => {
  console.log('🎠 [parseAndLimitCarousel] Processando roteiro do carrossel...');
  
  // NOVO: Padrão para slides com títulos descritivos
  const slideWithTitlePattern = /Slide\s+([^:]+):\s*/gi;
  const parts = roteiro.split(slideWithTitlePattern).filter(part => part.trim());
  
  const processedSlides: string[] = [];
  
  // Processar slides com títulos
  for (let i = 0; i < parts.length; i += 2) {
    if (i + 1 < parts.length) {
      const slideTitle = parts[i].trim();
      const slideContent = parts[i + 1].trim();
      
      // Verificar se já tem estrutura - Imagem: / - Texto:
      if (slideContent.includes('- Imagem:') && slideContent.includes('- Texto:')) {
        processedSlides.push(`Slide ${slideTitle}:\n${slideContent}`);
      } else {
        // Forçar estrutura com hífens
        const lines = slideContent.split('\n').filter(line => line.trim());
        const texto = lines.find(line => line.toLowerCase().includes('texto:')) || 
                     lines[0] || 'Conteúdo do slide';
        const imagem = lines.find(line => line.toLowerCase().includes('imagem:')) || 
                      lines[1] || 'Descrição visual do slide';
        
        const cleanTexto = texto.replace(/^.*?texto:\s*/i, '').trim();
        const cleanImagem = imagem.replace(/^.*?imagem:\s*/i, '').trim();
        
        processedSlides.push(`Slide ${slideTitle}:\n- Imagem: ${cleanImagem}\n- Texto: ${cleanTexto}`);
      }
    }
  }
  
  // Se não encontrou slides com títulos, tentar padrão numérico
  if (processedSlides.length === 0) {
    const numericPattern = /Slide\s*(\d+):\s*/gi;
    const numericParts = roteiro.split(numericPattern).filter(part => part.trim());
    
    for (let i = 0; i < numericParts.length; i += 2) {
      if (i + 1 < numericParts.length) {
        const slideNumber = numericParts[i];
        const slideContent = numericParts[i + 1].trim();
        
        // Gerar título baseado no número
        const titles = [
          'Introdução',
          'O Problema',
          'Nossa Solução',
          'Benefícios',
          'Call to Action'
        ];
        const slideTitle = titles[parseInt(slideNumber) - 1] || `Conteúdo ${slideNumber}`;
        
        if (slideContent.includes('- Imagem:') && slideContent.includes('- Texto:')) {
          processedSlides.push(`Slide ${slideTitle}:\n${slideContent}`);
        } else {
          const lines = slideContent.split('\n').filter(line => line.trim());
          const texto = lines[0] || 'Conteúdo do slide';
          const imagem = lines[1] || 'Descrição visual do slide';
          
          processedSlides.push(`Slide ${slideTitle}:\n- Imagem: ${imagem}\n- Texto: ${texto}`);
        }
      }
    }
  }
  
  // Se ainda não tem slides, criar estrutura básica
  if (processedSlides.length === 0) {
    const paragraphs = roteiro.split(/\n\s*\n/).filter(p => p.trim());
    const defaultTitles = [
      'Introdução',
      'O Desafio',
      'Nossa Tecnologia',
      'Resultados',
      'Agende Já'
    ];
    
    for (let i = 0; i < Math.min(5, Math.max(paragraphs.length, 1)); i++) {
      const content = paragraphs[i] || 'Conteúdo sobre o tema';
      processedSlides.push(`Slide ${defaultTitles[i]}:\n- Imagem: Descrição visual para ${defaultTitles[i].toLowerCase()}\n- Texto: ${content}`);
    }
  }
  
  // Limitar a exatamente 5 slides
  const limitedSlides = processedSlides.slice(0, 5);
  
  // Garantir que temos exatamente 5 slides
  while (limitedSlides.length < 5) {
    const slideNum = limitedSlides.length + 1;
    const defaultTitles = ['Introdução', 'Problema', 'Solução', 'Benefícios', 'Call to Action'];
    const title = defaultTitles[slideNum - 1];
    
    if (slideNum === 5) {
      limitedSlides.push(`Slide ${title}:\n- Imagem: Profissional sorridente em ambiente clínico acolhedor, com informações de contato\n- Texto: Quer saber mais? Entre em contato conosco! 📲`);
    } else {
      limitedSlides.push(`Slide ${title}:\n- Imagem: Visual complementar sobre o assunto\n- Texto: Conteúdo adicional sobre o tema`);
    }
  }
  
  console.log(`✅ [parseAndLimitCarousel] Carrossel processado com ${limitedSlides.length} slides`);
  return limitedSlides.join('\n\n');
};

export const validateCarouselSlides = (roteiro: string): { isValid: boolean; slideCount: number; errors: string[] } => {
  const slides = roteiro.match(/Slide\s+[^:]+:/gi) || [];
  const errors: string[] = [];
  const slideCount = slides.length;
  
  if (slideCount > 5) {
    errors.push(`Muitos slides detectados: ${slideCount}. Máximo permitido: 5`);
  }
  
  if (slideCount < 3) {
    errors.push(`Poucos slides detectados: ${slideCount}. Mínimo recomendado: 3`);
  }
  
  // Verificar estrutura - Imagem: / - Texto:
  const slideContents = roteiro.split(/Slide\s+[^:]+:/gi).slice(1);
  slideContents.forEach((content, index) => {
    if (!content.includes('- Imagem:') || !content.includes('- Texto:')) {
      errors.push(`Slide ${index + 1} não tem estrutura "- Imagem:" e "- Texto:" obrigatória`);
    }
  });
  
  return {
    isValid: slideCount >= 3 && slideCount <= 5 && errors.length === 0,
    slideCount,
    errors
  };
};

export const parseCarouselSlides = (roteiro: string) => {
  // NOVO: Parser para títulos descritivos
  const slideWithTitlePattern = /Slide\s+([^:]+):\s*/gi;
  const parts = roteiro.split(slideWithTitlePattern).filter(part => part.trim());
  const slides = [];
  
  for (let i = 0; i < parts.length; i += 2) {
    if (i + 1 < parts.length) {
      const slideTitle = parts[i].trim();
      const slideContent = parts[i + 1].trim();
      
      // Extrair texto e imagem com estrutura de hífen
      const imagemMatch = slideContent.match(/- Imagem:\s*([^\n]+)/i);
      const textoMatch = slideContent.match(/- Texto:\s*([^\n]+)/i);
      
      slides.push({
        number: slides.length + 1,
        title: slideTitle,
        texto: textoMatch ? textoMatch[1].trim() : slideContent.split('\n')[0] || 'Texto do slide',
        imagem: imagemMatch ? imagemMatch[1].trim() : 'Descrição visual do slide',
        content: slideContent
      });
    }
  }
  
  return slides;
};
