
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
}

export interface ScriptData {
  content: string;
  type: string;
  topic?: string;
  equipment?: string[];
  bodyArea?: string;
}

export function generateTitle(content: string, topic?: string): string {
  // Gera um título a partir do conteúdo ou usa o tópico
  const firstLine = content.split('\n')[0].replace(/^#\s+/, '');
  return firstLine.length > 5 ? firstLine.slice(0, 50) : (topic || "Novo roteiro");
}

export function formatScriptResponse(data: ScriptData): ScriptResponse {
  const { content, type, topic, equipment, bodyArea } = data;
  const scriptId = `script-${Date.now()}`;
  const title = generateTitle(content, topic);
  
  return {
    id: scriptId,
    content,
    title,
    type,
    createdAt: new Date().toISOString(),
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
      "Mantenha as legendas curtas e objetivas",
      "Use emojis estrategicamente",
      "Inclua uma chamada para ação"
    ]
  };
}
