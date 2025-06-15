
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Crown,
  BrainCircuit,
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
  { icon: Video, label: "Vídeos", path: "/videos" },
  { icon: Image, label: "Fotos", path: "/photos" },
  { icon: Palette, label: "Artes", path: "/arts" },
  { icon: Wrench, label: "Equipamentos", path: "/equipments" },
];

const SIDEBAR_WIDTH = 104; // px (w-26 ~ 104px, enough for two lines)

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-900 shadow-lg z-40 flex flex-col items-center py-4",
        "border-r border-white/10"
      )}
      style={{ width: SIDEBAR_WIDTH }}
    >
      <div className="flex flex-col items-center mb-8 mt-2 cursor-pointer select-none" onClick={() => navigate("/dashboard")}>
        <span className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500">
          {/* Ícone estilizado do app */}
          <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M6 17L17 6M7 7h10v10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="mt-2 text-xs font-bold text-white tracking-tight">Fluida</span>
      </div>
      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-3 w-full">
        {sidebarItems.map((item) => {
          const active = location.pathname === item.path;
          const labelLines = item.label.split('\n');
          return (
            <button
              key={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-150 mx-auto w-[88px] py-3 group",
                active && "bg-white/15 text-white shadow-lg"
              )}
              onClick={() => navigate(item.path)}
              tabIndex={0}
              style={{ outline: "none" }}
            >
              <item.icon className="w-7 h-7 mb-1" />
              <span className={cn(
                "text-[0.78rem] font-medium truncate leading-tight text-center break-words",
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
      {/* Rodapé minimalista */}
      {/* <div className="mt-auto mb-2 text-xs text-white/50">v1.0</div> */}
    </aside>
  );
};

export default Sidebar;

