
import { 
  Home,
  FileText,
  Check,
  Film,
  Book,
  BarChart3,
  Box,
  LayoutDashboard,
  Settings,
  File,
  Upload,
  Link as LinkIcon,
  Video,
  Brain,
  TestTube,
} from "lucide-react";
import { ROUTES } from '@/routes';

// Main menu sidebar structure
export const sidebarData = [
  {
    name: "Menu Principal",
    icon: Home,
    links: [
      { name: "Início", icon: Home, path: ROUTES.DASHBOARD, highlight: false },
      { name: "Roteiros", icon: FileText, path: ROUTES.CONTENT.SCRIPTS.ROOT, highlight: false },
      { name: "Validador", icon: Check, path: ROUTES.CONTENT.IDEAS, highlight: false },
      { name: "Mídia", icon: Film, path: ROUTES.VIDEOS.ROOT, highlight: false },
      { name: "Artigos", icon: Book, path: ROUTES.SCIENTIFIC_ARTICLES, highlight: false },
      { name: "Estratégia", icon: BarChart3, path: ROUTES.CONTENT.STRATEGY, highlight: false },
      { name: "Equipamentos", icon: Box, path: ROUTES.EQUIPMENT.LIST, highlight: false }
    ]
  },
  {
    name: "Downloads",
    icon: Film,
    links: [
      { name: "Vídeos", icon: Film, path: ROUTES.VIDEOS.ROOT, highlight: false },
      { name: "Importar", icon: Upload, path: ROUTES.VIDEOS.IMPORT, highlight: false },
      { name: "Biblioteca", icon: Video, path: ROUTES.VIDEOS.STORAGE, highlight: true }
    ]
  }
];

// Admin menu structure
export const adminItems = [
  { name: "Painel Admin", icon: LayoutDashboard, path: ROUTES.ADMIN.ROOT, highlight: false },
  { name: "Equipamentos", icon: Settings, path: ROUTES.ADMIN.EQUIPMENT, highlight: false },
  { name: "Conteúdo", icon: File, path: ROUTES.ADMIN.CONTENT, highlight: false },
  { name: "Importar Vídeos", icon: Upload, path: ROUTES.VIDEOS.IMPORT, highlight: false },
  { name: "Integrações", icon: LinkIcon, path: ROUTES.ADMIN.SYSTEM.INTELLIGENCE, highlight: false },
  { name: "Config. Vimeo", icon: Video, path: ROUTES.ADMIN.VIMEO.SETTINGS, highlight: false },
  { name: "IA do Sistema", icon: Brain, path: ROUTES.ADMIN.AI, highlight: false },
  { name: "Diagnóstico", icon: TestTube, path: ROUTES.ADMIN.SYSTEM.DIAGNOSTICS, highlight: false }
];
