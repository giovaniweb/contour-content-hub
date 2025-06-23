
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

// Main menu sidebar structure
export const sidebarData = [
  {
    name: "Menu Principal",
    icon: Home,
    links: [
      { name: "Consultor de MKT", icon: BrainCircuit, path: "/marketing-consultant", highlight: false },
      { name: "Roteiro", icon: FileText, path: "/content/scripts", highlight: false },
      { name: "Video", icon: Film, path: "/videos", highlight: false },
      { name: "Fotos", icon: Image, path: "/photos", highlight: false },
      { name: "Artes", icon: Palette, path: "/arts", highlight: false },
      { name: "Artigo científico", icon: BookOpen, path: "/scientific-articles", highlight: false },
      { name: "Planejador", icon: Calendar, path: "/content-planner", highlight: false },
      { name: "Equipamentos", icon: Wrench, path: "/equipments", highlight: false }
    ]
  }
];

// Admin menu structure  
export const adminItems = [
  { name: "Painel Admin", icon: LayoutDashboard, path: "/admin", highlight: false },
  { name: "Equipamentos", icon: Settings, path: "/admin/equipments", highlight: false },
  { name: "Artigos Científicos", icon: BookOpen, path: "/admin/scientific-articles", highlight: false },
  { name: "Conteúdo", icon: File, path: "/admin/content", highlight: false },
  { name: "Vídeos", icon: Film, path: "/admin/videos", highlight: false },
  { name: "IA do Sistema", icon: Brain, path: "/admin/ai", highlight: false },
  { name: "Integrações", icon: LinkIcon, path: "/admin/integrations", highlight: false },
  { name: "Config. Vimeo", icon: Video, path: "/admin/vimeo", highlight: false },
  { name: "Diagnóstico", icon: TestTube, path: "/admin/diagnostics", highlight: false }
];
