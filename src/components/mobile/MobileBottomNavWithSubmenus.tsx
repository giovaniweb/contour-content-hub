import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Video, 
  Image, 
  FileText,
  BrainCircuit,
  Wrench,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmenuItem {
  path: string;
  label: string;
}

interface MenuItem {
  icon: React.ElementType;
  path: string;
  label: string;
  submenu?: SubmenuItem[];
}

export default function MobileBottomNavWithSubmenus() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  
  const isActive = (path: string, submenu?: SubmenuItem[]) => {
    if (path === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard')) {
      return true;
    }
    
    // Check if current path matches any submenu item
    if (submenu) {
      return submenu.some(item => location.pathname === item.path);
    }
    
    return location.pathname === path;
  };

  const isSubmenuActive = (submenu: SubmenuItem[]) => {
    return submenu.some(item => location.pathname === item.path);
  };
  
  const menuItems: MenuItem[] = [
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

  const handleItemClick = (item: MenuItem) => {
    if (item.submenu) {
      if (activeSubmenu === item.path) {
        setActiveSubmenu(null);
      } else {
        setActiveSubmenu(item.path);
      }
    } else {
      navigate(item.path);
      setActiveSubmenu(null);
    }
  };

  const handleSubmenuClick = (path: string) => {
    navigate(path);
    setActiveSubmenu(null);
  };

  return (
    <>
      {/* Submenu overlay */}
      {activeSubmenu && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 bg-aurora-deep-navy/95 backdrop-blur-lg border-t border-aurora-neon-blue/20 z-50 px-4 py-3">
          <div className="space-y-2">
            {menuItems
              .find(item => item.path === activeSubmenu)
              ?.submenu?.map((subItem) => (
                <button
                  key={subItem.path}
                  onClick={() => handleSubmenuClick(subItem.path)}
                  className={cn(
                    "w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200 text-sm font-medium",
                    location.pathname === subItem.path
                      ? "text-aurora-neon-blue bg-aurora-neon-blue/20 border border-aurora-neon-blue/30" 
                      : "text-aurora-text-muted hover:text-aurora-neon-blue hover:bg-aurora-neon-blue/10"
                  )}
                >
                  {subItem.label}
                </button>
              ))
            }
          </div>
        </div>
      )}
      
      {/* Main bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-aurora-deep-navy/95 backdrop-blur-lg border-t border-aurora-neon-blue/20 z-40 px-2 py-2 shadow-lg">
        <div className="flex items-center justify-around">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleItemClick(item)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 min-w-[60px] relative",
                isActive(item.path, item.submenu)
                  ? "text-aurora-neon-blue bg-aurora-neon-blue/10 shadow-lg" 
                  : "text-aurora-text-muted hover:text-aurora-neon-blue hover:bg-aurora-neon-blue/5"
              )}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.submenu && activeSubmenu === item.path && (
                  <ChevronUp className="absolute -top-1 -right-1 h-3 w-3 text-aurora-neon-blue" />
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}