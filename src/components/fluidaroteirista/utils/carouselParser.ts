
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
    let numero = idx + 1;
    let rawTitle = "";
    let corpo = bloco;

    const slideMatch = bloco.match(/^Slide\s*:?\s*(\d+)?\s*:?\s*([^\n]*)/i);

    if (slideMatch) {
      numero = slideMatch[1] ? Number(slideMatch[1]) : numero;
      rawTitle = (slideMatch[2] || "").trim();
      corpo = bloco.replace(slideMatch[0], "").trim();
    }

    // PARA PEGAR SEMPRE O TÍTULO LIMPO, MESMO SE ESTIVER NA PRIMEIRA LINHA, JUNTO DE "Texto:":
    // Se não houver rawTitle explícito, pega a primeira linha antes de qualquer "Texto:" ou "Imagem:"
    let title = rawTitle;
    let texto = "";
    let imagem = "";

    if (!title) {
      // Tenta encontrar a linha antes de "Texto:" ou "Imagem:"
      const primeiraLinha = corpo.split("\n")[0] || "";
      const titleLimpo = primeiraLinha.split(/Texto:|Imagem:/i)[0].trim();
      if (titleLimpo !== "") {
        title = titleLimpo;
        corpo = corpo.replace(primeiraLinha, "").trim();
      } else {
        title = defaultTitles[idx] || `Slide ${numero}`;
      }
    }

    // Agora extrai "Texto:" e "Imagem:" do restante do bloco (prioridade: respeitar ambos mesmo grudados sem quebras)
    // Garante separação mesmo em casos como: "xxx\nTexto: blabla\nImagem: foo"
    let textoMatch = corpo.match(/Texto:\s*([\s\S]*?)(?=\nImagem:|$)/i);
    let imagemMatch = corpo.match(/Imagem:\s*([\s\S]*?)(?=$)/i);

    // Se "Imagem:" vier antes de "Texto:" no bloco, também cobre esse cenário:
    if (!textoMatch && /Imagem:/i.test(corpo)) {
      imagemMatch = corpo.match(/Imagem:\s*([\s\S]*?)(?=\nTexto:|$)/i);
      textoMatch = corpo.match(/Texto:\s*([\s\S]*?)(?=$)/i);
    }

    if (textoMatch && textoMatch[1]) {
      texto = textoMatch[1].trim();
    }
    if (imagemMatch && imagemMatch[1]) {
      imagem = imagemMatch[1].trim();
    }

    // Fallbacks se não houver valores extraídos
    if (!texto) texto = "Conteúdo do slide";
    if (!imagem) imagem = "Ambiente clínico moderno e acolhedor, profissional sorridente, iluminação suave";

    // Corrigir se campo ficou igual ao título
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

  // Garante sempre 5 slides preenchidos
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
