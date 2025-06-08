
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
  BrainCircuit,
  FileText,
  Image,
  Palette,
  BookOpen,
  PenTool,
  Wrench
} from "lucide-react";
import { ROUTES } from '@/routes';

// Main menu sidebar structure
export const sidebarData = [
  {
    name: "Menu Principal",
    icon: Home,
    links: [
      { name: "Consultor de MKT", icon: BrainCircuit, path: "/marketing-consultant", highlight: false },
      { name: "Roteiro", icon: FileText, path: ROUTES.CONTENT.SCRIPTS.ROOT, highlight: false },
      { name: "Video", icon: Film, path: ROUTES.VIDEOS.ROOT, highlight: false },
      { name: "Fotos", icon: Image, path: "/photos", highlight: false },
      { name: "Artes", icon: Palette, path: "/arts", highlight: false },
      { name: "Artigo científico", icon: BookOpen, path: ROUTES.SCIENTIFIC_ARTICLES, highlight: false },
      { name: "Planejador", icon: Calendar, path: "/content-planner", highlight: false },
      { name: "Equipamentos", icon: Wrench, path: "/equipments", highlight: false }
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
