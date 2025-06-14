export const parseAndLimitCarousel = (roteiro: string): string => {
  console.log('🎠 [parseAndLimitCarousel] Processando roteiro do carrossel...');
  
  // CORREÇÃO: Padrão mais específico para slides com conteúdo real
  const slidePattern = /Slide\s*\d*\s*:\s*([^\n]+)/gi;
  const matches = roteiro.match(slidePattern);
  
  if (!matches) {
    console.log('⚠️ Nenhum slide encontrado, criando estrutura padrão');
    return createDefaultCarousel();
  }
  
  const processedSlides: string[] = [];
  
  // CORREÇÃO: Split mais preciso para capturar conteúdo real
  const slideSections = roteiro.split(/(?=Slide\s*\d*\s*:)/gi).filter(section => section.trim());
  
  console.log(`🔍 [parseAndLimitCarousel] Seções encontradas: ${slideSections.length}`);
  
  // Processar cada seção de slide
  for (let i = 0; i < Math.min(slideSections.length, 5); i++) {
    const section = slideSections[i].trim();
    const lines = section.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) continue;
    
    // Extrair título do slide
    const titleLine = lines[0];
    const titleMatch = titleLine.match(/Slide\s*\d*\s*:\s*(.+)/i);
    const slideTitle = titleMatch ? titleMatch[1].trim() : `Slide ${i + 1}`;
    
    let texto = '';
    let imagem = '';
    
    // CORREÇÃO: Buscar por "Texto:" e "Imagem:" com mais precisão
    for (let j = 1; j < lines.length; j++) {
      const line = lines[j].trim();
      
      if (line.toLowerCase().startsWith('texto:')) {
        texto = line.replace(/^texto:\s*/i, '').trim();
        // Se o texto continua na próxima linha
        let k = j + 1;
        while (k < lines.length && !lines[k].toLowerCase().startsWith('imagem:') && !lines[k].toLowerCase().startsWith('slide')) {
          texto += ' ' + lines[k].trim();
          k++;
        }
      } else if (line.toLowerCase().startsWith('imagem:')) {
        imagem = line.replace(/^imagem:\s*/i, '').trim();
        // Se a descrição continua na próxima linha
        let k = j + 1;
        while (k < lines.length && !lines[k].toLowerCase().startsWith('texto:') && !lines[k].toLowerCase().startsWith('slide')) {
          imagem += ' ' + lines[k].trim();
          k++;
        }
      }
    }
    
    // CORREÇÃO: Se não encontrou estrutura específica, usar abordagem mais inteligente
    if (!texto && !imagem) {
      const contentLines = lines.slice(1); // Pular título
      const halfPoint = Math.ceil(contentLines.length / 2);
      
      texto = contentLines.slice(0, halfPoint).join(' ').trim() || 'Conteúdo do slide';
      imagem = contentLines.slice(halfPoint).join(' ').trim() || 'Ambiente clínico moderno e acolhedor';
    }
    
    // Garantir que texto não seja muito longo
    if (texto.length > 150) {
      texto = texto.substring(0, 147) + '...';
    }
    
    // Garantir que imagem tenha descrição visual
    if (imagem.length < 15) {
      imagem = 'Ambiente clínico moderno, profissional especializado, iluminação suave e acolhedora';
    }
    
    const slideNumber = i + 1;
    const formattedSlide = `Slide ${slideNumber}: ${slideTitle}\nTexto: ${texto}\nImagem: ${imagem}`;
    
    console.log(`✅ [parseAndLimitCarousel] Slide ${slideNumber} processado:`, {
      titulo: slideTitle,
      texto: texto.substring(0, 50) + '...',
      imagem: imagem.substring(0, 50) + '...'
    });
    
    processedSlides.push(formattedSlide);
  }
  
  // Garantir que temos exatamente 5 slides
  while (processedSlides.length < 5) {
    const slideNum = processedSlides.length + 1;
    const defaultTitles = ['Gancho', 'O Problema', 'Nossa Solução', 'Benefícios', 'Call to Action'];
    const title = defaultTitles[slideNum - 1];
    
    const defaultTexts = [
      'Descubra a revolução na estética moderna',
      'Sinais do tempo que incomodam sua autoestima',
      'Tecnologia avançada para resultados surpreendentes',
      'Resultados naturais e duradouros que você merece',
      'Agende sua consulta e transforme sua vida hoje!'
    ];
    
    const defaultImages = [
      'Ambiente clínico luxuoso, paciente confiante conversando com profissional, iluminação suave e acolhedora',
      'Close-up artístico de pessoa preocupada observando reflexo no espelho, luz natural suave, expressão contemplativa',
      'Equipamento moderno em funcionamento, profissional especializado operando, ambiente high-tech e seguro',
      'Paciente radiante após tratamento, sorriso genuíno, ambiente de celebração, resultados visíveis',
      'Recepcionista simpática atendendo por telefone, agenda aberta, ambiente profissional e convidativo'
    ];
    
    processedSlides.push(`Slide ${slideNum}: ${title}\nTexto: ${defaultTexts[slideNum - 1]}\nImagem: ${defaultImages[slideNum - 1]}`);
  }
  
  // Limitar a exatamente 5 slides
  const finalSlides = processedSlides.slice(0, 5);
  
  console.log(`✅ [parseAndLimitCarousel] Carrossel processado com ${finalSlides.length} slides`);
  return finalSlides.join('\n\n');
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
    const hasTexto = content.toLowerCase().includes('texto:');
    const hasImagem = content.toLowerCase().includes('imagem:');
    
    if (!hasTexto || !hasImagem) {
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
  
  // CORREÇÃO: Split mais inteligente para capturar slides completos
  const slideSections = roteiro.split(/(?=Slide\s*\d*\s*:)/gi).filter(section => section.trim());
  const slides = [];
  
  console.log(`🔍 [parseCarouselSlides] Seções de slide encontradas: ${slideSections.length}`);
  
  for (let i = 0; i < Math.min(slideSections.length, 5); i++) {
    const section = slideSections[i].trim();
    const lines = section.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) continue;
    
    // Extrair número e título do slide
    const titleLine = lines[0];
    const titleMatch = titleLine.match(/Slide\s*(\d*)\s*:\s*(.+)/i);
    
    const slideNumber = titleMatch && titleMatch[1] ? parseInt(titleMatch[1]) : i + 1;
    const slideTitle = titleMatch && titleMatch[2] ? titleMatch[2].trim() : `Slide ${i + 1}`;
    
    console.log(`📋 [parseCarouselSlides] Processando slide ${slideNumber}: "${slideTitle}"`);
    
    let texto = '';
    let imagem = '';
    
    // CORREÇÃO: Extrair texto e imagem com mais precisão
    for (let j = 1; j < lines.length; j++) {
      const line = lines[j].trim();
      
      if (line.toLowerCase().startsWith('texto:')) {
        texto = line.replace(/^texto:\s*/i, '').trim();
        // Continuar lendo até encontrar "Imagem:" ou fim da seção
        let k = j + 1;
        while (k < lines.length && !lines[k].toLowerCase().startsWith('imagem:')) {
          if (lines[k].trim() && !lines[k].toLowerCase().startsWith('slide')) {
            texto += ' ' + lines[k].trim();
          }
          k++;
        }
      } else if (line.toLowerCase().startsWith('imagem:')) {
        imagem = line.replace(/^imagem:\s*/i, '').trim();
        // Continuar lendo até encontrar próximo elemento
        let k = j + 1;
        while (k < lines.length && !lines[k].toLowerCase().startsWith('texto:') && !lines[k].toLowerCase().startsWith('slide')) {
          if (lines[k].trim()) {
            imagem += ' ' + lines[k].trim();
          }
          k++;
        }
      }
    }
    
    // Fallback se não encontrou estrutura específica
    if (!texto || !imagem) {
      const allContent = lines.slice(1).join(' ').trim();
      
      if (!texto) {
        texto = allContent.substring(0, 100) || 'Conteúdo do slide';
      }
      
      if (!imagem) {
        imagem = 'Ambiente clínico moderno, profissional especializado, iluminação suave e acolhedora, equipamentos de última geração em destaque';
      }
    }
    
    console.log(`✅ [parseCarouselSlides] Slide ${slideNumber} extraído:`, {
      texto: texto.substring(0, 50) + '...',
      imagem: imagem.substring(0, 50) + '...'
    });
    
    slides.push({
      number: slideNumber,
      title: slideTitle,
      texto: texto,
      imagem: imagem,
      content: section
    });
  }
  
  console.log(`🎯 [parseCarouselSlides] Total de slides processados: ${slides.length}`);
  return slides;
};
