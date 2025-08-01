// P2-001: Prompts otimizados para reduzir tokens e custos
export const OptimizedPrompts = {
  // System prompt otimizado (reduzido de ~500 para ~200 tokens)
  system: `CONSULTOR FLUIDA - Diagnósticos para clínicas estéticas/médicas.

ESTRUTURA OBRIGATÓRIA:
📊 Diagnóstico | 💡 Conteúdo | 📅 Plano 4 Semanas | 🎨 Marca | 🧩 Enigma | 📈 Insights

Linguagem: Médica=técnica, Estética=emocional. Seja conciso.`,

  // User prompt otimizado (reduzido de ~300 para ~100 tokens)
  userTemplate: (data: any) => {
    const tipo = data.clinicType === 'clinica_medica' ? 'MED' : 'EST';
    const key = tipo === 'MED' ? 'medical' : 'aesthetic';
    
    return `Tipo: ${tipo}
Esp: ${data[`${key}Specialty`] || data[`${key}Focus`] || 'N/A'}
Equip: ${data[`${key}Equipments`] || 'N/A'}
Ticket: ${data[`${key}Ticket`] || 'N/A'}
Meta: ${data.revenueGoal || 'N/A'}
Público: ${data.targetAudience || 'N/A'}

Gere diagnóstico com 6 seções.`;
  },

  // Prompt de validação de script otimizado
  scriptValidation: `Analise roteiro usando método Disney:
- Gancho: capta atenção?
- Conflito: problema claro?
- Virada: solução convincente?
- CTA: chamada clara?

Nota 0-10 cada item. Máximo 3 sugestões.`,

  // Prompt de geração de roteiro otimizado
  scriptGeneration: (params: any) => {
    return `Roteiro ${params.formato} - ${params.objetivo}
Tema: ${params.tema}
Equip: ${params.equipamentos?.slice(0, 2).join(', ') || 'N/A'}
Tom: ${params.mentor}

Estrutura: Gancho > Problema > Solução > CTA
Max 200 palavras.`;
  }
};

// Configurações de token para otimização
export const TokenConfig = {
  maxTokens: {
    marketing: 1500,    // Reduzido de 4000
    script: 800,        // Reduzido de 2000  
    validation: 500     // Reduzido de 1000
  },
  
  temperature: {
    marketing: 0.6,     // Reduzido de 0.7
    script: 0.8,        // Mantido criativo
    validation: 0.3     // Reduzido para consistência
  }
};

// Função para truncar contexto se necessário
export const truncateContext = (text: string, maxTokens: number): string => {
  // Estimativa: 1 token ≈ 4 caracteres em português
  const maxChars = maxTokens * 4;
  
  if (text.length <= maxChars) return text;
  
  // Truncar mantendo palavras completas
  const truncated = text.substring(0, maxChars);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated;
};

// Estimador de custos
export const estimateCost = (promptTokens: number, completionTokens: number) => {
  // Preços GPT-4.1-2025-04-14 (aproximados em USD)
  const inputCost = (promptTokens / 1000) * 0.00250;   // $2.50 per 1K input tokens
  const outputCost = (completionTokens / 1000) * 0.01000; // $10.00 per 1K output tokens
  
  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
    totalTokens: promptTokens + completionTokens
  };
};