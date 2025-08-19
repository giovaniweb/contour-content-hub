
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
  GraduationCap,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Crown, label: "Mestre da\nBeleza", path: "/mestre-da-beleza" },
  { icon: BrainCircuit, label: "Consultor\nMKT", path: "/marketing-consultant" },
  { icon: PenTool, label: "Fluida\nRoteirista", path: "/fluidaroteirista" },
  { icon: Video, label: "Vídeos", path: "/videos" },
  { icon: Image, label: "Fotos", path: "/photos" },
  { icon: Palette, label: "Artes", path: "/arts" },
  { icon: BookOpen, label: "Artigos\nCientíficos", path: "/scientific-articles" },
  { icon: GraduationCap, label: "Academia", path: "/academia" },
  { icon: Wrench, label: "Equipamentos", path: "/equipments" },
];

const SIDEBAR_WIDTH = 104; // px (w-26 ~ 104px, enough for two lines)

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Ocultar sidebar no mobile
  if (isMobile) {
    return null;
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-gradient-to-b from-aurora-deep-navy via-aurora-card-bg to-aurora-deep-navy shadow-xl z-40 flex flex-col items-center py-4",
        "border-r border-aurora-neon-blue/20"
      )}
      style={{ width: SIDEBAR_WIDTH }}
    >
      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-3 w-full">
        {sidebarItems.map((item) => {
          const active = location.pathname === item.path;
          const labelLines = item.label.split('\n');
          return (
            <button
              key={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-aurora-text-muted hover:text-aurora-neon-blue hover:bg-aurora-neon-blue/10 rounded-lg transition-all duration-150 mx-auto w-[88px] py-3 group",
                active && "bg-aurora-neon-blue/20 text-aurora-neon-blue shadow-lg border border-aurora-neon-blue/30"
              )}
              onClick={() => navigate(item.path)}
              tabIndex={0}
              style={{ outline: "none" }}
            >
              <item.icon className="w-7 h-7 mb-1" />
              <span className={cn(
                "text-[0.78rem] font-medium truncate leading-tight text-center break-words",
                active && "text-aurora-neon-blue"
              )}>
                {labelLines.map((line, idx) => (
                  <span key={idx} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
