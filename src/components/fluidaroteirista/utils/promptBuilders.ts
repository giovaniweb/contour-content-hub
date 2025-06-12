
import { FORMATO_CONFIGS } from '../constants/intentionTree';

export const buildSystemPrompt = (equipmentDetails: any[], modo: string, mentor: string, dados: any): string => {
  const { canal, formato, objetivo, estilo } = dados;
  
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
    - Use os nomes EXATOS dos equipamentos
    - Integre as tecnologias e benefícios específicos
    - NUNCA substitua por outros equipamentos
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
    - Mentor: ${mentor}
    
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
    
    carrossel: `
    🎠 CARROSSEL INSTAGRAM - INSTRUÇÕES:
    - 3-8 slides educativos
    - Máximo 25 palavras por slide
    - Primeiro slide: gancho forte
    - Slides intermediários: desenvolvimento
    - Último slide: CTA e conclusão
    - Formato: Card 1, Card 2, etc.
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
    - Roteiro para 40 segundos máximo
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
    
    carrossel: `
    Retorne JSON:
    {
      "roteiro": "Slide 1: Título\nSlide 2: Desenvolvimento...",
      "formato": "carrossel", 
      "slides_total": 5,
      "sugestao_visual": "Descrição visual para cada slide"
    }
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
      "roteiro": "[0-3s] Hook\n[3-30s] Conteúdo\n[30-40s] CTA",
      "formato": "short",
      "tempo_total": "40s", 
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
    - Preserve equipamentos mencionados
    
    PARTE 3 - Magia Sutil:
    - NÃO use "Era uma vez"
    - Adicione elemento de surpresa
    - Crie momento emocional
    - Final inesquecível
    
    Retorne apenas o roteiro transformado em JSON:
    {
      "roteiro": "Roteiro com magia Disney sutil",
      "disney_applied": true
    }
  `;
};
