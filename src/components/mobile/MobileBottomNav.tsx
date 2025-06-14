
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ROUTES } from "@/routes";
import { 
  LayoutDashboard, 
  Kanban, 
  Lightbulb, 
  FileText,
  Menu
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export default function MobileBottomNav() {
  const location = useLocation();
  const { setOpen } = useSidebar();
  
  const openSidebar = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(true);
  };
  
  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD && (location.pathname === '/' || location.pathname === ROUTES.DASHBOARD)) {
      return true;
    }
    return location.pathname === path;
  };
  
  const menuItems = [
    { icon: LayoutDashboard, path: ROUTES.DASHBOARD, label: 'Home' },
    { icon: Kanban, path: ROUTES.CONTENT.PLANNER, label: 'Planner' },
    { icon: Lightbulb, path: ROUTES.CONTENT.IDEAS, label: 'Ideas' },
    { icon: FileText, path: ROUTES.CONTENT.SCRIPTS.ROOT, label: 'Scripts' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-40 px-2 py-1">
      <div className="flex items-center justify-between">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center p-2 ${
              isActive(item.path) 
                ? "text-primary" 
                : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
        
        <button
          onClick={openSidebar}
          className="flex flex-col items-center justify-center p-2 text-muted-foreground"
        >
          <Menu className="h-5 w-5" />
          <span className="text-xs mt-1">Menu</span>
        </button>
      </div>
    </div>
  );
}
