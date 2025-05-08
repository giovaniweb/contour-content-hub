
import {
  BarChart3,
  FileText,
  FolderOpen,
  Home,
  PlaySquare,
  User,
  Calendar,
  PencilLine,
  Database
} from "lucide-react";

export interface SidebarLink {
  name: string;
  icon: any;
  path: string;
}

export interface SidebarGroup {
  name: string;
  links: SidebarLink[];
}

export const sidebarData: SidebarGroup[] = [
  {
    name: "Principal",
    links: [
      {
        name: "Dashboard",
        icon: Home,
        path: "/dashboard",
      },
      {
        name: "Perfil",
        icon: User,
        path: "/profile",
      },
    ],
  },
  {
    name: "Equipamentos",
    links: [
      {
        name: "Lista de Equipamentos",
        icon: Database,
        path: "/equipments",
      },
    ],
  },
  {
    name: "Conteúdo",
    links: [
      {
        name: "Gerador de Roteiros",
        icon: FileText,
        path: "/generate-script",
      },
      {
        name: "Meus Roteiros",
        icon: FolderOpen,
        path: "/script-history",
      },
      {
        name: "Biblioteca de Mídia",
        icon: PlaySquare,
        path: "/media-library",
      },
      {
        name: "Agenda Inteligente",
        icon: Calendar,
        path: "/calendar",
      },
    ],
  },
  {
    name: "Marketing",
    links: [
      {
        name: "Consultor de Marketing",
        icon: BarChart3,
        path: "/marketing-consultant",
      },
      {
        name: "Assistente de Conteúdo",
        icon: PencilLine,
        path: "/custom-gpt",
      },
    ],
  },
];
