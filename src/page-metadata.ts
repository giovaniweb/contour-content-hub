
import { LayoutDashboard, Crown, BrainCircuit, PenTool, Video, Image, Palette, Wrench, Calendar } from "lucide-react";

export const PAGE_METADATA = {
  "/dashboard": {
    title: "Dashboard",
    icon: LayoutDashboard,
    description: "Resumo, ações rápidas e status da sua criatividade.",
    breadcrumbs: [
      { label: "Dashboard" }
    ]
  },
  "/mestre-da-beleza": {
    title: "Mestre da Beleza",
    icon: Crown,
    description: "Consultoria e insights personalizados para clínicas.",
    breadcrumbs: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Mestre da Beleza" }
    ]
  },
  "/marketing-consultant": {
    title: "Consultor MKT",
    icon: BrainCircuit,
    description: "Consultor de marketing para impulsionar seu negócio.",
    breadcrumbs: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Consultor MKT" }
    ]
  },
  "/fluidaroteirista": {
    title: "Fluida Roteirista",
    icon: PenTool,
    description: "Gere roteiros criativos e emocionais com IA.",
    breadcrumbs: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Fluida Roteirista" }
    ]
  },
  "/videos": {
    title: "Vídeos",
    icon: Video,
    description: "Biblioteca de vídeos da sua clínica.",
    breadcrumbs: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Vídeos" }
    ]
  },
  "/photos": {
    title: "Fotos",
    icon: Image,
    description: "Coleção das melhores fotos para usar e inspirar.",
    breadcrumbs: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Fotos" }
    ]
  },
  "/arts": {
    title: "Artes",
    icon: Palette,
    description: "Artes visuais e peças gráficas prontas.",
    breadcrumbs: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Artes" }
    ]
  },
  "/equipments": {
    title: "Equipamentos",
    icon: Wrench,
    description: "Veja e gerencie seus equipamentos.",
    breadcrumbs: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Equipamentos" }
    ]
  },
  "/content-planner": {
    title: "Planner de Conteúdo",
    icon: Calendar,
    description: "Organize e planeje seu conteúdo de forma estratégica.",
    breadcrumbs: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Planner de Conteúdo" }
    ]
  }
  // Adicione mais rotas conforme necessário.
};
