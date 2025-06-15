
export const parseCarouselSlides = (roteiro: string) => {
  // Split slides either by "Slide X:" ou por bloco de linhas em branco dupla
  // O parser cobre:
  // - Slide 1: Título\nTexto:\nImagem:
  // - Título\nTexto:\nImagem:
  // - Slide 1:\nTexto:\nImagem:

  const blocos = roteiro
    .split(/\n{2,}|(?=^Slide\s*\d*:)/gmi)
    .map(b => b.trim())
    .filter(Boolean)
    .slice(0, 5); // máx 5 slides

  const slides: { number: number; title: string; texto: string; imagem: string }[] = [];
  const defaultTitles = ["Gancho", "Problema", "Solução", "Benefícios", "Call to Action"];

  blocos.forEach((bloco, idx) => {
    // Padrão: Slide X: Título (opcional) + resto
    let numero = idx + 1;
    let rawTitle = "";
    let corpo = bloco;

    // Detecta se começa com Slide X:
    const slideMatch = bloco.match(/^Slide\s*:?\s*(\d+)?\s*:?\s*([^\n]*)/i);

    if (slideMatch) {
      numero = slideMatch[1] ? Number(slideMatch[1]) : numero;
      rawTitle = (slideMatch[2] || "").trim();
      corpo = bloco.replace(slideMatch[0], "").trim();
    }

    // Agora tenta extrair o título se ainda não tem (caso arquivo tenha apenas "Título\nTexto:")
    let title = rawTitle;
    if (!title) {
      // Primeira linha útil ANTES de Texto: ou Imagem:
      const firstLine = corpo.split("\n").map(l => l.trim()).find(l =>
        l && !l.toLowerCase().startsWith("texto:") && !l.toLowerCase().startsWith("imagem:")
      );
      title = firstLine || defaultTitles[idx] || `Slide ${numero}`;
    }

    // Extrair Texto: e Imagem: (pode ter linha solta antes)
    let texto = "";
    let imagem = "";

    const textoMatch = corpo.match(/Texto:\s*([\s\S]*?)(?=\nImagem:|\nTexto:|$)/i);
    if (textoMatch && textoMatch[1]) {
      texto = textoMatch[1].trim();
    }

    const imagemMatch = corpo.match(/Imagem:\s*([\s\S]*?)(?=\nTexto:|$)/i);
    if (imagemMatch && imagemMatch[1]) {
      imagem = imagemMatch[1].trim();
    }

    // Se título acidentalmente igual ao texto/imagem, limpa para título default
    if (
      (texto && title === texto) ||
      (imagem && title === imagem)
    ) {
      title = defaultTitles[idx] || `Slide ${numero}`;
    }

    // Fallbacks só se não tiver nada extraído real
    if (!texto) texto = "Conteúdo do slide";
    if (!imagem) imagem = "Ambiente clínico moderno e acolhedor, profissional sorridente, iluminação suave";

    slides.push({
      number: numero,
      title,
      texto,
      imagem
    });
  });

  // Garante sempre 5
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

// --- Export parseAndLimitCarousel (mantém igual) ---
export const parseAndLimitCarousel = (roteiro: string): string => {
  const slides = parseCarouselSlides(roteiro);
  return slides
    .slice(0, 5)
    .map(
      (slide, idx) =>
        `Slide ${slide.number}: ${slide.title}\nTexto: ${slide.texto}\nImagem: ${slide.imagem}\n`
    )
    .join('\n');
};

// --- Export validateCarouselSlides (mantém igual) ---
export const validateCarouselSlides = (roteiro: string) => {
  const slides = parseCarouselSlides(roteiro);
  const errors: string[] = [];

  if (slides.length === 0) errors.push("Nenhum slide encontrado");
  if (slides.length > 5) errors.push("Mais de 5 slides detectados");
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

