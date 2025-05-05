
// Types for handling CustomGPT generation requests

export interface EquipmentData {
  nome: string;
  tecnologia: string;
  indicacoes: string;
  beneficios: string;
  diferenciais: string;
  linguagem: string;
  ativo?: boolean;
  image_url?: string;
}

export interface CustomGptRequest {
  tipo: 'roteiro' | 'bigIdea' | 'stories';
  equipamento: string;
  equipamentoData?: EquipmentData;
  quantidade: number;
  tom?: string;
  estrategiaConteudo?: string;
  topic?: string;
  bodyArea?: string;
  purposes?: string[];
  additionalInfo?: string;
  marketingObjective?: string;
}

export interface ValidationResult {
  hookScore: number;
  clarityScore: number;
  ctaScore: number;
  emotionalScore: number;
  totalScore: number;
  suggestions: string[];
}

export interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}
