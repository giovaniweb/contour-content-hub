
// Função para limpar texto de caracteres indesejados
const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  return text
    // Remove caracteres de escape e formatação markdown
    .replace(/\[|\]|\n\n\s*\\|\\\s*\[|\\\s*\]/g, '')
    // Remove quebras de linha múltiplas
    .replace(/\n{3,}/g, '\n\n')
    // Remove espaços extras
    .replace(/\s{2,}/g, ' ')
    // Remove caracteres de controle
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Limpa início e fim
    .trim();
};

export const parseAndLimitCarousel = (roteiro: string): string => {
  console.log('🎠 [parseAndLimitCarousel] Processando roteiro do carrossel...');
  
  // Primeiro, limpar o roteiro inteiro
  const cleanRoteiro = sanitizeText(roteiro);
  
  // NOVO: Padrão para slides com estrutura limpa (sem hífens)
  const slidePattern = /Slide:\s*([^\n]+)/gi;
  const matches = cleanRoteiro.match(slidePattern);
  
  if (!matches) {
    console.log('⚠️ Nenhum slide encontrado, criando estrutura padrão');
    return createDefaultCarousel();
  }
  
  const processedSlides: string[] = [];
  const parts = cleanRoteiro.split(/Slide:\s*/gi).filter(part => part.trim());
  
  // Processar cada slide
  for (let i = 1; i < parts.length; i++) { // Pular o primeiro item vazio
    const slideContent = sanitizeText(parts[i]);
    const lines = slideContent.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) continue;
    
    const slideTitle = sanitizeText(lines[0].replace(/^\s*([^\n]+).*/, '$1'));
    let texto = '';
    let imagem = '';
    
    // Extrair Texto: e Imagem: da estrutura limpa (sem hífens)
    for (const line of lines) {
      const cleanLine = sanitizeText(line);
      if (cleanLine.startsWith('Texto:')) {
        texto = sanitizeText(cleanLine.replace('Texto:', ''));
      } else if (cleanLine.startsWith('Imagem:')) {
        imagem = sanitizeText(cleanLine.replace('Imagem:', ''));
      }
    }
    
    // Se não encontrou estrutura específica, usar conteúdo como texto
    if (!texto && !imagem) {
      const content = lines.slice(1).join(' ').trim();
      texto = sanitizeText(content.substring(0, 150)) || 'Conteúdo do slide';
      imagem = 'Ambiente clínico moderno e acolhedor, profissional sorridente, iluminação suave';
    }
    
    // Garantir que não há textos vazios
    if (!texto) texto = 'Conteúdo do slide';
    if (!imagem) imagem = 'Ambiente clínico moderno e acolhedor';
    
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
  const cleanRoteiro = sanitizeText(roteiro);
  const slides = cleanRoteiro.match(/Slide:\s*[^\n]+/gi) || [];
  const errors: string[] = [];
  const slideCount = slides.length;
  
  if (slideCount > 5) {
    errors.push(`Muitos slides detectados: ${slideCount}. Máximo permitido: 5`);
  }
  
  if (slideCount < 3) {
    errors.push(`Poucos slides detectados: ${slideCount}. Mínimo recomendado: 3`);
  }
  
  // Verificar estrutura Texto: e Imagem: (sem hífens)
  const slideContents = cleanRoteiro.split(/Slide:\s*[^\n]+/gi).slice(1);
  slideContents.forEach((content, index) => {
    const cleanContent = sanitizeText(content);
    if (!cleanContent.includes('Texto:') || !cleanContent.includes('Imagem:')) {
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
  
  // Primeiro limpar o roteiro
  const cleanRoteiro = sanitizeText(roteiro);
  
  // Parser para estrutura limpa: Slide:, Texto:, Imagem:
  const slidePattern = /Slide:\s*([^\n]+)/gi;
  const parts = cleanRoteiro.split(slidePattern).filter(part => part.trim());
  const slides = [];
  
  for (let i = 0; i < parts.length; i += 2) {
    if (i + 1 < parts.length) {
      const slideTitle = sanitizeText(parts[i]);
      const slideContent = sanitizeText(parts[i + 1]);
      
      console.log(`📋 Processando slide: "${slideTitle}"`);
      console.log(`📝 Conteúdo: ${slideContent.substring(0, 100)}...`);
      
      // Extrair texto e imagem da estrutura limpa (sem hífens)
      const textoMatch = slideContent.match(/Texto:\s*([^\n]+)/i);
      const imagemMatch = slideContent.match(/Imagem:\s*([^\n]+)/i);
      
      const texto = textoMatch ? sanitizeText(textoMatch[1]) : sanitizeText(slideContent.split('\n')[0]) || 'Texto do slide';
      const imagem = imagemMatch ? sanitizeText(imagemMatch[1]) : 'Ambiente clínico moderno, profissional especializado, iluminação suave';
      
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
