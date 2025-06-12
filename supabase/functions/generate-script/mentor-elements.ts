
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
  },
  "Ícaro de Carvalho": {
    storytelling: 10,
    copywriting: 9,
    conhecimento_publico: 8,
    analises_dados: 6,
    gatilhos_mentais: 7,
    logica_argumentativa: 8,
    premissas_educativas: 9,
    mapas_empatia: 10,
    headlines: 8,
    ferramentas_especificas: 7
  },
  "Paulo Cuenca": {
    storytelling: 9,
    copywriting: 8,
    conhecimento_publico: 7,
    analises_dados: 6,
    gatilhos_mentais: 6,
    logica_argumentativa: 7,
    premissas_educativas: 8,
    mapas_empatia: 9,
    headlines: 10,
    ferramentas_especificas: 9
  },
  "Pedro Sobral": {
    storytelling: 6,
    copywriting: 9,
    conhecimento_publico: 9,
    analises_dados: 10,
    gatilhos_mentais: 8,
    logica_argumentativa: 10,
    premissas_educativas: 9,
    mapas_empatia: 7,
    headlines: 8,
    ferramentas_especificas: 10
  },
  "Camila Porto": {
    storytelling: 7,
    copywriting: 8,
    conhecimento_publico: 8,
    analises_dados: 7,
    gatilhos_mentais: 6,
    logica_argumentativa: 9,
    premissas_educativas: 10,
    mapas_empatia: 8,
    headlines: 7,
    ferramentas_especificas: 8
  },
  "Hyeser Souza": {
    storytelling: 8,
    copywriting: 7,
    conhecimento_publico: 9,
    analises_dados: 5,
    gatilhos_mentais: 9,
    logica_argumentativa: 6,
    premissas_educativas: 5,
    mapas_empatia: 9,
    headlines: 10,
    ferramentas_especificas: 7
  },
  "Washington Olivetto": {
    storytelling: 9,
    copywriting: 10,
    conhecimento_publico: 8,
    analises_dados: 7,
    gatilhos_mentais: 8,
    logica_argumentativa: 8,
    premissas_educativas: 7,
    mapas_empatia: 9,
    headlines: 10,
    ferramentas_especificas: 8
  },
  "John Kotter": {
    storytelling: 8,
    copywriting: 8,
    conhecimento_publico: 9,
    analises_dados: 9,
    gatilhos_mentais: 7,
    logica_argumentativa: 10,
    premissas_educativas: 9,
    mapas_empatia: 8,
    headlines: 7,
    ferramentas_especificas: 8
  }
};

const MENTORES_ESPECIALIDADES: Record<string, string[]> = {
  "Leandro Ladeira": ["escassez", "urgência", "gatilhos de conversão", "funis de venda", "autoridade"],
  "Ícaro de Carvalho": ["narrativas pessoais", "posicionamento", "provocação", "autoridade", "reflexão"],
  "Paulo Cuenca": ["estética visual", "ritmo audiovisual", "criatividade", "sensorial", "artístico"],
  "Pedro Sobral": ["tráfego pago", "CPL", "estrutura lógica", "performance", "ROI"],
  "Camila Porto": ["didática", "simplicidade", "passo a passo", "iniciantes", "clareza"],
  "Hyeser Souza": ["humor viral", "linguagem de rua", "ganchos populares", "trends", "espontaneidade"],
  "Washington Olivetto": ["big ideas", "branding memorável", "frases icônicas", "criatividade publicitária", "conquista"],
  "John Kotter": ["liderança", "transformação", "estratégia", "mudança organizacional", "visão"]
};

export function getElementosUniversaisByMentor(mentorNome: string): ElementosUniversais | null {
  return MENTORES_ELEMENTOS[mentorNome] || null;
}

export function getEspecialidadesByMentor(mentorNome: string): string[] {
  return MENTORES_ESPECIALIDADES[mentorNome] || [];
}
