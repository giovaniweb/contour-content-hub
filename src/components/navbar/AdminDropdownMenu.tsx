
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
  LayoutDashboard 
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

  const quickActions = [
    {
      label: "Upload de Vídeo",
      icon: Video,
      action: () => navigate("/admin/videos"),
    },
    {
      label: "Upload de Imagem",
      icon: Image,
      action: () => navigate("/photos"),
    },
    {
      label: "Artigo Científico",
      icon: BookOpen,
      action: () => navigate("/admin/scientific-articles"),
    },
    {
      label: "Downloads em Massa",
      icon: Upload,
      action: () => navigate("/downloads/batch"),
    }
  ];

  const adminMenuItems = [
    { label: "Dashboard Admin", icon: LayoutDashboard, path: "/admin" },
    { label: "Usuários", icon: Users, path: "/admin/users" },
    { label: "Equipamentos", icon: Settings, path: "/admin/equipments" },
    { label: "Conteúdo", icon: Database, path: "/admin/content" },
    { label: "Artigos Científicos", icon: BookOpen, path: "/admin/scientific-articles" },
    { label: "IA do Sistema", icon: Brain, path: "/admin/ai" },
    { label: "Integrações", icon: LinkIcon, path: "/admin/system-intelligence" },
    { label: "Diagnósticos", icon: TestTube, path: "/admin/system-diagnostics" }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Settings className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-slate-900 border-slate-700"
      >
        <DropdownMenuLabel className="text-slate-300">
          Ações Rápidas
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-700" />
        {quickActions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={action.action}
            className="text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <action.icon className="h-4 w-4 mr-2" />
            {action.label}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="bg-slate-700" />
        <DropdownMenuLabel className="text-slate-300">
          Administração
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-700" />
        {adminMenuItems.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => navigate(item.path)}
            className="text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <item.icon className="h-4 w-4 mr-2" />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminDropdownMenu;
