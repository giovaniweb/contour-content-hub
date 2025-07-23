
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Video, 
  Image, 
  FileText,
  Crown,
  BrainCircuit,
  Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileBottomNav() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard')) {
      return true;
    }
    return location.pathname === path;
  };
  
  const menuItems = [
    { icon: LayoutDashboard, path: '/dashboard', label: 'Dashboard' },
    { icon: BrainCircuit, path: '/ai-tools', label: 'IA', 
      submenu: [
        { path: '/mestre-da-beleza', label: 'Mestre da Beleza' },
        { path: '/marketing-consultant', label: 'Consultor MKT' },
        { path: '/fluidaroteirista', label: 'Roteirista' }
      ]
    },
    { icon: Video, path: '/downloads', label: 'Download',
      submenu: [
        { path: '/videos', label: 'Vídeos' },
        { path: '/photos', label: 'Fotos' },
        { path: '/arts', label: 'Artes' },
        { path: '/scientific-articles', label: 'Artigos' }
      ]
    },
    { icon: Wrench, path: '/equipments', label: 'Equipamentos' },
    { icon: FileText, path: '/my-documents', label: 'Docs' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-aurora-deep-navy/95 backdrop-blur-lg border-t border-aurora-neon-blue/20 z-40 px-2 py-2 shadow-lg">
      <div className="flex items-center justify-around">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 min-w-[60px]",
              isActive(item.path) 
                ? "text-aurora-neon-blue bg-aurora-neon-blue/10 shadow-lg" 
                : "text-aurora-text-muted hover:text-aurora-neon-blue hover:bg-aurora-neon-blue/5"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
