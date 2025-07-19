
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Video, 
  Image, 
  BookOpen, 
  Settings, 
  Users, 
  Database,
  Brain,
  TestTube,
  LinkIcon,
  LayoutDashboard,
  FileText,
  Palette,
  Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminDropdownMenu: React.FC = () => {
  const navigate = useNavigate();

  const cadastroActions = [
    {
      label: "Cadastrar Artigo Científico",
      icon: BookOpen,
      action: () => navigate("/admin/scientific-articles"),
    },
    {
      label: "Upload de Vídeo",
      icon: Video,
      action: () => navigate("/admin/videos/create"),
    },
    {
      label: "Upload de Fotos",
      icon: Image,
      action: () => navigate("/admin/photos/upload"),
    },
    {
      label: "Materiais (PSD/Arquivos)",
      icon: Palette,
      action: () => navigate("/downloads/batch"),
    }
  ];

  const adminMenuItems = [
    { label: "Dashboard Admin", icon: LayoutDashboard, path: "/admin" },
    { label: "Usuários", icon: Users, path: "/admin/users" },
    { label: "Equipamentos", icon: Settings, path: "/admin/equipments" },
    { label: "Conteúdo", icon: Database, path: "/admin/content" },
    { label: "IA do Sistema", icon: Brain, path: "/admin/ai" },
    { label: "Integrações", icon: LinkIcon, path: "/admin/system-intelligence" },
    { label: "Config. Vimeo", icon: Video, path: "/admin/vimeo/settings" },
    { label: "Diagnósticos", icon: TestTube, path: "/admin/system-diagnostics" }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:text-aurora-electric-purple hover:bg-aurora-electric-purple/20 transition-all duration-300 hover:shadow-aurora-glow-blue"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-slate-900/95 border-aurora-electric-purple/30 backdrop-blur-xl"
      >
        <DropdownMenuLabel className="text-slate-200 font-medium">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-aurora-electric-purple" />
            Cadastros Rápidos
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-aurora-electric-purple/20" />
        {cadastroActions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={action.action}
            className="text-slate-300 hover:bg-aurora-electric-purple/20 hover:text-white cursor-pointer transition-all duration-200"
          >
            <action.icon className="h-4 w-4 mr-2 text-aurora-electric-purple" />
            {action.label}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="bg-aurora-electric-purple/20" />
        <DropdownMenuLabel className="text-slate-200 font-medium">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-aurora-neon-blue" />
            Administração
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-aurora-electric-purple/20" />
        {adminMenuItems.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => navigate(item.path)}
            className="text-slate-300 hover:bg-aurora-neon-blue/20 hover:text-white cursor-pointer transition-all duration-200"
          >
            <item.icon className="h-4 w-4 mr-2 text-aurora-neon-blue" />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminDropdownMenu;
