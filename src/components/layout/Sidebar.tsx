
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Crown, label: "Mestre da\nBeleza", path: "/mestre-da-beleza" },
  { icon: BrainCircuit, label: "Consultor\nMKT", path: "/marketing-consultant" },
  { icon: PenTool, label: "Fluida\nRoteirista", path: "/fluidaroteirista" },
  { icon: Video, label: "Vídeos", path: "/videos" },
  { icon: Image, label: "Fotos", path: "/photos" },
  { icon: Palette, label: "Artes", path: "/arts" },
  { icon: Wrench, label: "Equipamentos", path: "/equipments" },
];

const SIDEBAR_WIDTH = 72; // px (reduzido para minimalismo)

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-900 shadow-lg z-40 flex flex-col items-center py-2 border-r border-white/10"
      )}
      style={{ width: SIDEBAR_WIDTH }}
    >
      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-1 w-full">
        {sidebarItems.map((item) => {
          const active = location.pathname === item.path;
          const labelLines = item.label.split('\n');
          return (
            <button
              key={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-150 mx-auto w-[56px] py-2 group",
                active && "bg-white/15 text-white shadow"
              )}
              onClick={() => navigate(item.path)}
              tabIndex={0}
              style={{ outline: "none" }}
            >
              <item.icon className="w-5 h-5 mb-0.5" />
              <span className={cn(
                "text-[0.72rem] font-medium leading-tight text-center break-words",
                active && "text-white"
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
      {/* Rodapé minimalista removido (já está comentado) */}
    </aside>
  );
};

export default Sidebar;

