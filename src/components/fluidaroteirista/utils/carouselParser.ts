export const parseCarouselSlides = (roteiro: string) => {
  // Regex robusto para dividir blocos iniciando em "Slide X:"
  const slideRegex = /Slide\s*:? ?(\d+)?\s*:?\s*([^\n]*)\n?([^]*?)(?=(?:\n+)?Slide\s*:? ?\d+\s*:|\s*$)/gi;
  const slides: { number: number; title: string; texto: string; imagem: string }[] = [];

  let match;
  let slideIndex = 0;

  while ((match = slideRegex.exec(roteiro)) !== null && slides.length < 5) {
    slideIndex++;
    const number = match[1] ? Number(match[1]) : slideIndex;
    let rawTitle = (match[2] || "").trim();

    // Captura o bloco inteiro do slide (linhas após título)
    const bloco = match[3] || "";

    // Extrair Texto: e Imagem: corretamente (mesmo que multi-linha)
    // Apanha a primeira linha do bloco como título se o 'rawTitle' estiver vazio
    let title = rawTitle;
    if (!title) {
      // Primeira linha útil do bloco (antes de Texto: ou Imagem:)
      const firstLine = bloco.split('\n').map(l => l.trim()).filter(Boolean)[0] || "";
      if (
        firstLine &&
        !firstLine.toLowerCase().startsWith("texto:") &&
        !firstLine.toLowerCase().startsWith("imagem:")
      ) {
        title = firstLine;
      } else {
        // Fallbacks por ordem
        const defaultTitles = ["Gancho", "Problema", "Solução", "Benefícios", "Call to Action"];
        title = defaultTitles[slides.length] || `Slide ${slideIndex}`;
      }
    }

    // Regex para capturar multi linhas após Texto:
    let texto = "";
    let imagem = "";

    // Extrair Texto: (pega todas as linhas até próximo campo ou final do bloco)
    const textoMatch = bloco.match(/Texto:\s*([\s\S]*?)(?=\n(?:Imagem:|Texto:|$))/i);
    if (textoMatch && textoMatch[1]) {
      texto = textoMatch[1].trim();
    }

    // Extrair Imagem:
    const imagemMatch = bloco.match(/Imagem:\s*([\s\S]*?)(?=\n(?:Texto:|Imagem:|$))/i);
    if (imagemMatch && imagemMatch[1]) {
      imagem = imagemMatch[1].trim();
    }

    // Fallbacks
    if (!texto) texto = "Conteúdo do slide";
    if (!imagem) imagem = "Ambiente clínico moderno e acolhedor, profissional sorridente, iluminação suave";

    slides.push({
      number,
      title,
      texto,
      imagem
    });
  }

  // Sempre retorna 5 slides: preenche faltantes
  const defaultTitles = ["Gancho", "Problema", "Solução", "Benefícios", "Call to Action"];
  while (slides.length < 5) {
    slides.push({
      number: slides.length + 1,
      title: defaultTitles[slides.length] || `Slide ${slides.length + 1}`,
      texto: "Conteúdo do slide",
      imagem: "Ambiente clínico moderno e acolhedor, profissional sorridente, iluminação suave"
    });
  }

  return slides.slice(0, 5);
}

// --- NEW: Export parseAndLimitCarousel, as used in other files ---
// It should use parseCarouselSlides, join slides formatted string
export const parseAndLimitCarousel = (roteiro: string): string => {
  // Parse and format as a text block, max 5 slides
  const slides = parseCarouselSlides(roteiro);
  return slides
    .slice(0, 5)
    .map(
      (slide, idx) =>
        `Slide ${slide.number}: ${slide.title}\nTexto: ${slide.texto}\nImagem: ${slide.imagem}\n`
    )
    .join('\n');
};

// --- NEW: Export validateCarouselSlides as used in other files ---
export const validateCarouselSlides = (roteiro: string) => {
  const slides = parseCarouselSlides(roteiro);
  const errors: string[] = [];

  // At least one slide and <= 5
  if (slides.length === 0) errors.push("Nenhum slide encontrado");
  if (slides.length > 5) errors.push("Mais de 5 slides detectados");
  // All slides should have texto and imagem
  slides.forEach((slide, idx) => {
    if (!slide.texto || slide.texto.trim() === "" || slide.texto === "Conteúdo do slide") {
      errors.push(`Slide ${idx + 1} sem texto`);
    }
    if (!slide.imagem || slide.imagem.trim() === "" || slide.imagem === "Ambiente clínico moderno e acolhedor, profissional sorridente, iluminação suave") {
      errors.push(`Slide ${idx + 1} sem descrição de imagem`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    slideCount: slides.length
  };
}
