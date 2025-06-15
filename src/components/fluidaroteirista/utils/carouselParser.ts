
export const parseCarouselSlides = (roteiro: string) => {
  // Split slides by "Slide X:" OR double line breaks with lookahead for possible Slide X:
  const blocos = roteiro
    .split(/\n{2,}|(?=^Slide\s*\d*:)/gmi)
    .map(b => b.trim())
    .filter(Boolean)
    .slice(0, 5); // máx 5 slides

  const slides: { number: number; title: string; texto: string; imagem: string }[] = [];
  const defaultTitles = ["Gancho", "Problema", "Solução", "Benefícios", "Call to Action"];

  blocos.forEach((bloco, idx) => {
    // Detecta se começa com Slide X: Título (opcional) + resto
    let numero = idx + 1;
    let rawTitle = "";
    let corpo = bloco;

    const slideMatch = bloco.match(/^Slide\s*:?\s*(\d+)?\s*:?\s*([^\n]*)/i);

    if (slideMatch) {
      numero = slideMatch[1] ? Number(slideMatch[1]) : numero;
      rawTitle = (slideMatch[2] || "").trim();
      corpo = bloco.replace(slideMatch[0], "").trim();
    }

    // --- NOVA LÓGICA PARA SEPARAÇÃO DE TÍTULO, TEXTO E IMAGEM ---
    let title = rawTitle;
    let texto = "";
    let imagem = "";

    // Se não há título explícito (rawTitle), processar linhas para extrair corretamente
    if (!title) {
      // Divide em linhas e remove as em branco
      const linhas = corpo.split(/\n/).map(l => l.trim()).filter(Boolean);
      // Se a primeira linha contém "Texto:" ou "Imagem:", NÃO é título; use defaultTitle.
      if (
        linhas[0] &&
        (linhas[0].toLowerCase().startsWith("texto:") || linhas[0].toLowerCase().startsWith("imagem:"))
      ) {
        title = defaultTitles[idx] || `Slide ${numero}`;
      } else if (linhas.length > 0) {
        title = linhas[0];
        // O corpo a ser analisado como texto/imagem é TUDO exceto a primeira linha
        corpo = linhas.slice(1).join("\n");
      } else {
        title = defaultTitles[idx] || `Slide ${numero}`;
      }
    }

    // Extrair Texto: e Imagem: de QUALQUER parte do corpo pendente
    const textoMatch = corpo.match(/Texto:\s*([\s\S]*?)(?=\nImagem:|\nTexto:|$)/i);
    if (textoMatch && textoMatch[1]) {
      texto = textoMatch[1].trim();
    }

    const imagemMatch = corpo.match(/Imagem:\s*([\s\S]*?)(?=\nTexto:|$)/i);
    if (imagemMatch && imagemMatch[1]) {
      imagem = imagemMatch[1].trim();
    }

    // Fallbacks só se não tiver nada extraído real
    if (!texto) texto = "Conteúdo do slide";
    if (!imagem) imagem = "Ambiente clínico moderno e acolhedor, profissional sorridente, iluminação suave";

    // Se título acidentalmente igual ao texto/imagem, limpa para título default
    if (
      (texto && title === texto) ||
      (imagem && title === imagem)
    ) {
      title = defaultTitles[idx] || `Slide ${numero}`;
    }

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

