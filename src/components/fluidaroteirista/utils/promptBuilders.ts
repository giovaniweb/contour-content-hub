
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
  
  // Buscar técnicas específicas do mentor
  const mentorTechniques = await getMentorTechniques(mentor);
  console.log(`🎯 [promptBuilders] Técnicas encontradas para ${mentor}:`, mentorTechniques.length);
  
  // Selecionar melhor técnica baseada no formato e objetivo
  const selectedTechnique = selectBestTechnique(mentorTechniques, options.formato, options.objetivo);
  
  if (selectedTechnique) {
    console.log(`✨ [promptBuilders] Técnica selecionada: ${selectedTechnique.nome}`);
    // Se há técnica específica, usar prompt dedicado
    return buildSpecificTechniquePrompt(selectedTechnique, equipmentDetails, options);
  }
  
  console.log('📝 [promptBuilders] Usando prompt genérico do mentor');
  // Fallback para prompt genérico
  return buildGenericMentorPrompt(mentor, equipmentDetails, mode, options);
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

  return `🎯 TÉCNICA ESPECÍFICA ATIVADA: ${technique.nome}

${technique.prompt}

${equipmentContext}

CONTEXTO ADICIONAL:
- Canal: ${options.canal}
- Formato: ${options.formato}
- Objetivo: ${options.objetivo}
- Estilo: ${options.estilo}

IMPORTANTE: Use EXCLUSIVAMENTE a técnica específica acima. Ignore instruções genéricas e foque na metodologia detalhada da técnica.`;
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

  return `Você é o FLUIDAROTEIRISTA especializado no estilo ${mentor}.

MODO: ${mode.toUpperCase()}
MENTOR: ${mentor}

${equipmentEmphasis}

CONTEXTO:
- Canal: ${options.canal}
- Formato: ${options.formato}
- Objetivo: ${options.objetivo}
- Estilo: ${options.estilo}

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
