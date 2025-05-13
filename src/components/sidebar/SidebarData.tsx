
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
  Calendar,
  Lightbulb,
  PenTool
} from "lucide-react";
import { ROUTES } from '@/routes';

// Main menu sidebar structure
export const sidebarData = [
  {
    name: "Menu Principal",
    icon: Home,
    links: [
      { name: "Dashboard", icon: Home, path: ROUTES.DASHBOARD, highlight: false },
      { name: "Roteiros", icon: FileText, path: ROUTES.CONTENT.SCRIPTS.ROOT, highlight: false },
      { name: "Validador", icon: Check, path: ROUTES.CONTENT.SCRIPTS.VALIDATION, highlight: false },
      { name: "Vídeos", icon: Film, path: ROUTES.VIDEOS.ROOT, highlight: false },
      { name: "Artigos", icon: Book, path: ROUTES.SCIENTIFIC_ARTICLES, highlight: false },
      { name: "Estratégia", icon: BarChart3, path: ROUTES.CONTENT.STRATEGY, highlight: false },
      { name: "Equipamentos", icon: Box, path: ROUTES.EQUIPMENT.LIST, highlight: false }
    ]
  },
  {
    name: "Conteúdo",
    icon: FileText,
    links: [
      { name: "Roteiros", icon: FileText, path: ROUTES.CONTENT.SCRIPTS.ROOT, highlight: false },
      { name: "Gerador", icon: PenTool, path: ROUTES.CONTENT.SCRIPTS.GENERATOR, highlight: false },
      { name: "Ideias", icon: Lightbulb, path: ROUTES.CONTENT.IDEAS, highlight: false },
      { name: "Calendário", icon: Calendar, path: ROUTES.CONTENT.CALENDAR, highlight: true },
      { name: "Planejador", icon: BarChart3, path: ROUTES.CONTENT.PLANNER, highlight: false },
    ]
  },
  {
    name: "Vídeos",
    icon: Film,
    links: [
      { name: "Biblioteca", icon: Film, path: ROUTES.VIDEOS.ROOT, highlight: false },
      { name: "Importar", icon: Upload, path: ROUTES.VIDEOS.IMPORT, highlight: false },
      { name: "Armazenamento", icon: Video, path: ROUTES.VIDEOS.STORAGE, highlight: false },
      { name: "Lote", icon: Film, path: ROUTES.VIDEOS.BATCH, highlight: false },
      { name: "Swipe", icon: Film, path: ROUTES.VIDEOS.SWIPE, highlight: false },
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
  { name: "Diagnóstico", icon: TestTube, path: ROUTES.ADMIN.SYSTEM.DIAGNOSTICS, highlight: false },
  { name: "Workspace", icon: Settings, path: ROUTES.ADMIN.WORKSPACE, highlight: false }
];
