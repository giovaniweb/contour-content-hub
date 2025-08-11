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
    // 1. "🔹 SLIDE X — TITULO" (formato atual com emoji)
    // 2. "**Slide X: Titulo**" (formato anterior)
    // 3. "Slide: Titulo" ou "Slide X: Titulo" (formato antigo)
    
    console.log('🔍 [extractFromBlock] Processando bloco:', bloco.substring(0, 100) + '...');
    
    let slideMatch = bloco.match(/^🔹\s*SLIDE\s*(\d+)\s*—\s*([^\n]*)/i);
    let corpo = bloco;
    
    if (slideMatch) {
      title = (slideMatch[2] || '').trim();
      corpo = corpo.replace(slideMatch[0], "").trim();
      console.log('✅ [extractFromBlock] Título extraído (emoji):', title);
    } else {
      // Fallback para formatos anteriores
      slideMatch = bloco.match(/^(?:\*\*)?Slide\s*:?\s*(\d+)?\s*[:\-–]?\s*([^\n*]*?)(?:\*\*)?/i);
      if (slideMatch) {
        title = (slideMatch[2] || '').trim();
        corpo = corpo.replace(slideMatch[0], "").trim();
        // Remove markdown extra se existir
        corpo = corpo.replace(/^\*\*/g, '').replace(/\*\*$/g, '');
        console.log('✅ [extractFromBlock] Título extraído (formato anterior):', title);
      }
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

    // Se não encontrou marcadores "Texto:" e "Imagem:", usa estratégia para formato emoji
    if (!texto && !imagem && corpo) {
      // Remove separadores como "---" que aparecem no final de alguns slides
      const cleanCorpo = corpo.replace(/^---+\s*/gm, '').replace(/---+\s*$/gm, '').trim();
      
      if (cleanCorpo) {
        // No formato emoji, todo o conteúdo do slide vira "texto"
        texto = cleanCorpo;
        // Gera descrição genérica de imagem baseada no conteúdo
        if (texto.length > 20) {
          imagem = "Imagem ilustrativa relacionada ao conteúdo do slide, com design atrativo para Instagram";
        }
      }
    }
    
    console.log('🔍 [extractFromBlock] Resultado - Título:', title, 'Texto:', texto?.substring(0, 50) + '...', 'Imagem:', imagem?.substring(0, 50) + '...');

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
  // 1. "🔹 SLIDE X —" (formato atual com emoji)
  // 2. "**Slide X: Título**" (formato anterior)  
  // 3. "Slide X:" (padrão antigo)
  
  let processedRoteiro = roteiro;
  console.log('🔍 [carouselParser] Roteiro original:', roteiro.substring(0, 200) + '...');
  
  // Remove cabeçalho se existir (negrito e simples)
  processedRoteiro = processedRoteiro
    .replace(/^\*\*ROTEIRO\s+CARROSSEL\*\*\s*\n?/i, '')
    // Remove apenas o prefixo do cabeçalho quando estiver na mesma linha que o primeiro slide
    .replace(/^ROTEIRO\s+CARROSSEL[^\n]*(?=---)/i, '')
    .replace(/^ROTEIRO\s+CARROSSEL[^\n]*(?=Slide\s*\d+)/i, '')
    .replace(/^ROTEIRO\s+CARROSSEL[^\n]*\n/i, '');
  // Divide por diferentes padrões de slide
  let blocos: string[] = [];
  
  // 1. NOVO: Tenta primeiro o formato com emoji: 🔹 SLIDE X —
  const emojiBlocks = processedRoteiro.split(/(?=🔹\s*SLIDE\s*\d+\s*—)/gi)
    .map(b => b.trim())
    .filter(Boolean);
    
  console.log('🔍 [carouselParser] Emoji blocks encontrados:', emojiBlocks.length);
  
  if (emojiBlocks.length > 1) {
    blocos = emojiBlocks;
    console.log('✅ [carouselParser] Usando formato emoji');
  } else {
    // 2. Novo fallback: "Slide X –" sem negrito, possivelmente precedido por '---'
    const noBoldDashBlocks = processedRoteiro.split(/(?=(?:-{2,}\s*)?Slide\s*\d+\s*[–—-])/gi)
      .map(b => b.trim())
      .filter(Boolean);

    if (noBoldDashBlocks.length > 1) {
      blocos = noBoldDashBlocks;
      console.log('✅ [carouselParser] Usando formato com traço (sem negrito)');
    } else {
      // 3. Fallback: Formato com traço em negrito: **Slide X –** ou **Slide X -**
      const dashFormatBlocks = processedRoteiro.split(/(?=\*\*Slide\s*\d+\s*[–—-])/gi)
        .map(b => b.trim())
        .filter(Boolean);
      
      if (dashFormatBlocks.length > 1) {
        blocos = dashFormatBlocks;
        console.log('✅ [carouselParser] Usando formato com traço (negrito)');
      } else {
        // 4. Fallback: formato com dois pontos: **Slide X:**
        const colonFormatBlocks = processedRoteiro.split(/(?=\*\*Slide\s*\d+:)/gi)
          .map(b => b.trim())
          .filter(Boolean);
        
        if (colonFormatBlocks.length > 1) {
          blocos = colonFormatBlocks;
          console.log('✅ [carouselParser] Usando formato com dois pontos');
        } else {
          // 5. Último fallback: formato antigo: Slide X:
          const oldColonBlocks = processedRoteiro.split(/(?=Slide\s*\d*:)/gi)
            .map(b => b.trim())
            .filter(Boolean);
          blocos = oldColonBlocks.length > 1 ? oldColonBlocks : [processedRoteiro.trim()];
          console.log('✅ [carouselParser] Usando formato antigo');
        }
      }
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
