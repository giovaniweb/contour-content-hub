
import { 
  Home,
  Film,
  BarChart3,
  LayoutDashboard,
  Settings,
  File,
  Upload,
  Link as LinkIcon,
  Video,
  Brain,
  TestTube,
  Calendar,
  BrainCircuit
} from "lucide-react";
import { ROUTES } from '@/routes';

// Main menu sidebar structure
export const sidebarData = [
  {
    name: "Menu Principal",
    icon: Home,
    links: [
      { name: "Dashboard", icon: Home, path: ROUTES.DASHBOARD, highlight: false },
      { name: "Vídeos", icon: Film, path: ROUTES.VIDEOS.ROOT, highlight: false },
      { name: "Consultor", icon: BrainCircuit, path: "/marketing-consultant", highlight: false }
    ]
  },
  {
    name: "Conteúdo",
    icon: Calendar,
    links: [
      { name: "Calendário", icon: Calendar, path: ROUTES.CONTENT.CALENDAR, highlight: true }
    ]
  },
  {
    name: "Vídeos",
    icon: Film,
    links: [
      { name: "Biblioteca", icon: Film, path: ROUTES.VIDEOS.ROOT, highlight: false },
      { name: "Importar", icon: Upload, path: ROUTES.VIDEOS.IMPORT, highlight: false }
    ]
  }
];

// Admin menu structure  
export const adminItems = [
  { name: "Painel Admin", icon: LayoutDashboard, path: ROUTES.ADMIN.ROOT, highlight: false },
  { name: "Equipamentos", icon: Settings, path: ROUTES.ADMIN.EQUIPMENT, highlight: false },
  { name: "Conteúdo", icon: File, path: ROUTES.ADMIN.CONTENT, highlight: false },
  { name: "Vídeos", icon: Film, path: ROUTES.ADMIN_VIDEOS, highlight: false },
  { name: "IA do Sistema", icon: Brain, path: ROUTES.ADMIN.AI, highlight: false },
  { name: "Integrações", icon: LinkIcon, path: ROUTES.ADMIN.SYSTEM.INTELLIGENCE, highlight: false },
  { name: "Config. Vimeo", icon: Video, path: ROUTES.ADMIN.VIMEO.SETTINGS, highlight: false },
  { name: "Diagnóstico", icon: TestTube, path: ROUTES.ADMIN.SYSTEM.DIAGNOSTICS, highlight: false }
];
