
export interface MediaItem {
  id: string;
  title: string;
  type: string; // "video", "arte", "artigo", "documentacao", "video_pronto", "take", "image"
  thumbnailUrl: string;
  duration?: string;
  viewCount: number;
  downloadCount: number;
  rating: number;
  equipment: string[];
  purpose: string[];
  description?: string;
  url: string;
  featured: boolean;
  isFavorite: boolean;
}

// Generate placeholders with Unsplash images for demo
export const mockMediaItems: MediaItem[] = [
  {
    id: "video-1",
    title: "Como usar o Ultrassom Focalizado para redução de gordura localizada",
    type: "video",
    thumbnailUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&auto=format&fit=crop",
    duration: "12:34",
    viewCount: 1257,
    downloadCount: 324,
    rating: 4.7,
    equipment: ["Ultrassom Focalizado", "HIFU"],
    purpose: ["Educacional", "Explicativo", "Tratamento"],
    description: "Vídeo explicativo sobre o uso do Ultrassom Focalizado para redução de gordura localizada.",
    url: "https://example.com/video/1",
    featured: true,
    isFavorite: false
  },
  {
    id: "video-2",
    title: "Tratamento para flacidez facial com radiofrequência",
    type: "video",
    thumbnailUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop",
    duration: "08:22",
    viewCount: 985,
    downloadCount: 201,
    rating: 4.5,
    equipment: ["Radiofrequência"],
    purpose: ["Demonstração", "Procedimento"],
    description: "Demonstração do tratamento para flacidez facial com radiofrequência.",
    url: "https://example.com/video/2",
    featured: true,
    isFavorite: true
  },
  {
    id: "video-3",
    title: "Aplicação de toxina botulínica para rugas de expressão",
    type: "video",
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop",
    duration: "05:47",
    viewCount: 756,
    downloadCount: 189,
    rating: 4.3,
    equipment: ["Toxina Botulínica"],
    purpose: ["Procedimento", "Treinamento"],
    url: "https://example.com/video/3",
    featured: false,
    isFavorite: false
  },
  {
    id: "video-4",
    title: "Conceitos básicos de bioestimuladores de colágeno",
    type: "video",
    thumbnailUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop",
    duration: "15:10",
    viewCount: 1102,
    downloadCount: 267,
    rating: 4.8,
    equipment: ["Bioestimuladores"],
    purpose: ["Educacional", "Conceitos"],
    url: "https://example.com/video/4",
    featured: false,
    isFavorite: true
  },
  {
    id: "arte-1",
    title: "Infográfico: Resultados do tratamento com Ultraformer",
    type: "arte",
    thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop",
    viewCount: 432,
    downloadCount: 98,
    rating: 4.2,
    equipment: ["Ultraformer"],
    purpose: ["Marketing", "Explicativo"],
    url: "https://example.com/arte/1",
    featured: true,
    isFavorite: false
  },
  {
    id: "arte-2",
    title: "Design para post no Instagram sobre limpeza de pele",
    type: "arte",
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop",
    viewCount: 356,
    downloadCount: 122,
    rating: 4.6,
    equipment: ["Equipamento de Limpeza"],
    purpose: ["Social Media", "Marketing"],
    url: "https://example.com/arte/2",
    featured: true,
    isFavorite: true
  },
  {
    id: "arte-3",
    title: "Banner para site: Promoção de pacotes de tratamento",
    type: "arte",
    thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop",
    viewCount: 287,
    downloadCount: 76,
    rating: 3.9,
    equipment: ["Múltiplos"],
    purpose: ["Website", "Promoção"],
    url: "https://example.com/arte/3",
    featured: false,
    isFavorite: false
  },
  {
    id: "arte-4",
    title: "Design para Stories: Antes e depois de preenchimento labial",
    type: "arte",
    thumbnailUrl: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=800&auto=format&fit=crop",
    viewCount: 521,
    downloadCount: 134,
    rating: 4.4,
    equipment: ["Ácido Hialurônico"],
    purpose: ["Social Media", "Resultados"],
    url: "https://example.com/arte/4",
    featured: false,
    isFavorite: true
  },
  {
    id: "doc-1",
    title: "Manual técnico completo do equipamento Ultraformer III",
    type: "documentacao",
    thumbnailUrl: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800&auto=format&fit=crop",
    viewCount: 321,
    downloadCount: 154,
    rating: 4.9,
    equipment: ["Ultraformer III"],
    purpose: ["Técnico", "Manual"],
    url: "https://example.com/doc/1",
    featured: true,
    isFavorite: false
  },
  {
    id: "doc-2",
    title: "Guia de segurança e precauções para laser fracionado",
    type: "documentacao",
    thumbnailUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop",
    viewCount: 234,
    downloadCount: 112,
    rating: 4.7,
    equipment: ["Laser Fracionado"],
    purpose: ["Segurança", "Guia"],
    url: "https://example.com/doc/2",
    featured: false,
    isFavorite: true
  },
  {
    id: "artigo-1",
    title: "Estudo científico: Eficácia do laser para rejuvenescimento facial",
    type: "artigo",
    thumbnailUrl: "https://images.unsplash.com/photo-1532153354457-5fbe1a373035?w=800&auto=format&fit=crop",
    viewCount: 432,
    downloadCount: 187,
    rating: 4.8,
    equipment: ["Laser"],
    purpose: ["Científico", "Evidências"],
    url: "https://example.com/artigo/1",
    featured: true,
    isFavorite: false
  },
  {
    id: "artigo-2",
    title: "Análise de mercado: Tendências em procedimentos não-invasivos",
    type: "artigo",
    thumbnailUrl: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=800&auto=format&fit=crop",
    viewCount: 387,
    downloadCount: 142,
    rating: 4.3,
    equipment: ["Múltiplos"],
    purpose: ["Mercado", "Análise"],
    url: "https://example.com/artigo/2",
    featured: false,
    isFavorite: true
  }
];

// Generate AI-powered ideas based on media content
export const generateIdeasFromMedia = (item: MediaItem): string[] => {
  const ideas = [
    `Como incorporar ${item.title} em uma estratégia de marketing integrada`,
    `Série de posts no Instagram sobre os resultados alcançados com ${item.equipment[0] || "este procedimento"}`,
    `Webinar educativo explicando o processo e benefícios de ${item.title}`,
    `Vídeo comparativo entre ${item.equipment[0] || "este tratamento"} e outras alternativas do mercado`,
    `E-book: Guia completo sobre ${item.title} para seus pacientes`,
    `Workshop prático demonstrando as técnicas apresentadas em ${item.title}`,
    `Série de depoimentos de pacientes que realizaram ${item.title}`,
    `Quiz nas redes sociais sobre mitos e verdades sobre ${item.equipment[0] || "este procedimento"}`
  ];
  
  // Return 3-5 random ideas
  return shuffleArray(ideas).slice(0, Math.floor(Math.random() * 3) + 3);
};

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
