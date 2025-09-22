
import { Crown, BrainCircuit, PenTool, Video, Image, Palette, Wrench, Calendar, FileText, Info, User, Settings } from "lucide-react";

export interface PageMeta {
  icon: any;
  title: string;
  subtitle?: string;
  breadcrumbs: {
    label: string;
    href?: string;
    isCurrent?: boolean;
  }[];
}
const DASHBOARD_BREADCRUMB = [{ label: "Dashboard", href: "/dashboard" }];

export const pageMetadata: Record<string, PageMeta> = {
  "/mestre-da-beleza": {
    icon: Crown, title: "FluiChat",
    subtitle: "Descubra recomendações inteligentes para sua clínica",
    breadcrumbs: [...DASHBOARD_BREADCRUMB, { label: "FluiChat", isCurrent: true }]
  },
  "/marketing-consultant": {
    icon: BrainCircuit, title: "FluiMKT",
    subtitle: "Estratégias personalizadas para seu negócio",
    breadcrumbs: [...DASHBOARD_BREADCRUMB, { label: "Marketing", href: "#" }, { label: "FluiMKT", isCurrent: true }]
  },
  "/fluidaroteirista": {
    icon: PenTool, title: "FluiRoteiro",
    subtitle: "Crie roteiros emocionantes com IA",
    breadcrumbs: [...DASHBOARD_BREADCRUMB, { label: "Conteúdo", href: "#" }, { label: "FluiRoteiro", isCurrent: true }]
  },
  "/videos": {
    icon: Video, title: "FluiVideos",
    subtitle: "Gerencie, crie e compartilhe vídeos",
    breadcrumbs: [...DASHBOARD_BREADCRUMB, { label: "Mídia", href: "#" }, { label: "FluiVideos", isCurrent: true }]
  },
  "/photos": {
    icon: Image, title: "FluiFotos",
    subtitle: "Gerencie e organize suas fotos",
    breadcrumbs: [...DASHBOARD_BREADCRUMB, { label: "Mídia", href: "#" }, { label: "FluiFotos", isCurrent: true }]
  },
  "/arts": {
    icon: Palette, title: "FluiArtes",
    subtitle: "Crie e gerencie suas artes e designs",
    breadcrumbs: [...DASHBOARD_BREADCRUMB, { label: "Mídia", href: "#" }, { label: "FluiArtes", isCurrent: true }]
  },
  "/equipments": {
    icon: Wrench, title: "FluiEquipamentos",
    subtitle: "Explore equipamentos disponíveis",
    breadcrumbs: [...DASHBOARD_BREADCRUMB, { label: "Sistema", href: "#" }, { label: "FluiEquipamentos", isCurrent: true }]
  },
  "/content-planner": {
    icon: Calendar, title: "Planner de Conteúdo",
    subtitle: "Organize e planeje seu conteúdo estrategicamente",
    breadcrumbs: [...DASHBOARD_BREADCRUMB, { label: "Conteúdo", href: "#" }, { label: "Planner", isCurrent: true }]
  },
  "/institucional/sobre": {
    icon: Info, title: "Sobre a Fluida",
    subtitle: "Conheça mais sobre a plataforma Fluida",
    breadcrumbs: [...DASHBOARD_BREADCRUMB, { label: "Institucional", href: "#" }, { label: "Sobre a Fluida", isCurrent: true }]
  },
  "/institucional/o-que-e": {
    icon: Info, title: "O que é a Fluida?",
    subtitle: "Entenda nosso propósito e diferenciais",
    breadcrumbs: [...DASHBOARD_BREADCRUMB, { label: "Institucional", href: "#" }, { label: "O que é?", isCurrent: true }]
  },
  "/institucional/contato": {
    icon: FileText, title: "Contato",
    subtitle: "Entre em contato conosco",
    breadcrumbs: [...DASHBOARD_BREADCRUMB, { label: "Institucional", href: "#" }, { label: "Contato", isCurrent: true }]
  },
  "/institucional/suporte": {
    icon: FileText, title: "Suporte",
    subtitle: "Precisa de ajuda? Fale conosco.",
    breadcrumbs: [...DASHBOARD_BREADCRUMB, { label: "Institucional", href: "#" }, { label: "Suporte", isCurrent: true }]
  },
  "/profile": {
    icon: User, title: "Perfil",
    subtitle: "Gerencie suas informações pessoais",
    breadcrumbs: [...DASHBOARD_BREADCRUMB, { label: "Meu Perfil", isCurrent: true }]
  },
  "/workspace-settings": {
    icon: Settings, title: "Configurações do Espaço de Trabalho",
    subtitle: "Personalize o espaço da sua clínica",
    breadcrumbs: [...DASHBOARD_BREADCRUMB, { label: "Sistema", href: "#" }, { label: "Configurações", isCurrent: true }]
  },
  "/integrations/instagram": {
    icon: Settings, title: "Integração Instagram",
    subtitle: "Gerencie conexões com o Instagram",
    breadcrumbs: [...DASHBOARD_BREADCRUMB, { label: "Sistema", href: "#" }, { label: "Instagram", isCurrent: true }]
  },
  "/script-history": {
    icon: FileText,
    title: "Histórico de Roteiros",
    subtitle: "Veja o histórico de roteiros já validados",
    breadcrumbs: [...DASHBOARD_BREADCRUMB, { label: "Roteiros", isCurrent: true }]
  }
};
