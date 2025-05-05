
import { PopularItem } from "../types/popularContent";

export const getPopularContent = (): PopularItem[] => {
  // Exemplo de conteúdo popular - em uma implementação real, estes viriam de uma API
  return [
    {
      id: "1",
      title: "7 dicas para melhorar a elasticidade da pele",
      type: "Vídeo",
      imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1170&auto=format&fit=crop",
      views: 1240,
      likes: 89,
      comments: 14,
      isHot: true,
      rating: 4.8,
      date: "2 de maio de 2025",
      equipment: [],
      purpose: []
    },
    {
      id: "2",
      title: "Como o laser de CO2 ajuda na renovação celular",
      type: "Roteiro",
      imageUrl: "https://images.unsplash.com/photo-1612270043573-65a76546f9e8?q=80&w=1171&auto=format&fit=crop",
      views: 832,
      likes: 57,
      comments: 8,
      rating: 4.2,
      date: "30 de abril de 2025",
      equipment: [],
      purpose: []
    },
    {
      id: "3",
      title: "Aplicação abdominal Ref...",
      type: "Story",
      imageUrl: "/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png",
      views: 1122,
      likes: 103,
      comments: 22,
      isHot: true,
      rating: 4.5,
      date: "2 de maio de 2025",
      equipment: [],
      purpose: []
    }
  ];
};
