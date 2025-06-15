import { PopularItem } from "../types/popularContent";
import { approvedScriptsService } from "@/services/approvedScriptsService";

export const getPopularContent = async (): Promise<PopularItem[]> => {
  try {
    const aprovados = await approvedScriptsService.getApprovedScripts();
    if (aprovados.length > 0) {
      return aprovados.slice(0, 6).map((ap, idx) => ({
        id: ap.id,
        title: ap.title,
        type: ap.format,
        imageUrl: "https://source.unsplash.com/featured/?skin,care," + (idx + 1), // Usa imagem fixa/demo
        views: 1200 + idx * 110,
        likes: 75 + idx * 11,
        comments: 9 + idx,
        rating: 4.2 + (Math.random() * 0.5),
        date: ap.created_at.split("T")[0],
        equipment: ap.equipment_used || [],
        purpose: [],
      }));
    }
  } catch (err) {
    console.warn("Falha ao buscar roteiros aprovados, usando fallback mock.", err);
  }
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
