
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
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/routes";

const AdminTopbar: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: "Upload de Vídeo",
      icon: Video,
      action: () => navigate(ROUTES.ADMIN_VIDEOS),
      color: "text-blue-400 hover:text-blue-300"
    },
    {
      label: "Upload de Imagem",
      icon: Image,
      action: () => navigate(ROUTES.MEDIA),
      color: "text-green-400 hover:text-green-300"
    },
    {
      label: "Artigo Científico",
      icon: BookOpen,
      action: () => navigate(ROUTES.ADMIN.CONTENT + "?tab=articles"),
      color: "text-purple-400 hover:text-purple-300"
    },
    {
      label: "Downloads em Massa",
      icon: Upload,
      action: () => navigate(ROUTES.DOWNLOADS.BATCH),
      color: "text-orange-400 hover:text-orange-300"
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
    <header className="sticky top-0 z-50 border-b bg-slate-950/95 backdrop-blur-sm border-white/10">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo/Brand */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.ADMIN.ROOT)}
            className="text-xl font-bold text-white hover:text-purple-300"
          >
            Admin Fluida
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={action.action}
              className={cn(
                "flex items-center gap-2 transition-colors",
                action.color
              )}
            >
              <action.icon className="h-4 w-4" />
              <span className="hidden md:inline">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Admin Menu Dropdown */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                <Settings className="h-4 w-4 mr-2" />
                Menu Admin
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-slate-900 border-slate-700"
            >
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
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
