import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Crown,
  BrainCircuit,
  PenTool,
  Video,
  Image,
  Palette,
  Wrench,
  BookOpen,
  X,
  User,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Crown, label: "FluiChat", path: "/mestre-da-beleza" },
  { icon: BrainCircuit, label: "FluiMKT", path: "/marketing-consultant" },
  { icon: PenTool, label: "FluiRoteiro", path: "/fluidaroteirista" },
  { icon: Video, label: "FluiVideos", path: "/videos" },
  { icon: Image, label: "FluiFotos", path: "/photos" },
  { icon: Palette, label: "FluiArtes", path: "/arts" },
  { icon: BookOpen, label: "FluiArtigos", path: "/scientific-articles" },
  { icon: Wrench, label: "Equipamentos", path: "/equipments" },
];

const MobileSidebarMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { open, setOpen } = useSidebar();

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false); // Fechar sidebar após navegação
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-aurora-deep-navy via-aurora-card-bg to-aurora-deep-navy">
      {/* Header do sidebar */}
      <div className="p-4 border-b border-aurora-neon-blue/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profilePhotoUrl} />
              <AvatarFallback className="bg-aurora-neon-blue/20 text-aurora-neon-blue">
                {user?.nome?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-medium text-sm">{user?.nome || "Usuário"}</p>
              <p className="text-aurora-text-muted text-xs">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="text-aurora-text-muted hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Menu de navegação */}
      <div className="flex-1 py-4">
        <nav className="space-y-2 px-3">
          {sidebarItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left",
                  "text-aurora-text-muted hover:text-aurora-neon-blue hover:bg-aurora-neon-blue/10",
                  active && "bg-aurora-neon-blue/20 text-aurora-neon-blue border border-aurora-neon-blue/30"
                )}
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer com ações do usuário */}
      <div className="p-4 border-t border-aurora-neon-blue/20 space-y-2">
        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-aurora-text-muted hover:text-aurora-neon-blue hover:bg-aurora-neon-blue/10 transition-all"
          onClick={() => handleNavigation("/profile")}
        >
          <User className="w-5 h-5" />
          <span className="text-sm">Perfil</span>
        </button>
        
        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-aurora-text-muted hover:text-aurora-neon-blue hover:bg-aurora-neon-blue/10 transition-all"
          onClick={() => handleNavigation("/settings")}
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm">Configurações</span>
        </button>
        
        <Separator className="bg-aurora-neon-blue/20" />
        
        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Sair</span>
        </button>
      </div>
    </div>
  );
};

export default MobileSidebarMenu;