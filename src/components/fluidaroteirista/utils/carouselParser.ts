
export const parseCarouselSlides = (roteiro: string) => {
  const defaultTitles = [
    "Gancho",
    "Problema",
    "Solução",
    "Benefícios",
    "Call to Action"
  ];

  // Divide roteiro por "Slide X:" ou por grandes quebras, sempre lookahead
  const blocos = roteiro
    .split(/\n{2,}|(?=^Slide\s*\d*:)/gmi)
    .map(b => b.trim())
    .filter(Boolean)
    .slice(0, 5);

  const slides: { number: number; title: string; texto: string; imagem: string }[] = [];

  blocos.forEach((bloco, idx) => {
    let numero = idx + 1;
    let title = '';
    let texto = '';
    let imagem = '';
    let corpo = bloco;

    // Detecta marcador Slide X: e cromba com título se existir
    const slideMatch = corpo.match(/^Slide\s*:?\s*(\d+)?\s*:?\s*([^\n]*)/i);
    if (slideMatch) {
      numero = slideMatch[1] ? Number(slideMatch[1]) : numero;
      title = (slideMatch[2] || '').trim();
      corpo = corpo.replace(slideMatch[0], '').trim();
    }

    // AUDITORIA: encontrar "Texto:" e "Imagem:" em qualquer ordem, juntos ou não, na mesma linha ou não

    // 1. Se ainda não há title, pega o texto ANTES de Texto:/Imagem: OU só a primeira linha, se não houver marcador
    if (!title) {
      // Linha antes de qualquer marcador
      const primeiroMarcador = corpo.search(/Texto:|Imagem:/i);
      if (primeiroMarcador > 0) {
        // Há linhas antes do marcador
        title = corpo.slice(0, primeiroMarcador).trim();
        corpo = corpo.slice(primeiroMarcador).trim();
      } else {
        // Não achou marcador, pega a primeira linha não-vazia
        const linhas = corpo
          .split("\n")
          .map(l => l.trim())
          .filter(Boolean);
        title = linhas[0] || defaultTitles[idx] || `Slide ${numero}`;
        // Remove a linha título do corpo
        if (linhas.length > 0) {
          corpo = corpo.replace(linhas[0], "").trim();
        }
      }
    }

    // 2. Extração múltipla e robusta (pegar ambos mesmo juntos ou em ordem invertida)
    // Pode estar tudo em uma linha, ou multi-line.
    // Exemplo: "Texto: X Imagem: Y", ou "Imagem: Y Texto: X", ou só um deles

    // Matches múltiplos para pegar ambos [Texto e Imagem] independente de ordem, respeitando multiline
    const regexMulti = /Texto:\s*([\s\S]*?)(?=(\n|$|Imagem:))|Imagem:\s*([\s\S]*?)(?=(\n|$|Texto:))/gi;
    let lastTexto = null;
    let lastImagem = null;
    let match;
    while ((match = regexMulti.exec(corpo)) !== null) {
      if (match[1] !== undefined && match[1] !== null) {
        // Veio um Texto:
        lastTexto = match[1].trim();
      }
      if (match[3] !== undefined && match[3] !== null) {
        // Veio um Imagem:
        lastImagem = match[3].trim();
      }
    }

    // Dar prioridade ao que foi explicitamente marcado
    texto = lastTexto || "";
    imagem = lastImagem || "";

    // Se ainda não encontrou Texto/Imagem, como fallback, tenta achar só "Imagem:"/ "Texto:" via regex clássico
    if (!texto) {
      const tMatch = corpo.match(/Texto:\s*([\s\S]*?)(?=Imagem:|\n|$)/i);
      if (tMatch && tMatch[1]) texto = tMatch[1].trim();
    }
    if (!imagem) {
      const iMatch = corpo.match(/Imagem:\s*([\s\S]*?)(?=\n|Texto:|$)/i);
      if (iMatch && iMatch[1]) imagem = iMatch[1].trim();
    }

    // Elimina poluição: remove marcador colado ao título
    if (title.match(/Texto:|Imagem:/i)) {
      title = title.replace(/Texto:.*$/i, "").replace(/Imagem:.*$/i, "").trim();
    }
    // Se o título virou vazio, nomeia por padrão
    if (!title) title = defaultTitles[idx] || `Slide ${numero}`;

    // Corrige caso título igual ao texto/imagem (erro de parser anterior)
    if (
      (texto && title === texto) ||
      (imagem && title === imagem)
    ) {
      title = defaultTitles[idx] || `Slide ${numero}`;
    }

    // Fallbacks finais, mas só se realmente vazio (NUNCA sobrescreve conteúdo real)
    if (!texto) texto = "Conteúdo do slide";
    if (!imagem) imagem = "Ambiente clínico moderno e acolhedor, profissional sorridente, iluminação suave";

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
