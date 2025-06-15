export const parseAndLimitCarousel = (roteiro: string): string => {
  console.log('🎠 [parseAndLimitCarousel] Processando roteiro do carrossel...');
  
  // NOVO: Padrão para slides com estrutura limpa (sem hífens)
  const slidePattern = /Slide\s*\d*\s*:\s*([^\n]+)/gi;
  const matches = roteiro.match(slidePattern);
  
  if (!matches) {
    console.log('⚠️ Nenhum slide encontrado, criando estrutura padrão');
    return createDefaultCarousel();
  }
  
  const processedSlides: string[] = [];
  const parts = roteiro.split(/Slide\s*\d*\s*:\s*/gi).filter(part => part.trim());
  
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
    
    const slideNumber = processedSlides.length + 1;
    const finalTitle = slideNumber === 1 ? 'Gancho' : slideTitle;
    
    processedSlides.push(`Slide ${slideNumber}: ${finalTitle}\nTexto: ${texto}\nImagem: ${imagem}`);
  }
  
  // Limitar a exatamente 5 slides
  const limitedSlides = processedSlides.slice(0, 5);
  
  // Garantir que temos exatamente 5 slides
  while (limitedSlides.length < 5) {
    const slideNum = limitedSlides.length + 1;
    const defaultTitles = ['Gancho', 'O Problema', 'Nossa Solução', 'Benefícios', 'Call to Action'];
    const title = defaultTitles[slideNum - 1];
    
    if (slideNum === 5) {
      limitedSlides.push(`Slide ${slideNum}: ${title}\nTexto: Quer transformar sua vida? Entre em contato conosco! 📲\nImagem: Profissional acolhedor em recepção moderna, ambiente convidativo, informações de contato visíveis, atmosfera confiante`);
    } else {
      limitedSlides.push(`Slide ${slideNum}: ${title}\nTexto: Conteúdo adicional sobre o tema\nImagem: Ambiente clínico especializado, equipamentos modernos, atmosfera profissional e acolhedora`);
    }
  }
  
  console.log(`✅ [parseAndLimitCarousel] Carrossel processado com ${limitedSlides.length} slides`);
  return limitedSlides.join('\n\n');
};

const createDefaultCarousel = (): string => {
  const defaultSlides = [
    `Slide 1: Gancho\nTexto: Descubra a revolução na estética moderna\nImagem: Ambiente clínico luxuoso, paciente confiante conversando com profissional, iluminação suave e acolhedora`,
    `Slide 2: O Desafio\nTexto: Sinais do tempo que incomodam e afetam sua autoestima\nImagem: Close-up artístico de pessoa preocupada observando reflexo no espelho, luz natural suave, expressão contemplativa`,
    `Slide 3: Nossa Solução\nTexto: Tecnologia avançada para resultados surpreendentes\nImagem: Equipamento moderno em funcionamento, profissional especializado operando, ambiente high-tech e seguro`,
    `Slide 4: Benefícios\nTexto: Resultados naturais e duradouros que você merece\nImagem: Paciente radiante após tratamento, sorriso genuíno, ambiente de celebração, antes e depois sutil`,
    `Slide 5: Call to Action\nTexto: Agende sua consulta e transforme sua vida hoje!\nImagem: Recepcionista simpática atendendo por telefone, agenda aberta, ambiente profissional e convidativo`
  ];
  
  return defaultSlides.join('\n\n');
};

export const validateCarouselSlides = (roteiro: string): { isValid: boolean; slideCount: number; errors: string[] } => {
  const slides = roteiro.match(/Slide\s*\d*\s*:\s*[^\n]+/gi) || [];
  const errors: string[] = [];
  const slideCount = slides.length;
  
  if (slideCount > 5) {
    errors.push(`Muitos slides detectados: ${slideCount}. Máximo permitido: 5`);
  }
  
  if (slideCount < 3) {
    errors.push(`Poucos slides detectados: ${slideCount}. Mínimo recomendado: 3`);
  }
  
  // Verificar estrutura Texto: e Imagem: (sem hífens)
  const slideContents = roteiro.split(/Slide\s*\d*\s*:\s*[^\n]+/gi).slice(1);
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
  // Corrigir parser para casos reais diversos e padronizar títulos/tipos
  const slidePattern = /Slide\s*:? ?(\d+)?\s*:?\s*([^\n]*)\n+([^]*?)(?=\n*Slide\s*:? ?\d*\s*:|\s*$)/gi;
  const slides = [];
  let match;
  let slideIndex = 0;

  // Extrair cada slide reconhecendo bloco entre Slide e o próximo Slide
  while ((match = slidePattern.exec(roteiro)) !== null) {
    slideIndex++;
    const number = match[1] ? Number(match[1]) : slideIndex;
    const title = match[2]?.trim() || `Slide ${slideIndex}`;
    let texto = '';
    let imagem = '';

    // Extrair Texto: ... e Imagem: ... do bloco
    const bloco = match[3] || '';
    const textoMatch = bloco.match(/Texto:\s*([^\n]+)/i);
    const imagemMatch = bloco.match(/Imagem:\s*([^\n]+)/i);
    texto = textoMatch?.[1]?.trim() || '';
    imagem = imagemMatch?.[1]?.trim() || '';

    // Fallback se não encontrar campos
    if (!texto && bloco.trim()) {
      texto = bloco.split('\n')[0]?.trim() || '';
    }
    if (!imagem) {
      imagem = 'Ambiente clínico moderno, profissional especializado, iluminação suave';
    }
    slides.push({
      number,
      title: title || `Slide ${number}`,
      texto,
      imagem
    });
  }

  // Remover slides fantasma e garantir sempre até cinco
  const validSlides = slides.filter(s => !!s.texto && !!s.imagem).slice(0, 5);
  return validSlides;
};
