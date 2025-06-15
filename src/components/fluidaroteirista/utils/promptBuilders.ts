import { FORMATO_CONFIGS } from '../constants/intentionTree';
import { getMentorReference } from './mentorReferences';

export const buildSystemPrompt = (
  equipmentDetails: any[],
  modo: string,
  mentor: string,
  dados: any
): string => {
  const { canal, formato, objetivo, estilo, metodologia } = dados;
  let mentorReference = '';
  let extraInstructions = '';

  // usar nomes e métodos seguros
  if(metodologia === "Copy Viral") {
    extraInstructions = `
MÉTODO Copy Viral (Estrutura rápida de viralização):
1. Defina o público-alvo
2. Temas principais, limites, objetivo
3. Formato: Carrossel, Reels, Post, Stories, TikTok
4. Tom de voz: educativo/direto...

ESTRUTURA:
- Gancho forte (até 3s)
- Desenvolvimento (pontos principais alinhados ao objetivo)
- CTA clara (engajamento ou conversão)
- Roteiro objetivo e pronto para gravar, aprox. 40s.
- Linguagem acessível e persuasiva.
`;
    mentorReference = "Mentor da Viralização";
  } else if(metodologia === "Copy Up") {
    extraInstructions = `
MÉTODO Copy Up (Storytelling direto para conversão):

- Gancho impactante
- História real e emocional
- Prova concreta
- Comando claro (CTA direto)
- Gatilho de expectativa
- Analogias criativas
- Bordão/frase de efeito

Tom: direto, vendedor e emocional, com CTA forte.
Evite linguagem técnica/fria/genérica.
`;
    mentorReference = "Mentor do Storytelling";
  } else if(metodologia === "Stories Magnético") {
    extraInstructions = `
MÉTODO Stories Magnético:
- Exatamente 4 stories conectados
- Máxima de 40 segundos total
- Narrativa e engajamento alto
- Tom: provocativo, emocional, inteligente

ESTRUTURA:
  1. Gancho provocativo
  2. Erro comum + identificação
  3. Virada (solução + engajamento)
  4. CTA suave + antecipação
`;
    mentorReference = "Mentor do Storytelling";
  } else {
    mentorReference = "Mentor da Viralização";
  }

  // Obter configurações do formato
  const formatConfig = FORMATO_CONFIGS[formato] || {};
  const tempoLimite = formatConfig.tempo_limite_segundos;
  const palavrasMax = formatConfig.palavras_max;
  const estrutura = formatConfig.estrutura;

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
    Você é o FLUIDAROTEIRISTA — roteirista especializado em ${canal?.toUpperCase() || 'INSTAGRAM'}.
    Sua persona criativa é: ${mentorReference}

    ${extraInstructions}
    
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
    📱 INSTAGRAM STORIES - INSTRUÇÕES:
    - Máximo 60 segundos total (15s por card)
    - 4 cards máximo
    - Texto grande e legível no mobile
    - Call-to-action no último card
    - Use linguagem casual e direta
    ${tempoLimite ? `- Tempo total: ${tempoLimite}s` : ''}
    `,

    stories_10x: `
    🔥 STORIES 10X - METODOLOGIA LEANDRO LADEIRA:
    
    📊 ESPECIFICAÇÕES TÉCNICAS:
    - EXATAMENTE 4 stories conectados
    - MÁXIMO 40 segundos total (10s por story)
    - Sequência narrativa com dispositivos de engajamento
    - Tom: provocativo, inteligente, engraçado (estilo Leandro Ladeira)
    
    🎯 ESTRUTURA OBRIGATÓRIA STORIES 10X:
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
    Retorne JSON:
    {
      "roteiro": "Card 1: [texto]\nCard 2: [texto]\nCard 3: [texto]\nCard 4: [CTA]",
      "formato": "stories",
      "cards_total": 4,
      "tempo_por_card": "15s",
      "sugestao_visual": "Descrição visual para cada card"
    }
    `,

    stories_10x: `
    🔥 STORIES 10X - OUTPUT OBRIGATÓRIO:
    Retorne JSON:
    {
      "roteiro": "Story 1: [Gancho provocativo - 10s]\n[Dispositivo incluído: emoji/enquete/pergunta]\n\nStory 2: [Erro comum + identificação - 10s]\n[Tom humorístico e identificação]\n\nStory 3: [Virada + dispositivo de engajamento - 10s]\n[OBRIGATÓRIO: dispositivo 🔥/📊/❓ + equipamentos se selecionados]\n\nStory 4: [CTA suave + antecipação - 10s]\n[Compartilhamento/reciprocidade]",
      "formato": "stories_10x",
      "metodologia": "leandro_ladeira",
      "stories_total": 4,
      "tempo_total": "40s",
      "dispositivos_usados": ["emoji_foguinho", "enquete", "pergunta", "reciprocidade"],
      "tom_narrativo": "provocativo_inteligente",
      "engajamento_esperado": "alto"
    }
    
    VALIDAÇÃO STORIES 10X:
    - Verificar se tem EXATAMENTE 4 stories
    - Confirmar tempo total máximo 40s (10s por story)
    - Validar se pelo menos 2 dispositivos foram incluídos
    - Checar tom provocativo mas educativo
    - Se equipamentos selecionados: DEVEM aparecer no Story 3
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
