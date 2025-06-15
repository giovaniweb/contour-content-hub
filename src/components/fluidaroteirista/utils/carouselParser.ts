
export const parseCarouselSlides = (roteiro: string) => {
  const blocos = roteiro
    .split(/\n{2,}|(?=^Slide\s*\d*:)/gmi)
    .map(b => b.trim())
    .filter(Boolean)
    .slice(0, 5);

  const slides: { number: number; title: string; texto: string; imagem: string }[] = [];
  const defaultTitles = ["Gancho", "Problema", "Solução", "Benefícios", "Call to Action"];

  blocos.forEach((bloco, idx) => {
    let numero = idx + 1;
    let title = '';
    let texto = '';
    let imagem = '';

    // Detectar Slide X (caso seja usado)
    const slideMatch = bloco.match(/^Slide\s*:?\s*(\d+)?\s*:?\s*([^\n]*)/i);
    let corpo = bloco;
    if (slideMatch) {
      numero = slideMatch[1] ? Number(slideMatch[1]) : numero;
      title = (slideMatch[2] || '').trim();
      corpo = bloco.replace(slideMatch[0], '').trim();
    }

    // Título será sempre a PRIMEIRA linha (antes de Texto:/Imagem:)
    if (!title) {
      const linhas = corpo.split('\n').map(l => l.trim()).filter(Boolean);
      // Sempre pega a primeira linha (independente de conteúdo)
      if (linhas.length > 0) {
        title = linhas[0];
        corpo = corpo.slice(linhas[0].length).trimStart();
      } else {
        title = defaultTitles[idx] || `Slide ${numero}`;
      }
    }

    // Extrai Texto: e Imagem: de qualquer lugar no restante
    // (pode vir na mesma linha juntos ou separados)
    const textoMatch = corpo.match(/Texto:\s*([\s\S]*?)(?=Imagem:|$)/i);
    const imagemMatch = corpo.match(/Imagem:\s*([\s\S]*?)(?=\n|$)/i);

    if (textoMatch && textoMatch[1]) {
      texto = textoMatch[1].trim();
    }
    if (imagemMatch && imagemMatch[1]) {
      imagem = imagemMatch[1].trim();
    }

    // Se o texto ou imagem não vieram, usar fallback
    if (!texto) texto = "Conteúdo do slide";
    if (!imagem) imagem = "Ambiente clínico moderno e acolhedor, profissional sorridente, iluminação suave";

    // Corrige caso título igual a texto/imagem (às vezes pode acontecer!)
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

  // Garante sempre 5 slides
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

// --- Export parseAndLimitCarousel (sem alterações) ---
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

// --- Export validateCarouselSlides (sem alterações) ---
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
