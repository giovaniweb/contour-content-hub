
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
import { ROUTES } from "@/routes";

const AdminDropdownMenu: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: "Upload de Vídeo",
      icon: Video,
      action: () => navigate(ROUTES.ADMIN_VIDEOS),
    },
    {
      label: "Upload de Imagem",
      icon: Image,
      action: () => navigate(ROUTES.MEDIA),
    },
    {
      label: "Artigo Científico",
      icon: BookOpen,
      action: () => navigate(ROUTES.ADMIN.CONTENT + "?tab=articles"),
    },
    {
      label: "Downloads em Massa",
      icon: Upload,
      action: () => navigate(ROUTES.DOWNLOADS.BATCH),
    }
  ];

  const adminMenuItems = [
    { label: "Dashboard Admin", icon: LayoutDashboard, path: ROUTES.ADMIN.ROOT },
    { label: "Usuários", icon: Users, path: "/admin/users" },
    { label: "Equipamentos", icon: Settings, path: ROUTES.ADMIN.EQUIPMENTS.ROOT },
    { label: "Conteúdo", icon: Database, path: ROUTES.ADMIN.CONTENT },
    { label: "IA do Sistema", icon: Brain, path: ROUTES.ADMIN.AI },
    { label: "Integrações", icon: LinkIcon, path: ROUTES.ADMIN.SYSTEM.INTELLIGENCE },
    { label: "Diagnósticos", icon: TestTube, path: ROUTES.ADMIN.SYSTEM.DIAGNOSTICS }
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
