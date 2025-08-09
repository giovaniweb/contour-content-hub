
/**
 * Parser simples para roteiros temporais (ex: Reels, Stories) FluidaRoteirista
 * Separa cada bloco do tipo: [0-5s] Gancho: texto
 */
export interface TemporalScriptBlockData {
  time: string;
  label?: string;
  content: string;
}

export function parseTemporalScript(roteiro: string): TemporalScriptBlockData[] {
  if (!roteiro) return [];

  // Importa o calculador de tempo para usar tempo real quando necessário
  const { calculateContentTime } = require('@/utils/timeCalculator');

  // Primeiro, tenta formato antigo: **[TIPO - tempo]**
  const oldFormatRegex = /\*\*\[([^\]]+)\s*-\s*(\d+s?)\]\*\*\s*([^*]+?)(?=\*\*\[|$)/g;
  const oldFormatBlocks: TemporalScriptBlockData[] = [];
  
  let oldMatch: RegExpExecArray | null;
  while ((oldMatch = oldFormatRegex.exec(roteiro)) !== null) {
    const label = oldMatch[1]?.trim() || "";
    const time = oldMatch[2]?.trim() || "";
    const content = oldMatch[3]?.trim() || "";
    
    // Se o tempo for mocado (muito genérico), calcula o tempo real
    let finalTime = time;
    if (!time || time === "5s" || time === "10s") {
      const timeInfo = calculateContentTime(content);
      finalTime = timeInfo.displayTime;
    }
    
    oldFormatBlocks.push({
      time: finalTime,
      label,
      content,
    });
  }
  
  if (oldFormatBlocks.length > 0) {
    return oldFormatBlocks;
  }

  // Formato atual: [0-5s] Gancho: texto...
  const blockRegex = /\[(\d+\-\d+s)\]\s*([^\n:]+)?:?([^\[]+)?/g;
  const blocks: TemporalScriptBlockData[] = [];

  let match: RegExpExecArray | null;
  while ((match = blockRegex.exec(roteiro)) !== null) {
    const time = match[1]?.trim() || "";
    const rawLabel = match[2]?.trim();
    const content = match[3]?.trim() || "";
    
    // Calcula tempo real baseado no conteúdo se necessário
    let finalTime = time;
    if (!time) {
      const timeInfo = calculateContentTime(content);
      finalTime = timeInfo.displayTime;
    }
    
    blocks.push({
      time: finalTime,
      label: rawLabel || undefined,
      content,
    });
  }
  
  // Se não encontrou nenhum formato, força segmentação inteligente
  if (blocks.length === 0) {
    return createStructuredBlocks(roteiro);
  }
  return blocks;
}

// Nova função para criar blocos estruturados quando não há marcadores temporais
function createStructuredBlocks(roteiro: string): TemporalScriptBlockData[] {
  if (!roteiro.trim()) return [];
  
  const cleanText = roteiro.replace(/\s+/g, ' ').trim();
  
  // Define a estrutura clássica de vendas com tempos específicos
  const salesStructure = [
    { label: "GANCHO", time: "1-2s", keywords: ["você sabia", "imagine", "e se", "pare", "atenção", "?"], priority: 1 },
    { label: "PROBLEMA", time: "2-3s", keywords: ["problema", "dificuldade", "frustração", "celulite", "incomoda", "sofre"], priority: 2 },
    { label: "AGITAÇÃO", time: "2-3s", keywords: ["chega de", "cansada", "funciona?", "por que não", "frustrada"], priority: 3 },
    { label: "SOLUÇÃO", time: "4-6s", keywords: ["solução", "segredo", "tecnologia", "transforma", "consegue", "resultado"], priority: 4 },
    { label: "PROVA SOCIAL", time: "3-5s", keywords: ["estudo", "pesquisa", "comprovado", "eficaz", "%", "especialista"], priority: 5 },
    { label: "CTA", time: "2-3s", keywords: ["clique", "acesse", "link", "garanta", "vem", "vamos", "faça"], priority: 6 }
  ];
  
  // Quebra o texto em sentenças
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  if (sentences.length <= 1) {
    // Se tem apenas uma sentença longa, quebra por palavras
    const words = cleanText.split(' ');
    const chunks: string[] = [];
    let currentChunk = '';
    
    for (const word of words) {
      if (currentChunk.length + word.length > 100 && currentChunk.length > 30) {
        chunks.push(currentChunk.trim());
        currentChunk = word + ' ';
      } else {
        currentChunk += word + ' ';
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks.slice(0, 6).map((chunk, index) => {
      const structure = salesStructure[index] || salesStructure[salesStructure.length - 1];
      return {
        time: structure.time,
        label: structure.label,
        content: chunk
      };
    });
  }
  
  // Analisa cada sentença e associa ao tipo mais provável
  const analyzedSentences = sentences.map((sentence, index) => {
    const lower = sentence.toLowerCase();
    let bestMatch = salesStructure[0]; // Default: GANCHO
    let bestScore = 0;
    
    salesStructure.forEach(structure => {
      let score = 0;
      structure.keywords.forEach(keyword => {
        if (lower.includes(keyword)) {
          score += 10;
        }
      });
      
      // Bonus por posição (primeiro = gancho, último = CTA)
      if (structure.label === "GANCHO" && index === 0) score += 5;
      if (structure.label === "CTA" && index === sentences.length - 1) score += 5;
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = structure;
      }
    });
    
    return {
      sentence: sentence.trim(),
      structure: bestMatch,
      score: bestScore
    };
  });
  
  // Agrupa sentenças similares e cria blocos
  const grouped = new Map<string, { sentences: string[], structure: any }>();
  
  analyzedSentences.forEach(item => {
    const key = item.structure.label;
    if (!grouped.has(key)) {
      grouped.set(key, { sentences: [], structure: item.structure });
    }
    grouped.get(key)!.sentences.push(item.sentence);
  });
  
  // Converte para array ordenado pela prioridade
  const orderedBlocks = Array.from(grouped.entries())
    .sort(([,a], [,b]) => a.structure.priority - b.structure.priority)
    .map(([label, data]) => ({
      time: data.structure.time,
      label,
      content: data.sentences.join('. ').trim()
    }));
  
  // Garante pelo menos 3 blocos e máximo 6
  if (orderedBlocks.length < 3) {
    // Se tem poucos blocos, divide o maior
    const largest = orderedBlocks.reduce((prev, current) => 
      prev.content.length > current.content.length ? prev : current
    );
    
    const largestIndex = orderedBlocks.indexOf(largest);
    const words = largest.content.split(' ');
    const mid = Math.floor(words.length / 2);
    
    orderedBlocks[largestIndex] = {
      ...largest,
      content: words.slice(0, mid).join(' ')
    };
    
    orderedBlocks.splice(largestIndex + 1, 0, {
      time: "2-3s",
      label: "DESENVOLVIMENTO",
      content: words.slice(mid).join(' ')
    });
  }
  
  return orderedBlocks.slice(0, 6);
}
