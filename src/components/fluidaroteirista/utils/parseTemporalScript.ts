
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

  // Regex para blocos: [0-5s] Gancho: texto...
  const blockRegex = /\[(\d+\-\d+s)\]\s*([^\n:]+)?:?([^\[]+)?/g;
  const blocks: TemporalScriptBlockData[] = [];

  let match: RegExpExecArray | null;
  while ((match = blockRegex.exec(roteiro)) !== null) {
    const time = match[1]?.trim() || "";
    const rawLabel = match[2]?.trim();
    const content = match[3]?.trim() || "";
    blocks.push({
      time,
      label: rawLabel || undefined,
      content,
    });
  }
  // Fallback: se não encontrar padrão, retorna tudo no bloco único
  if (blocks.length === 0) {
    return [{
      time: "",
      content: roteiro
    }];
  }
  return blocks;
}
