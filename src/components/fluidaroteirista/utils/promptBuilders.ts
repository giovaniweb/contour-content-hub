
import { getMentorTechniques, selectBestTechnique, integrateSpecificTechnique } from './techniqueSelector';

export const buildSystemPrompt = async (
  equipmentDetails: any[], 
  mode: string, 
  mentor: string,
  options: {
    canal: string;
    formato: string;
    objetivo: string;
    estilo: string;
  }
): Promise<string> => {
  console.log('🔨 [promptBuilders] Construindo prompt do sistema');
  console.log('📝 [promptBuilders] Formato recebido:', options.formato);
  
  // CORREÇÃO CRÍTICA: Converter mentor key para nome real do banco
  const mentorNomeReal = convertMentorKeyToRealName(mentor);
  console.log(`🎯 [promptBuilders] Mentor convertido: ${mentor} -> ${mentorNomeReal}`);
  
  // CORREÇÃO: Normalizar formato para busca de técnicas, mas preservar original
  const formatoNormalizado = normalizeFormatoForTechniques(options.formato);
  console.log(`📝 [promptBuilders] Formato normalizado: ${options.formato} -> ${formatoNormalizado}`);
  
  // Buscar técnicas específicas do mentor
  const mentorTechniques = await getMentorTechniques(mentorNomeReal);
  console.log(`🎯 [promptBuilders] Técnicas encontradas para ${mentorNomeReal}:`, mentorTechniques.length);
  
  // Selecionar melhor técnica baseada no formato e objetivo
  const selectedTechnique = selectBestTechnique(mentorTechniques, formatoNormalizado, options.objetivo);
  
  if (selectedTechnique) {
    console.log(`✨ [promptBuilders] Técnica selecionada: ${selectedTechnique.nome}`);
    console.log(`🎯 [promptBuilders] Usando técnica específica para formato: ${options.formato}`);
    // Se há técnica específica, usar prompt dedicado
    return buildSpecificTechniquePrompt(selectedTechnique, equipmentDetails, options);
  }
  
  console.log('📝 [promptBuilders] Usando prompt genérico do mentor');
  // Fallback para prompt genérico
  return buildGenericMentorPrompt(mentorNomeReal, equipmentDetails, mode, options);
};

// CORREÇÃO: Melhorar normalização para preservar especificidade do stories_10x
const normalizeFormatoForTechniques = (formato: string): string => {
  // Mapear formatos para valores que existem nas técnicas
  const formatMapping: Record<string, string> = {
    'stories_10x': 'stories', // Buscar técnicas de stories, mas preservar original
    'reels': 'stories',
    'tiktok': 'stories',
    'youtube_shorts': 'stories',
    'youtube_video': 'stories',
    'ads_video': 'stories',
    'ads_estatico': 'imagem',
    'carrossel': 'carrossel',
    'imagem': 'imagem'
  };
  
  return formatMapping[formato] || formato;
};

// CORREÇÃO: Converter chave do mentor para nome real do banco
const convertMentorKeyToRealName = (mentorKey: string): string => {
  const mentorMapping: Record<string, string> = {
    'leandro_ladeira': 'Leandro Ladeira',
    'paulo_cuenca': 'Paulo Cuenca',
    'pedro_sobral': 'Pedro Sobral',
    'icaro_carvalho': 'Ícaro de Carvalho',
    'camila_porto': 'Camila Porto',
    'hyeser_souza': 'Hyeser Souza',
    'washington_olivetto': 'Washington Olivetto'
  };
  
  return mentorMapping[mentorKey] || mentorKey;
};

const buildSpecificTechniquePrompt = (
  technique: any,
  equipmentDetails: any[],
  options: {
    canal: string;
    formato: string;
    objetivo: string;
    estilo: string;
  }
): string => {
  const equipmentContext = equipmentDetails.length > 0 
    ? `🚨 EQUIPAMENTOS OBRIGATÓRIOS (MENCIONE TODOS):
${equipmentDetails.map((eq, index) => `${index + 1}. ${eq.nome}: ${eq.tecnologia}
   - Benefícios: ${eq.beneficios}
   - Diferenciais: ${eq.diferenciais}`).join('\n')}

🔥 REGRA CRÍTICA: O roteiro DEVE mencionar ESPECIFICAMENTE cada um destes equipamentos pelo nome.`
    : '';

  // CORREÇÃO CRÍTICA: Usar o prompt da técnica diretamente
  let promptTecnica = technique.prompt;
  
  // Substituir placeholders se existirem
  if (promptTecnica.includes('[TEMA_INSERIDO]')) {
    promptTecnica = promptTecnica.replace('[TEMA_INSERIDO]', 'o tema será fornecido pelo usuário');
  }

  // CORREÇÃO CRÍTICA: Prompt específico e estruturado para Stories 10x
  const stories10xStructure = options.formato === 'stories_10x' 
    ? `
🎯 FORMATO STORIES 10X - ESTRUTURA OBRIGATÓRIA:

Retorne EXATAMENTE neste formato JSON:
{
  "roteiro": "Story 1: [Título do Gancho]
[Conteúdo do gancho provocativo em 1-2 frases]

Story 2: [Título do Problema]  
[Apresente o problema/erro comum em 1-2 frases]

Story 3: [Título da Solução]
[Mostre a solução usando os equipamentos específicos]

Story 4: [Título do CTA]
[Call-to-action claro e direto]

Story 5: [Título do Bônus] (OPCIONAL)
[Informação extra ou antecipação]",
  "formato": "stories_10x",
  "emocao_central": "urgência",
  "intencao": "atrair",
  "objetivo": "Gerar interesse e ação",
  "mentor": "${technique.mentor || 'Leandro Ladeira'}"
}

🚨 REGRAS CRÍTICAS PARA STORIES 10X:
- SEMPRE numere os stories: "Story 1:", "Story 2:", etc.
- Máximo 10 segundos por story (texto curto e direto)
- Cada story deve ter título e conteúdo separados por quebra de linha
- Stories 1-4 são OBRIGATÓRIOS, Story 5 é opcional
- Use linguagem urgente e persuasiva
- Mencione equipamentos específicos no Story 3
` : '';

  return `🎯 TÉCNICA ESPECÍFICA ATIVADA: ${technique.nome}

${stories10xStructure}

${promptTecnica}

${equipmentContext}

CONTEXTO ADICIONAL:
- Canal: ${options.canal}
- Formato: ${options.formato}
- Objetivo: ${options.objetivo}
- Estilo: ${options.estilo}

IMPORTANTE: Use EXCLUSIVAMENTE a técnica específica acima. ${options.formato === 'stories_10x' ? 'Para Stories 10x, siga RIGOROSAMENTE a estrutura JSON especificada.' : 'Ignore instruções genéricas e foque na metodologia detalhada da técnica.'}`;
};

const buildGenericMentorPrompt = (
  mentor: string,
  equipmentDetails: any[],
  mode: string,
  options: {
    canal: string;
    formato: string;
    objetivo: string;
    estilo: string;
  }
): string => {
  const equipmentEmphasis = equipmentDetails.length > 0 
    ? `🚨 EQUIPAMENTOS OBRIGATÓRIOS (MENCIONE TODOS):
${equipmentDetails.map((eq, index) => `${index + 1}. ${eq.nome}: ${eq.tecnologia}
   - Benefícios: ${eq.beneficios}
   - Diferenciais: ${eq.diferenciais}`).join('\n')}

🔥 REGRA CRÍTICA: O roteiro DEVE mencionar ESPECIFICAMENTE cada um destes equipamentos pelo nome.`
    : 'Nenhum equipamento específico foi selecionado. Use termos genéricos.';

  // CORREÇÃO CRÍTICA: Estrutura específica para Stories 10x
  const stories10xStructure = options.formato === 'stories_10x' 
    ? `
🎯 FORMATO STORIES 10X - ESTRUTURA OBRIGATÓRIA:

Retorne EXATAMENTE neste formato JSON:
{
  "roteiro": "Story 1: [Título do Gancho]
[Conteúdo do gancho provocativo em 1-2 frases]

Story 2: [Título do Problema]  
[Apresente o problema/erro comum em 1-2 frases]

Story 3: [Título da Solução]
[Mostre a solução usando os equipamentos específicos]

Story 4: [Título do CTA]
[Call-to-action claro e direto]

Story 5: [Título do Bônus] (OPCIONAL)
[Informação extra ou antecipação]",
  "formato": "stories_10x",
  "emocao_central": "urgência",
  "intencao": "atrair",
  "objetivo": "Gerar interesse e ação",
  "mentor": "${mentor}"
}

🚨 REGRAS CRÍTICAS PARA STORIES 10X:
- SEMPRE numere os stories: "Story 1:", "Story 2:", etc.
- Máximo 10 segundos por story (texto curto e direto)
- Cada story deve ter título e conteúdo separados por quebra de linha
- Stories 1-4 são OBRIGATÓRIOS, Story 5 é opcional
- Use linguagem urgente e persuasiva
- Mencione equipamentos específicos no Story 3
` : `
ESTRUTURA OBRIGATÓRIA:
1. Gancho (capturar atenção)
2. Conflito (apresentar problema)
3. Virada (mostrar solução com equipamentos específicos)
4. CTA (chamada para ação)

Retorne APENAS JSON válido:
{
  "roteiro": "Conteúdo do roteiro",
  "formato": "${options.formato}",
  "emocao_central": "esperança/confiança/urgência/etc",
  "intencao": "atrair/vender/educar/conectar",
  "objetivo": "Objetivo específico do post",
  "mentor": "${mentor}"
}`;

  return `Você é o FLUIDAROTEIRISTA especializado no estilo ${mentor}.

MODO: ${mode.toUpperCase()}
MENTOR: ${mentor}

${stories10xStructure}

${equipmentEmphasis}

CONTEXTO:
- Canal: ${options.canal}
- Formato: ${options.formato}
- Objetivo: ${options.objetivo}
- Estilo: ${options.estilo}`;
};

export const buildDisneyPrompt = (originalScript: string, formato: string): string => {
  return `🏰 TRANSFORMAÇÃO DISNEY 1928

Você é Walt Disney em 1928, criando narrativas mágicas e emocionais.
Transforme o roteiro usando a estrutura clássica Disney:

🏰 Era uma vez... (situação inicial que gera identificação)
⚡ Até que um dia... (conflito/problema que muda tudo)
✨ Então ela descobriu... (solução mágica/transformação)
🌟 E eles viveram felizes... (resultado final inspirador)

Adicione:
- Elemento Disney Único (metáfora mágica)
- Lição Universal (aprendizado inspirador)
- Assinatura Disney 1928 (frase motivacional final)

Roteiro original:
${originalScript}

Mantenha o mesmo objetivo comercial, mas com alma emocional Disney.
Formato: ${formato}

Retorne JSON:
{
  "roteiro": "Roteiro transformado com magia Disney",
  "disney_applied": true,
  "emocao_central": "encantamento",
  "elemento_disney": "Descrição do elemento mágico usado",
  "licao_universal": "Aprendizado inspirador"
}`;
};
