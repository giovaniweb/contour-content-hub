import { FORMATO_CONFIGS } from '../constants/intentionTree';
import { getMentorReference } from './mentorReferences';

export const buildSystemPrompt = (equipmentDetails: any[], modo: string, mentor: string, dados: any): string => {
  const { canal, formato, objetivo, estilo } = dados;
  
  // Obter configurações do formato
  const formatConfig = FORMATO_CONFIGS[formato] || {};
  const tempoLimite = formatConfig.tempo_limite_segundos;
  const palavrasMax = formatConfig.palavras_max;
  const estrutura = formatConfig.estrutura;

  // Usar nome fictício para o mentor
  const mentorReference = getMentorReference(mentor);

  const equipmentContext = equipmentDetails.length > 0 
    ? equipmentDetails.map(eq => `
      - ${eq.nome}: ${eq.tecnologia}
      - Indicações: ${eq.indicacoes}
      - Benefícios: ${eq.beneficios}
      - Diferenciais: ${eq.diferenciais}
    `).join('\n')
    : '';

  const equipmentInstructions = equipmentDetails.length > 0 
    ? `
    🚨 REGRA CRÍTICA DE EQUIPAMENTOS:
    - OBRIGATÓRIO: Mencione TODOS os equipamentos listados: ${equipmentDetails.map(eq => eq.nome).join(', ')}
    - Use os nomes EXATOS dos equipamentos (nomes reais)
    - Integre as tecnologias e benefícios específicos
    - NUNCA substitua por outros equipamentos
    - Inclua equipamentos nas descrições de imagem
    `
    : `
    🚨 REGRA DE EQUIPAMENTOS:
    - NENHUM equipamento específico selecionado
    - NÃO mencione equipamentos específicos
    - Use termos genéricos como "nossos tratamentos"
    `;

  // Instruções específicas por formato
  const formatInstructions = getFormatInstructions(formato, canal, tempoLimite, palavrasMax);

  return `
    Você é o FLUIDAROTEIRISTA — roteirista especializado em ${canal.toUpperCase()}.
    Sua persona criativa é: ${mentorReference}
    
    🎯 ESPECIFICAÇÕES DO FORMATO:
    - Canal: ${canal}
    - Formato: ${formato}
    - Estrutura: ${estrutura}
    ${tempoLimite ? `- Tempo limite: ${tempoLimite} segundos` : ''}
    ${palavrasMax ? `- Palavras máximo: ${palavrasMax}` : ''}
    
    ${formatInstructions}
    
    📋 EQUIPAMENTOS DISPONÍVEIS:
    ${equipmentContext}
    
    ${equipmentInstructions}
    
    🎨 DIRETRIZES CRIATIVAS:
    - Objetivo: ${objetivo}
    - Estilo: ${estilo}
    - Mentor: ${mentorReference}
    
    ESTRUTURA OBRIGATÓRIA:
    1. Gancho (capturar atenção imediata)
    2. Conflito (apresentar problema/necessidade)
    3. Virada (mostrar solução com equipamentos específicos)
    4. CTA (chamada para ação específica do formato)
    
    ${getOutputInstructions(formato)}
  `;
};

const getFormatInstructions = (formato: string, canal: string, tempoLimite?: number, palavrasMax?: number): string => {
  const instructions = {
    stories: `
    🔥 STORIES 10X - METODOLOGIA LEANDRO LADEIRA - INSTRUÇÕES CRÍTICAS:
    
    🚨 REGRA OBRIGATÓRIA: EXATAMENTE 4 STORIES - NEM MAIS, NEM MENOS
    
    📊 ESPECIFICAÇÕES TÉCNICAS RÍGIDAS:
    - EXATAMENTE 4 stories conectados (OBRIGATÓRIO)
    - MÁXIMO 40 segundos total (10s por story)
    - Sequência narrativa com dispositivos de engajamento
    - Tom: provocativo, inteligente, engraçado (estilo Leandro Ladeira)
    
    🎯 ESTRUTURA OBRIGATÓRIA STORIES 10X (EXATAMENTE 4):
    Story 1: GANCHO PROVOCATIVO (3s de atenção + 7s desenvolvimento)
    - Provocação inteligente tipo "Você tá fazendo Stories como quem manda bom dia no grupo da família?"
    - Questão que para o scroll
    - Tom humorístico mas inteligente
    
    Story 2: ERRO COMUM + IDENTIFICAÇÃO (10s)
    - Mostrar o erro que todo mundo comete
    - Criar identificação com a audiência
    - Usar referências cotidianas engraçadas
    
    Story 3: VIRADA + DISPOSITIVO DE ENGAJAMENTO (10s)
    - Apresentar a solução/insight
    - OBRIGATÓRIO: Incluir dispositivo (emoji foguinho 🔥, enquete, pergunta)
    - Criar reciprocidade: "manda um foguinho que eu te conto o resto"
    - Integrar equipamentos naturalmente se selecionados
    
    Story 4: CTA SUAVE + ANTECIPAÇÃO (10s)
    - Call-to-action leve e inteligente
    - Criar antecipação para próximo conteúdo
    - Ex: "Se esse roteiro valeu, compartilha com um amigo perdido no Storytelling"
    - Deixar gancho para continuar o relacionamento
    
    🚨 VALIDAÇÃO OBRIGATÓRIA:
    - CONTE: Deve ter EXATAMENTE 4 stories (Story 1:, Story 2:, Story 3:, Story 4:)
    - ESTRUTURA: Cada story deve ter conteúdo de 10 segundos
    - DISPOSITIVOS: Pelo menos 2 dispositivos de engajamento
    - SEQUÊNCIA: Narrativa conectada do início ao fim
    
    🧠 DISPOSITIVOS OBRIGATÓRIOS (usar pelo menos 2):
    - 🔥 Emoji foguinho: "manda um foguinho nos comentários"
    - 📊 Enquete: pergunta binária para gerar engajamento
    - ❓ Pergunta direta: "qual sua maior dificuldade com..."
    - 🔄 Reciprocidade: "se você fizer X, eu te entrego Y"
    - 📲 Compartilhamento: "marca um amigo que precisa ver isso"
    
    🎭 TOM DE VOZ LEANDRO LADEIRA:
    - Provocativo mas educativo
    - Humor inteligente (não palhaçada)
    - Referências cotidianas engraçadas
    - Direto ao ponto
    - Cria comunidade, não só conteúdo
    
    ⚡ REGRAS DE ENGAJAMENTO:
    - Transformar Stories em conversa, não aula
    - Cada story deve pedir uma ação
    - Criar sequência que vicia (antecipação)
    - Gerar reciprocidade através de troca de valor
    `,
    
    carrossel: `
    🎠 CARROSSEL INSTAGRAM - INSTRUÇÕES RÍGIDAS:
    - EXATAMENTE 5 slides, nem mais nem menos
    - OBRIGATÓRIO: Use títulos DESCRITIVOS para cada slide
    - ESTRUTURA OBRIGATÓRIA PARA CADA SLIDE (SEM HÍFENS):
      Slide: [Título Descritivo]
      Texto: [máximo 25 palavras de conteúdo impactante]
      Imagem: [descrição visual DETALHADA e específica com pelo menos 15 palavras]
    - Slide 1: "Slide: Introdução" - Gancho forte
    - Slide 2: "Slide: O Problema" ou similar - Apresentar desafio
    - Slide 3: "Slide: Nossa Solução" ou nome do equipamento - Apresentar solução
    - Slide 4: "Slide: Benefícios" ou resultados - Mostrar vantagens
    - Slide 5: "Slide: Call to Action" - CTA forte
    - NUNCA exceder 5 slides
    - NUNCA use hífens (-) na estrutura
    - Use APENAS: "Slide:", "Texto:", "Imagem:"
    - Descrições de imagem DEVEM incluir: ambiente detalhado, pessoas específicas, equipamentos reais mencionados, cores, expressões, detalhes visuais, iluminação, elementos de composição
    - Se equipamentos foram selecionados, OBRIGATÓRIO mostrá-los nas descrições visuais E no texto
    - Mencione equipamentos pelos nomes REAIS no roteiro
    `,
    
    
    post_estatico: `
    🖼️ POST ESTÁTICO - INSTRUÇÕES:
    - Uma imagem impactante
    - Texto para sobreposição na imagem (máximo 8 palavras)
    - Legenda completa para o post
    - Sugestão visual detalhada
    ${palavrasMax ? `- Legenda máximo: ${palavrasMax} palavras` : ''}
    `,
    
    reels: `
    🎥 REELS INSTAGRAM - INSTRUÇÕES:
    - Roteiro temporal para 60 segundos
    - Marque os tempos: [0-5s], [5-15s], etc.
    - Linguagem dinâmica e envolvente
    - Incluir sugestões de cortes/transições
    ${tempoLimite ? `- Tempo total: ${tempoLimite}s` : ''}
    `,
    
    short: `
    ⚡ YOUTUBE SHORT - INSTRUÇÕES:
    - Roteiro para 50 segundos máximo
    - Início impactante nos primeiros 3 segundos
    - Informação densa e valiosa
    - CTA para inscrever no canal
    - Formato vertical otimizado
    `,
    
    video: `
    📹 VÍDEO YOUTUBE - INSTRUÇÕES:
    - Roteiro detalhado para até 3 minutos
    - Introdução, desenvolvimento, conclusão
    - Momentos para respiração e pausa
    - Sugestões de cortes e B-roll
    - CTA múltiplos (like, inscrever, comentar)
    `,
    
    post_ads: `
    🎯 POST PARA ADS - INSTRUÇÕES:
    - Copy persuasivo focado em conversão
    - Headline impactante
    - Benefícios claros e diretos
    - Senso de urgência ou escassez
    - CTA forte e específico
    - Objeções antecipadas
    `,
    
    reels_ads: `
    🎬 REELS PARA ADS - INSTRUÇÕES:
    - 30 segundos máximo para ads
    - Primeiro quadro deve parar o scroll
    - Problema → Solução → Prova → CTA
    - Foco total em conversão
    - Linguagem direta e persuasiva
    `
  };

  return instructions[formato as keyof typeof instructions] || '';
};

const getOutputInstructions = (formato: string): string => {
  const outputs = {
    stories: `
    🔥 STORIES 10X - OUTPUT OBRIGATÓRIO - VALIDAÇÃO CRÍTICA:
    
    🚨 ATENÇÃO: DEVE TER EXATAMENTE 4 STORIES - CONTE ANTES DE ENVIAR
    
    Retorne JSON:
    {
      "roteiro": "Story 1: [Gancho provocativo - 10s]\n[Conteúdo do Story 1 com dispositivo incluído]\n\nStory 2: [Erro comum + identificação - 10s]\n[Conteúdo do Story 2 com tom humorístico]\n\nStory 3: [Virada + dispositivo de engajamento - 10s]\n[Conteúdo do Story 3 com OBRIGATÓRIO dispositivo 🔥/📊/❓ + equipamentos se selecionados]\n\nStory 4: [CTA suave + antecipação - 10s]\n[Conteúdo do Story 4 com compartilhamento/reciprocidade]",
      "formato": "stories",
      "metodologia": "leandro_ladeira",
      "stories_total": 4,
      "tempo_total": "40s",
      "dispositivos_usados": ["emoji_foguinho", "enquete", "pergunta", "reciprocidade"],
      "tom_narrativo": "provocativo_inteligente",
      "engajamento_esperado": "alto"
    }
    
    🚨 VALIDAÇÃO FINAL OBRIGATÓRIA:
    - Conte os "Story X:" no seu roteiro
    - DEVE ter exatamente: "Story 1:", "Story 2:", "Story 3:", "Story 4:"
    - Cada story deve ter conteúdo próprio
    - Pelo menos 2 dispositivos de engajamento incluídos
    - Se equipamentos selecionados: DEVEM aparecer no Story 3
    
    ❌ REJEITAR SE:
    - Menos de 4 stories
    - Mais de 4 stories  
    - Stories sem conteúdo
    - Falta de dispositivos de engajamento
    `,
    
    carrossel: `
    🚨 IMPORTANTE: EXATAMENTE 5 SLIDES COM ESTRUTURA LIMPA (SEM HÍFENS)
    Retorne JSON:
    {
      "roteiro": "Slide: Introdução\nTexto: [Gancho impactante em até 25 palavras]\nImagem: [Descrição visual detalhada: ambiente clínico moderno, pessoa confiante, equipamento específico em destaque, iluminação suave, composição profissional, cores predominantes]\n\nSlide: O Problema\nTexto: [Desenvolvimento do problema]\nImagem: [Descrição visual específica mostrando o desafio, com detalhes de ambiente, expressão, situação]\n\nSlide: Nossa Solução\nTexto: [Solução apresentada com nome REAL do equipamento]\nImagem: [Descrição visual com equipamento REAL em ação, resultados visíveis, ambiente específico]\n\nSlide: Benefícios\nTexto: [Benefícios e diferenciais específicos]\nImagem: [Descrição visual do resultado final, satisfação do cliente, ambiente de resultado]\n\nSlide: Call to Action\nTexto: [CTA forte e direto com convite à ação]\nImagem: [Descrição visual de chamada para ação, profissional acolhedor, contato da clínica, ambiente convidativo]",
      "formato": "carrossel", 
      "slides_total": 5,
      "sugestao_visual": "Cada slide tem descrição visual específica integrada com estrutura limpa"
    }
    VALIDAÇÃO CRÍTICA: 
    - Conte os slides: DEVE ser exatamente 5
    - Verifique títulos: DEVEM ser descritivos (não apenas números)
    - Confirme estrutura: DEVE ter "Slide:", "Texto:", "Imagem:" SEM hífens
    - Se equipamentos selecionados: DEVEM aparecer com nomes REAIS no roteiro
    `,
    
    
    post_estatico: `
    Retorne JSON:
    {
      "roteiro": "Texto principal do post",
      "formato": "post_estatico",
      "texto_imagem": "Texto para sobrepor na imagem",
      "legenda": "Legenda completa para o post",
      "sugestao_visual": "Descrição detalhada da imagem"
    }
    `,
    
    reels: `
    Retorne JSON:
    {
      "roteiro": "[0-5s] Gancho\n[5-20s] Desenvolvimento\n[20-50s] Solução\n[50-60s] CTA",
      "formato": "reels",
      "tempo_total": "60s",
      "sugestoes_edicao": "Cortes, transições, efeitos"
    }
    `,
    
    short: `
    Retorne JSON:
    {
      "roteiro": "[0-3s] Hook\n[3-45s] Conteúdo\n[45-50s] CTA",
      "formato": "short",
      "tempo_total": "50s", 
      "sugestoes_edicao": "Cortes rápidos, texto na tela"
    }
    `,
    
    video: `
    Retorne JSON:
    {
      "roteiro": "Introdução (0-30s)\nDesenvolvimento (30s-2m30s)\nConclusão (2m30s-3m)",
      "formato": "video",
      "tempo_total": "3min",
      "momentos_chave": "Lista de momentos importantes",
      "sugestoes_broll": "Sugestões de imagens complementares"
    }
    `,
    
    post_ads: `
    Retorno JSON:
    {
      "roteiro": "Copy principal do anúncio",
      "formato": "post_ads",
      "headline": "Título impactante",
      "cta_principal": "Botão de ação",
      "copy_secundario": "Texto complementar"
    }
    `,
    
    reels_ads: `
    Retorne JSON:
    {
      "roteiro": "[0-3s] Hook\n[3-20s] Problema\n[20-25s] Solução\n[25-30s] CTA",
      "formato": "reels_ads",
      "tempo_total": "30s",
      "foco_conversao": "Elementos para maximizar conversão"
    }
    `
  };

  return outputs[formato as keyof typeof outputs] || `
    Retorne JSON:
    {
      "roteiro": "Conteúdo do roteiro",
      "formato": "${formato}"
    }
  `;
};

export const buildDisneyPrompt = (originalScript: string, formato: string): string => {
  const formatConfig = FORMATO_CONFIGS[formato] || {};
  const tempoLimite = formatConfig.tempo_limite_segundos;

  return `
    PARTE 1 - Análise Walt Disney 1928:
    Assuma a identidade de Walt Disney em 1928.
    Analise este roteiro para ${formato}: "${originalScript}"
    
    Identifique a magia escondida nesta história.
    
    PARTE 2 - Transformação Disney:
    Aplique os elementos Disney mantendo as especificações técnicas:
    ${tempoLimite ? `- Respeite o limite de ${tempoLimite} segundos` : ''}
    - Mantenha o formato ${formato}
    - Preserve equipamentos mencionados COM NOMES REAIS
    - Mantenha estrutura: "Slide:", "Texto:", "Imagem:" (sem hífens)
    
    PARTE 3 - Magia Sutil:
    - NÃO use "Era uma vez"
    - Adicione elemento de surpresa
    - Crie momento emocional
    - Final inesquecível
    - Mantenha nomes REAIS dos equipamentos
    
    Retorne apenas o roteiro transformado em JSON:
    {
      "roteiro": "Roteiro com magia Disney sutil mantendo estrutura original e equipamentos reais",
      "disney_applied": true
    }
  `;
};
```

```typescript
export interface Stories10xSlide {
  number: number;
  titulo: string;
  conteudo: string;
  dispositivo?: string;
  tempo: string;
  tipo: 'gancho' | 'erro' | 'virada' | 'cta';
}

// Função para limpar o conteúdo do texto
const cleanContent = (content: string): string => {
  return content
    .replace(/\n\n+/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const parseStories10xSlides = (roteiro: string): Stories10xSlide[] => {
  console.log('🔍 [Stories10xParser] Iniciando parse CRÍTICO do roteiro:', roteiro);
  
  // CRÍTICO: Padrões rigorosos para garantir detecção de 4 stories
  const strictStoryPatterns = [
    /Story\s*1[:\s-]+(.*?)(?=Story\s*2|$)/gis,
    /Story\s*2[:\s-]+(.*?)(?=Story\s*3|$)/gis,
    /Story\s*3[:\s-]+(.*?)(?=Story\s*4|$)/gis,
    /Story\s*4[:\s-]+(.*?)$/gis
  ];

  const slides: Stories10xSlide[] = [];
  const storyTypes: Array<'gancho' | 'erro' | 'virada' | 'cta'> = ['gancho', 'erro', 'virada', 'cta'];
  const storyTitles = [
    'Gancho Provocativo',
    'Erro Comum',
    'Virada + Dispositivo',
    'CTA + Antecipação'
  ];

  console.log('🚨 [Stories10xParser] VALIDAÇÃO CRÍTICA: Procurando por exatamente 4 stories...');

  // PRIMEIRO: Tentar padrões rigorosos
  strictStoryPatterns.forEach((pattern, index) => {
    const match = pattern.exec(roteiro);
    if (match && match[1]) {
      const rawContent = match[1].trim();
      const cleanedContent = cleanContent(rawContent);
      
      // Detectar dispositivos no conteúdo
      const dispositivos = detectarDispositivos(cleanedContent);
      
      slides.push({
        number: index + 1,
        titulo: storyTitles[index],
        conteudo: cleanedContent,
        dispositivo: dispositivos.length > 0 ? dispositivos.join(', ') : undefined,
        tempo: '10s',
        tipo: storyTypes[index]
      });
      
      console.log(`✅ [Stories10xParser] Story ${index + 1} detectado:`, {
        titulo: storyTitles[index],
        conteudo: cleanedContent.substring(0, 50) + '...',
        dispositivos
      });
    } else {
      console.warn(`⚠️ [Stories10xParser] Story ${index + 1} NÃO ENCONTRADO no padrão rigoroso`);
    }
  });

  // CRÍTICO: Se não encontrou exatamente 4, tentar padrões alternativos
  if (slides.length !== 4) {
    console.error(`❌ [Stories10xParser] PROBLEMA CRÍTICO: Encontrados ${slides.length} stories, esperados 4`);
    console.log('🔄 [Stories10xParser] Tentando padrões alternativos...');
    
    // Limpar slides anteriores e tentar novamente
    slides.length = 0;
    
    // Padrão alternativo mais flexível
    const alternativePatterns = [
      /(?:Story\s*1|Gancho)[:\s-]+(.*?)(?=(?:Story\s*2|Erro)|$)/gis,
      /(?:Story\s*2|Erro)[:\s-]+(.*?)(?=(?:Story\s*3|Virada)|$)/gis,
      /(?:Story\s*3|Virada)[:\s-]+(.*?)(?=(?:Story\s*4|CTA)|$)/gis,
      /(?:Story\s*4|CTA)[:\s-]+(.*?)$/gis
    ];

    alternativePatterns.forEach((pattern, index) => {
      const match = pattern.exec(roteiro);
      if (match && match[1]) {
        const rawContent = match[1].trim();
        const cleanedContent = cleanContent(rawContent);
        const dispositivos = detectarDispositivos(cleanedContent);
        
        slides.push({
          number: index + 1,
          titulo: storyTitles[index],
          conteudo: cleanedContent,
          dispositivo: dispositivos.length > 0 ? dispositivos.join(', ') : undefined,
          tempo: '10s',
          tipo: storyTypes[index]
        });
        
        console.log(`🔄 [Stories10xParser] Story ${index + 1} recuperado com padrão alternativo`);
      }
    });
  }

  // FALLBACK FINAL: Se ainda não tem 4, forçar criação
  if (slides.length !== 4) {
    console.error(`❌ [Stories10xParser] FALLBACK CRÍTICO: Ainda temos ${slides.length} stories, forçando 4`);
    return forceCreate4Stories(roteiro);
  }

  console.log(`✅ [Stories10xParser] SUCESSO: Parse concluído com exatamente ${slides.length} stories`);
  return slides;
};

const forceCreate4Stories = (roteiro: string): Stories10xSlide[] => {
  console.log('🚨 [Stories10xParser] FORÇANDO CRIAÇÃO DE 4 STORIES...');
  
  const cleanedRoteiro = cleanContent(roteiro);
  const words = cleanedRoteiro.split(' ').filter(word => word.trim() !== '');
  const slides: Stories10xSlide[] = [];
  
  // Dividir em 4 partes iguais
  const wordsPerStory = Math.ceil(words.length / 4);
  const storyTypes: Array<'gancho' | 'erro' | 'virada' | 'cta'> = ['gancho', 'erro', 'virada', 'cta'];
  const storyTitles = [
    'Gancho Provocativo',
    'Erro Comum', 
    'Virada + Dispositivo',
    'CTA + Antecipação'
  ];

  for (let i = 0; i < 4; i++) {
    const startIndex = i * wordsPerStory;
    const endIndex = Math.min(startIndex + wordsPerStory, words.length);
    const storyWords = words.slice(startIndex, endIndex);
    let content = storyWords.join(' ').trim();
    
    // Se conteúdo muito curto, usar fallback
    if (content.length < 20) {
      const fallbackContent = [
        'Você já se perguntou por que alguns resultados não aparecem? Vou te contar um segredo...',
        'O erro que 90% das pessoas cometem: acham que basta fazer o procedimento uma vez.',
        'Aqui está a virada: nossos equipamentos garantem resultados duradouros e naturais.',
        'Quer transformar sua vida? Agende sua consulta agora! 📲'
      ];
      content = fallbackContent[i];
    }
    
    const dispositivos = detectarDispositivos(content);
    
    slides.push({
      number: i + 1,
      titulo: storyTitles[i],
      conteudo: content,
      dispositivo: dispositivos.length > 0 ? dispositivos.join(', ') : undefined,
      tempo: '10s',
      tipo: storyTypes[i]
    });
    
    console.log(`🔧 [Stories10xParser] Story ${i + 1} FORÇADO criado:`, content.substring(0, 50) + '...');
  }

  console.log('✅ [Stories10xParser] FORÇAMENTO CONCLUÍDO: 4 stories garantidos');
  return slides;
};

const detectarDispositivos = (content: string): string[] => {
  const dispositivos: string[] = [];
  const contentLower = content.toLowerCase();

  // Detectar diferentes tipos de dispositivos
  if (contentLower.includes('foguinho') || contentLower.includes('🔥')) {
    dispositivos.push('Emoji Foguinho 🔥');
  }
  
  if (contentLower.includes('enquete') || contentLower.includes('pergunta:')) {
    dispositivos.push('Enquete 📊');
  }
  
  if (contentLower.includes('manda') && (contentLower.includes('comentário') || contentLower.includes('dm'))) {
    dispositivos.push('Reciprocidade 🔄');
  }
  
  if (contentLower.includes('compartilha') || contentLower.includes('marca um amigo')) {
    dispositivos.push('Compartilhamento 📲');
  }
  
  if (contentLower.includes('qual') && contentLower.includes('?')) {
    dispositivos.push('Pergunta Direta ❓');
  }

  return dispositivos;
};

// Utilitário para validar se o roteiro segue a metodologia Stories 10x
export const validateStories10x = (slides: Stories10xSlide[]): {
  isValid: boolean;
  issues: string[];
  score: number;
} => {
  const issues: string[] = [];
  let score = 0;

  // CRÍTICO: Validar número exato de stories
  if (slides.length !== 4) {
    issues.push(`CRÍTICO: Devem ser exatamente 4 stories (encontrados: ${slides.length})`);
    console.error(`❌ [validateStories10x] FALHA CRÍTICA: ${slides.length} stories encontrados, esperados 4`);
  } else {
    score += 40; // Peso maior para ter exatamente 4
    console.log('✅ [validateStories10x] 4 stories confirmados');
  }

  // Validar se cada story tem conteúdo substancial
  slides.forEach((slide, index) => {
    if (!slide.conteudo || slide.conteudo.trim() === '') {
      issues.push(`Story ${index + 1} está vazio`);
    } else if (slide.conteudo.length < 20) {
      issues.push(`Story ${index + 1} muito curto (menos de 20 caracteres)`);
    } else {
      score += 10; // 10 pontos por story com conteúdo adequado
    }
  });

  // Validar presença de dispositivos (crítico no Story 3)
  const story3 = slides.find(s => s.number === 3);
  if (story3 && !story3.dispositivo) {
    issues.push('Story 3 DEVE conter dispositivo de engajamento');
  } else if (story3?.dispositivo) {
    score += 20;
  }

  // Validar características específicas
  const story1 = slides.find(s => s.number === 1);
  if (story1 && !isProvocativeHook(story1.conteudo)) {
    issues.push('Story 1 deve ter gancho provocativo');
  } else if (story1) {
    score += 15;
  }

  const story4 = slides.find(s => s.number === 4);
  if (story4 && !hasCTA(story4.conteudo)) {
    issues.push('Story 4 deve conter call-to-action');
  } else if (story4) {
    score += 10;
  }

  return {
    isValid: issues.length === 0,
    issues,
    score: Math.min(score, 100)
  };
};

const isProvocativeHook = (content: string): boolean => {
  const provocativeWords = [
    'você', 'vocês', 'será que', 'imagine', 'já pensou',
    'por que', 'como', 'quando', 'onde', 'quem',
    'nunca', 'sempre', 'todo mundo', 'ninguém'
  ];
  
  const contentLower = content.toLowerCase();
  return provocativeWords.some(word => contentLower.includes(word)) ||
         content.includes('?') ||
         contentLower.includes('para');
};

const hasCTA = (content: string): boolean => {
  const ctaWords = [
    'compartilha', 'marca', 'manda', 'clica', 'acesse',
    'vem', 'vamos', 'bora', 'chama', 'liga',
    'agenda', 'agende', 'entre em contato'
  ];
  
  const contentLower = content.toLowerCase();
  return ctaWords.some(word => contentLower.includes(word));
};
