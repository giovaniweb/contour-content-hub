
// Elementos universais dos mentores para a edge function

export interface ElementosUniversais {
  storytelling: number;
  copywriting: number;
  conhecimento_publico: number;
  analises_dados: number;
  gatilhos_mentais: number;
  logica_argumentativa: number;
  premissas_educativas: number;
  mapas_empatia: number;
  headlines: number;
  ferramentas_especificas: number;
}

const MENTORES_ELEMENTOS: Record<string, ElementosUniversais> = {
  "Leandro Ladeira": {
    storytelling: 9,
    copywriting: 10,
    conhecimento_publico: 10,
    analises_dados: 9,
    gatilhos_mentais: 10,
    logica_argumentativa: 9,
    premissas_educativas: 8,
    mapas_empatia: 8,
    headlines: 10,
    ferramentas_especificas: 10
  }
};

const MENTORES_ESPECIALIDADES: Record<string, string[]> = {
  "Leandro Ladeira": ["escassez", "urgência", "gatilhos de conversão", "funis de venda", "autoridade"]
};

export function getElementosUniversaisByMentor(mentorNome: string): ElementosUniversais | null {
  return MENTORES_ELEMENTOS[mentorNome] || MENTORES_ELEMENTOS["Leandro Ladeira"];
}

export function getEspecialidadesByMentor(mentorNome: string): string[] {
  return MENTORES_ESPECIALIDADES[mentorNome] || MENTORES_ESPECIALIDADES["Leandro Ladeira"];
}
