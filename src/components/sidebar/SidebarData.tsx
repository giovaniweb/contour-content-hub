
import {
  BarChart3,
  FileText,
  FolderOpen,
  Home,
  PlaySquare,
  User,
  Calendar,
  PencilLine
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
        path: "/",
      },
      {
        name: "Perfil",
        icon: User,
        path: "/profile",
      },
    ],
  },
  {
    name: "Conteúdo",
    links: [
      {
        name: "Gerador de Roteiros",
        icon: FileText,
        path: "/script-generator",
      },
      {
        name: "Meus Roteiros",
        icon: FolderOpen,
        path: "/scripts",
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
