
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
  { icon: Crown, label: "FluiChat", path: "/mestre-da-beleza" },
  { icon: BrainCircuit, label: "FluiMKT", path: "/marketing-consultant" },
  { icon: PenTool, label: "FluiRoteiro", path: "/fluidaroteirista" },
  { icon: Video, label: "FluiVideos", path: "/videos" },
  { icon: Image, label: "FluiFotos", path: "/photos" },
  { icon: Palette, label: "FluiArtes", path: "/arts" },
  { icon: BookOpen, label: "FluiArtigos", path: "/scientific-articles" },
  { icon: GraduationCap, label: "FluiAulas", path: "/academia" },
  { icon: Wrench, label: "Equipamentos", path: "/equipments" },
];

const SIDEBAR_WIDTH = 96; // px (w-24 ~ 96px, more compact for smaller screens)

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
      <nav className="flex-1 flex flex-col gap-2 w-full">
        {sidebarItems.map((item, index) => {
          const active = location.pathname === item.path;
          const labelLines = item.label.split('\n');
          const isLast = index === sidebarItems.length - 1;
          return (
            <button
              key={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-aurora-text-muted hover:text-aurora-neon-blue hover:bg-aurora-neon-blue/10 rounded-lg transition-all duration-150 mx-auto w-[80px] py-2 group relative",
                active && "bg-aurora-neon-blue/20 text-aurora-neon-blue shadow-lg border border-aurora-neon-blue/30",
                !isLast && "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-px after:bg-aurora-neon-blue/10"
              )}
              onClick={() => navigate(item.path)}
              tabIndex={0}
              style={{ outline: "none" }}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className={cn(
                "text-[0.75rem] font-medium truncate leading-tight text-center break-words",
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
