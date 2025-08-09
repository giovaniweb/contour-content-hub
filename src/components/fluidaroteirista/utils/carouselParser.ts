export const parseCarouselSlides = (roteiro: string) => {
  const defaultTitles = [
    "Gancho",
    "Problema",
    "Solução",
    "Benefícios",
    "Call to Action"
  ];

  // Helper: Normaliza aspas e remove vírgulas finais de JSON inválidas
  function normalizeJsonString(str: string) {
    return str.replace(/,(\s*[}\]])/g, '$1').replace(/\\n/g, '\n');
  }

  // Helper: Extrai bloco de JSON se existir
  function extractFromJsonBlock(raw: string) {
    try {
      // Encontra o início do objeto JSON
      const objStart = raw.indexOf('{');
      const objEnd = raw.lastIndexOf('}');
      if (objStart > -1 && objEnd > objStart) {
        const jsonBlock = raw.substring(objStart, objEnd + 1);
        const json = JSON.parse(normalizeJsonString(jsonBlock));
        // Se tiver campo "roteiro" aplica parse novamente sobre ele (recursivo)
        if (typeof json.roteiro === "string") {
          return extractFromBlock(json.roteiro);
        }
        // Se vier separado retorna texto/imagem
        return {
          title: json.title || "",
          texto: json.texto || "",
          imagem: json.imagem || ""
        };
      }
    } catch (e) {
      // Se falhar, ignora
    }
    return null;
  }

  // Helper: Extrai <Titulo, Texto, Imagem> de um bloco simples ou recursivo, tanto faz inline quanto separado
  function extractFromBlock(bloco: string, idx = 0) {
    // (1) Se for JSON aninhado
    if (bloco.trim().startsWith("{")) {
      const result = extractFromJsonBlock(bloco);
      if (result) return {
        number: idx + 1,
        title: result.title || defaultTitles[idx] || `Slide ${idx+1}`,
        texto: result.texto || "Conteúdo do slide",
        imagem: result.imagem || "Ambiente clínico moderno e acolhedor, profissional sorridente, iluminação suave"
      };
    }

    // (2) Macro: identifica marcadores padrões (independentemente de ordem e quebra)
    let title = "";
    let texto = "";
    let imagem = "";

    // Primeira linha é título SE não houver marcador ("Texto:"/"Imagem:") nela
    // Detecta múltiplos formatos de slide:
    // 1. "Slide: Titulo" ou "Slide X: Titulo" 
    // 2. "**Slide X: Titulo**"
    // 3. "**Slide X – Titulo**" ou "**Slide X - Titulo**"
    const slideMatch = bloco.match(/^(?:\*\*)?Slide\s*:?\s*(\d+)?\s*[:\-–]?\s*([^\n*]*?)(?:\*\*)?/i);
    let corpo = bloco;
    if (slideMatch) {
      title = (slideMatch[2] || '').trim();
      corpo = corpo.replace(slideMatch[0], "").trim();
      // Remove markdown extra se existir
      corpo = corpo.replace(/^\*\*/g, '').replace(/\*\*$/g, '');
    }

    // Se título ficou vazio, pega linha antes do 1º marcador OU primeira linha do corpo
    if (!title) {
      const marcadorIdx = corpo.search(/Texto:|Imagem:/i);
      if (marcadorIdx > 0) {
        title = corpo.slice(0, marcadorIdx).split("\n")[0].trim();
        corpo = corpo.slice(marcadorIdx).trim();
      } else {
        // Se não tem marcadores "Texto:" e "Imagem:", pega primeira linha como título
        const linhas = corpo.split('\n').filter(l => l.trim());
        if (linhas.length > 0) {
          title = linhas[0].trim();
          corpo = linhas.slice(1).join('\n').trim();
        }
      }
    }

    // Extrai Texto e Imagem (independente da ordem, incluso quando estão juntos na mesma linha)
    // Matches: "Texto: ... Imagem: ..." OU "Imagem: ... Texto: ..."
    const multiRegex = /Texto:\s*([\s\S]*?)(?=(\n|$|Imagem:))|Imagem:\s*([\s\S]*?)(?=(\n|$|Texto:))/gi;
    let match;
    let textoFound = null;
    let imagemFound = null;
    while ((match = multiRegex.exec(corpo)) !== null) {
      if (match[1] !== undefined && match[1] !== null) {
        textoFound = match[1].trim();
      }
      if (match[3] !== undefined && match[3] !== null) {
        imagemFound = match[3].trim();
      }
    }
    texto = textoFound || "";
    imagem = imagemFound || "";

    // Fallback: tenta ainda achar marcador isolado se matches falharam
    if (!texto) {
      const tMatch = corpo.match(/Texto:\s*([\s\S]*?)(?=Imagem:|\n|$)/i);
      if (tMatch && tMatch[1]) texto = tMatch[1].trim();
    }
    if (!imagem) {
      const iMatch = corpo.match(/Imagem:\s*([\s\S]*?)(?=\n|Texto:|$)/i);
      if (iMatch && iMatch[1]) imagem = iMatch[1].trim();
    }

    // Se não encontrou marcadores, usa o corpo todo como texto
    if (!texto && !imagem && corpo) {
      texto = corpo.trim();
    }

    // Se título virou vazio, usa default
    if (!title) title = defaultTitles[idx] || `Slide ${idx+1}`;
    // Evita título igual aos campos texto/imagem
    if ((texto && title === texto) || (imagem && title === imagem)) {
      title = defaultTitles[idx] || `Slide ${idx+1}`;
    }

    // Limpa aspas extras/marcador solto
    title = title.replace(/["',]/g, "").trim();

    // Fallback padrão
    if (!texto) texto = "Conteúdo do slide";
    if (!imagem) imagem = "Ambiente clínico moderno e acolhedor, profissional sorridente, iluminação suave";

    return {
      number: idx+1,
      title,
      texto,
      imagem
    };
  }

  // --- Divisão de blocos PRINCIPAL corrigida ---
  // Suporte para múltiplos formatos de carrossel:
  // 1. "Slide X:" (padrão antigo)
  // 2. "**Slide X: Título**" (novo formato sendo usado)
  // 3. "**ROTEIRO CARROSSEL**\n**Slide X: Título**"
  
  let processedRoteiro = roteiro;
  
  // Remove cabeçalho se existir
  processedRoteiro = processedRoteiro.replace(/^\*\*ROTEIRO\s+CARROSSEL\*\*\s*\n?/i, '');
  
  // Divide por diferentes padrões de slide
  let blocos: string[] = [];
  
  // Tenta primeiro o novo formato: **Slide X –** ou **Slide X -**
  const newFormatBlocks = processedRoteiro.split(/(?=\*\*Slide\s*\d+\s*[–-])/gi)
    .map(b => b.trim())
    .filter(Boolean);
    
  if (newFormatBlocks.length > 1) {
    blocos = newFormatBlocks;
  } else {
    // Fallback para formato com dois pontos: **Slide X:**
    const colonFormatBlocks = processedRoteiro.split(/(?=\*\*Slide\s*\d+:)/gi)
      .map(b => b.trim())
      .filter(Boolean);
      
    if (colonFormatBlocks.length > 1) {
      blocos = colonFormatBlocks;
    } else {
      // Último fallback para formato antigo: Slide X:
      blocos = processedRoteiro.split(/(?=Slide\s*\d*:)/gi)
        .map(b => b.trim())
        .filter(Boolean);
    }
  }
  
  blocos = blocos.slice(0, 5);

  // Processa cada bloco de slide (até 5)
  const slides: { number: number; title: string; texto: string; imagem: string }[] = blocos.map((bloco, idx) => extractFromBlock(bloco, idx));

  // Garante saída uniforme (5 slides)
  while (slides.length < 5) {
    slides.push({
      number: slides.length + 1,
      title: defaultTitles[slides.length] || `Slide ${slides.length+1}`,
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
