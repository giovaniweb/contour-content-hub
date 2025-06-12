
// Responsável por formatar a resposta do gerador de scripts

export interface ScriptResponse {
  id: string;
  content: string;
  title: string;
  type: string;
  createdAt: string;
  suggestedVideos: any[];
  suggestedMusic: any[];
  suggestedFonts: any[];
  captionTips: string[];
  // Novos campos para os 10 elementos
  elementos_aplicados?: {
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
  };
  mentor_utilizado?: string;
  especialidades_aplicadas?: string[];
}

export interface ScriptData {
  content: string;
  type: string;
  topic?: string;
  equipment?: string[];
  bodyArea?: string;
  mentor?: string;
  elementos_aplicados?: any;
}

export function generateTitle(content: string, topic?: string): string {
  // Gera um título a partir do conteúdo ou usa o tópico
  const firstLine = content.split('\n')[0].replace(/^#\s+/, '');
  return firstLine.length > 5 ? firstLine.slice(0, 50) : (topic || "Novo roteiro");
}

export function formatScriptResponse(data: ScriptData): ScriptResponse {
  const { content, type, topic, equipment, bodyArea, mentor, elementos_aplicados } = data;
  const scriptId = `script-${Date.now()}`;
  const title = generateTitle(content, topic);
  
  return {
    id: scriptId,
    content,
    title,
    type,
    createdAt: new Date().toISOString(),
    elementos_aplicados,
    mentor_utilizado: mentor,
    especialidades_aplicadas: getEspecialidadesByMentor(mentor || ""),
    suggestedVideos: [
      {
        id: "video-1",
        title: "Before/After Results",
        thumbnailUrl: "/placeholder.svg",
        duration: "0:45",
        type: "video",
        equipment: equipment || ["UltraSonic"],
        bodyArea: bodyArea ? [bodyArea] : ["Face"],
        purpose: ["Content creation"],
        rating: 4.5,
        isFavorite: false
      },
      {
        id: "video-2",
        title: "Treatment Process",
        thumbnailUrl: "/placeholder.svg",
        duration: "1:20",
        type: "video",
        equipment: equipment || ["Venus Freeze"],
        bodyArea: bodyArea ? [bodyArea] : ["Abdomen"],
        purpose: ["Education"],
        rating: 4.7,
        isFavorite: false
      }
    ],
    suggestedMusic: [
      {
        id: "music-1",
        title: "Upbeat Corporate",
        artist: "Audio Library",
        url: "/music/upbeat-corporate.mp3"
      },
      {
        id: "music-2",
        title: "Gentle Ambient",
        artist: "Sound Collection",
        url: "/music/gentle-ambient.mp3"
      }
    ],
    suggestedFonts: [
      {
        name: "Helvetica Neue",
        style: "Sans-serif"
      },
      {
        name: "Montserrat",
        style: "Sans-serif"
      }
    ],
    captionTips: [
      "✅ Storytelling aplicado com intensidade adequada",
      "✅ Copywriting persuasivo implementado",
      "✅ Conhecimento do público-alvo considerado",
      "✅ Gatilhos mentais estrategicamente posicionados",
      "✅ Headlines otimizados para engajamento",
      "✅ Ferramentas específicas incluídas (CTAs, etc.)"
    ]
  };
}

// Função auxiliar para especialidades (será implementada quando necessário)
function getEspecialidadesByMentor(mentor: string): string[] {
  const especialidades: Record<string, string[]> = {
    "Leandro Ladeira": ["escassez", "urgência", "gatilhos de conversão"],
    "Ícaro de Carvalho": ["narrativas pessoais", "posicionamento", "provocação"],
    "Paulo Cuenca": ["estética visual", "criatividade", "sensorial"],
    "Pedro Sobral": ["tráfego pago", "estrutura lógica", "performance"],
    "Camila Porto": ["didática", "simplicidade", "clareza"],
    "Hyeser Souza": ["humor viral", "ganchos populares", "trends"],
    "Washington Olivetto": ["big ideas", "branding memorável", "criatividade publicitária"],
    "John Kotter": ["liderança", "transformação", "estratégia"]
  };
  
  return especialidades[mentor] || [];
}
