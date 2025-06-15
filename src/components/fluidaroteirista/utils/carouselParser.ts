
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
