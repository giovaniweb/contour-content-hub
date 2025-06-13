
export const parseAndLimitCarousel = (roteiro: string): string => {
  console.log('🎠 [parseAndLimitCarousel] Processando roteiro do carrossel...');
  
  // NOVO: Padrão para slides com estrutura limpa (sem hífens)
  const slidePattern = /Slide:\s*([^\n]+)/gi;
  const matches = roteiro.match(slidePattern);
  
  if (!matches) {
    console.log('⚠️ Nenhum slide encontrado, criando estrutura padrão');
    return createDefaultCarousel();
  }
  
  const processedSlides: string[] = [];
  const parts = roteiro.split(/Slide:\s*/gi).filter(part => part.trim());
  
  // Processar cada slide
  for (let i = 1; i < parts.length; i++) { // Pular o primeiro item vazio
    const slideContent = parts[i].trim();
    const lines = slideContent.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) continue;
    
    const slideTitle = lines[0].replace(/^\s*([^\n]+).*/, '$1').trim();
    let texto = '';
    let imagem = '';
    
    // Extrair Texto: e Imagem: da estrutura limpa
    for (const line of lines) {
      if (line.startsWith('Texto:')) {
        texto = line.replace('Texto:', '').trim();
      } else if (line.startsWith('Imagem:')) {
        imagem = line.replace('Imagem:', '').trim();
      }
    }
    
    // Se não encontrou estrutura específica, usar conteúdo como texto
    if (!texto && !imagem) {
      const content = lines.slice(1).join(' ').trim();
      texto = content.substring(0, 150) || 'Conteúdo do slide';
      imagem = 'Ambiente clínico moderno e acolhedor, profissional sorridente, iluminação suave';
    }
    
    processedSlides.push(`Slide: ${slideTitle}\nTexto: ${texto}\nImagem: ${imagem}`);
  }
  
  // Limitar a exatamente 5 slides
  const limitedSlides = processedSlides.slice(0, 5);
  
  // Garantir que temos exatamente 5 slides
  while (limitedSlides.length < 5) {
    const slideNum = limitedSlides.length + 1;
    const defaultTitles = ['Introdução', 'O Problema', 'Nossa Solução', 'Benefícios', 'Call to Action'];
    const title = defaultTitles[slideNum - 1];
    
    if (slideNum === 5) {
      limitedSlides.push(`Slide: ${title}\nTexto: Quer transformar sua vida? Entre em contato conosco! 📲\nImagem: Profissional acolhedor em recepção moderna, ambiente convidativo, informações de contato visíveis, atmosfera confiante`);
    } else {
      limitedSlides.push(`Slide: ${title}\nTexto: Conteúdo adicional sobre o tema\nImagem: Ambiente clínico especializado, equipamentos modernos, atmosfera profissional e acolhedora`);
    }
  }
  
  console.log(`✅ [parseAndLimitCarousel] Carrossel processado com ${limitedSlides.length} slides`);
  return limitedSlides.join('\n\n');
};

const createDefaultCarousel = (): string => {
  const defaultSlides = [
    `Slide: Introdução\nTexto: Descubra a revolução na estética moderna\nImagem: Ambiente clínico luxuoso, paciente confiante conversando com profissional, iluminação suave e acolhedora`,
    `Slide: O Desafio\nTexto: Sinais do tempo que incomodam e afetam sua autoestima\nImagem: Close-up artístico de pessoa preocupada observando reflexo no espelho, luz natural suave, expressão contemplativa`,
    `Slide: Nossa Solução\nTexto: Tecnologia avançada para resultados surpreendentes\nImagem: Equipamento moderno em funcionamento, profissional especializado operando, ambiente high-tech e seguro`,
    `Slide: Benefícios\nTexto: Resultados naturais e duradouros que você merece\nImagem: Paciente radiante após tratamento, sorriso genuíno, ambiente de celebração, antes e depois sutil`,
    `Slide: Call to Action\nTexto: Agende sua consulta e transforme sua vida hoje!\nImagem: Recepcionista simpática atendendo por telefone, agenda aberta, ambiente profissional e convidativo`
  ];
  
  return defaultSlides.join('\n\n');
};

export const validateCarouselSlides = (roteiro: string): { isValid: boolean; slideCount: number; errors: string[] } => {
  const slides = roteiro.match(/Slide:\s*[^\n]+/gi) || [];
  const errors: string[] = [];
  const slideCount = slides.length;
  
  if (slideCount > 5) {
    errors.push(`Muitos slides detectados: ${slideCount}. Máximo permitido: 5`);
  }
  
  if (slideCount < 3) {
    errors.push(`Poucos slides detectados: ${slideCount}. Mínimo recomendado: 3`);
  }
  
  // Verificar estrutura Texto: e Imagem: (sem hífens)
  const slideContents = roteiro.split(/Slide:\s*[^\n]+/gi).slice(1);
  slideContents.forEach((content, index) => {
    if (!content.includes('Texto:') || !content.includes('Imagem:')) {
      errors.push(`Slide ${index + 1} não tem estrutura "Texto:" e "Imagem:" obrigatória`);
    }
  });
  
  return {
    isValid: slideCount >= 3 && slideCount <= 5 && errors.length === 0,
    slideCount,
    errors
  };
};

export const parseCarouselSlides = (roteiro: string) => {
  console.log('🎠 [parseCarouselSlides] Analisando roteiro:', roteiro.substring(0, 200));
  
  // Parser para estrutura limpa: Slide:, Texto:, Imagem:
  const slidePattern = /Slide:\s*([^\n]+)/gi;
  const parts = roteiro.split(slidePattern).filter(part => part.trim());
  const slides = [];
  
  for (let i = 0; i < parts.length; i += 2) {
    if (i + 1 < parts.length) {
      const slideTitle = parts[i].trim();
      const slideContent = parts[i + 1].trim();
      
      console.log(`📋 Processando slide: "${slideTitle}"`);
      console.log(`📝 Conteúdo: ${slideContent.substring(0, 100)}...`);
      
      // Extrair texto e imagem da estrutura limpa (sem hífens)
      const textoMatch = slideContent.match(/Texto:\s*([^\n]+)/i);
      const imagemMatch = slideContent.match(/Imagem:\s*([^\n]+)/i);
      
      const texto = textoMatch ? textoMatch[1].trim() : slideContent.split('\n')[0] || 'Texto do slide';
      const imagem = imagemMatch ? imagemMatch[1].trim() : 'Ambiente clínico moderno, profissional especializado, iluminação suave';
      
      console.log(`✅ Texto extraído: ${texto.substring(0, 50)}...`);
      console.log(`🖼️ Imagem extraída: ${imagem.substring(0, 50)}...`);
      
      slides.push({
        number: slides.length + 1,
        title: slideTitle,
        texto: texto,
        imagem: imagem,
        content: slideContent
      });
    }
  }
  
  console.log(`🎯 Total de slides processados: ${slides.length}`);
  return slides;
};
