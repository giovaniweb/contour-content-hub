
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from '@/routes';
import { 
  Menu,
  Cog,
  User,
  HelpCircle,
  Video,
  LayoutDashboard,
  FileText,
  Calendar,
  BarChart3,
  MessageSquare,
  Settings,
  PlusCircle,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  path: string;
  name: string;
  icon: React.ElementType;
  highlight?: boolean;
}

interface SidebarGroupProps {
  name: string;
  icon: React.ElementType;
  links: SidebarLinkProps[];
}

// Sidebar navigation data
const sidebarData: SidebarGroupProps[] = [
  {
    name: "Principal",
    icon: Home,
    links: [
      { path: ROUTES.DASHBOARD, name: "Dashboard", icon: LayoutDashboard },
      { path: ROUTES.PROFILE, name: "Meu Perfil", icon: User }
    ]
  },
  {
    name: "Conteúdo",
    icon: FileText,
    links: [
      { path: ROUTES.CONTENT.STRATEGY, name: "Estratégias", icon: BarChart3 },
      { path: ROUTES.CONTENT.PLANNER, name: "Planejamento", icon: Calendar },
      { path: ROUTES.CONTENT.IDEAS, name: "Ideias", icon: MessageSquare },
      { path: ROUTES.CONTENT.SCRIPTS.ROOT, name: "Scripts", icon: FileText }
    ]
  },
  {
    name: "Downloads",
    icon: Video,
    links: [
      { path: ROUTES.VIDEOS.ROOT, name: "Vídeos", icon: Video },
      { path: ROUTES.VIDEOS.STORAGE, name: "Armazenamento", icon: Video, highlight: true },
      { path: ROUTES.VIDEOS.BATCH, name: "Lote", icon: Video },
      { path: ROUTES.VIDEOS.SWIPE, name: "Swipe", icon: Video }
    ]
  },
  {
    name: "Configurações",
    icon: Settings,
    links: [
      { path: ROUTES.WORKSPACE_SETTINGS, name: "Workspace", icon: Settings },
      { path: ROUTES.INVITES, name: "Convites", icon: User }
    ]
  }
];

// Admin items
const adminItems: SidebarLinkProps[] = [
  { path: ROUTES.ADMIN.ROOT, name: "Admin", icon: Cog },
  { path: ROUTES.ADMIN.EQUIPMENT, name: "Equipamentos", icon: Settings },
  { path: ROUTES.ADMIN.CONTENT, name: "Conteúdo", icon: FileText },
  { path: ROUTES.ADMIN.VIMEO.SETTINGS, name: "Vimeo", icon: Video }
];

export default function Sidebar() {
  const [open, setOpen] = React.useState(true);
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  // Check if the current path is active
  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD && (location.pathname === '/' || location.pathname === ROUTES.DASHBOARD)) {
      return true;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className={cn("border-r bg-background flex flex-col transition-all duration-300", open ? "w-64" : "w-16")}>
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          {open && (
            <div className="font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#0094fb] to-[#f300fc]">
              Fluida
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto"
            onClick={() => setOpen(!open)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {sidebarData.map((group) => (
          <div key={group.name} className="mb-4">
            <div className={cn(!open && "sr-only", "mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center")}>
              <group.icon className="mr-2 h-4 w-4" />
              {group.name}
            </div>
            <div className="space-y-1">
              {group.links.map((item) => (
                <div key={item.name}>
                  <Link 
                    to={item.path}
                    className={cn(
                      "group inline-flex h-9 w-full items-center rounded-md px-3 text-sm font-medium transition-colors",
                      isActive(item.path) ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      item.highlight ? "relative before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-gradient-to-b before:from-[#0094fb] before:to-[#f300fc] before:rounded-r-sm z-10" : ""
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {open && (
                      <>
                        <span>{item.name}</span>
                        {item.highlight && (
                          <span className="absolute right-2 top-1 h-2 w-2 rounded-full bg-[#f300fc] animate-pulse" />
                        )}
                      </>
                    )}
                  </Link>
                </div>
              ))}

              {/* Link para criar vídeo quando estiver no grupo de vídeos */}
              {group.name === "Downloads" && (
                <div>
                  <Link 
                    to={ROUTES.VIDEOS.CREATE}
                    className={cn(
                      "group inline-flex h-9 w-full items-center rounded-md px-3 text-sm font-medium transition-colors text-blue-500 hover:text-blue-600",
                      isActive(ROUTES.VIDEOS.CREATE) ? "bg-secondary" : "hover:bg-secondary"
                    )}
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    {open && <span>Criar Vídeo</span>}
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isAdmin && (
          <div className="mt-4">
            <div className={cn(!open && "sr-only", "mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center")}>
              <Cog className="mr-2 h-4 w-4" /> Admin
            </div>
            <div className="space-y-1">
              {adminItems.map((item) => (
                <div key={item.name}>
                  <Link 
                    to={item.path}
                    className={cn(
                      "group inline-flex h-9 w-full items-center rounded-md px-3 text-sm font-medium transition-colors",
                      isActive(item.path) ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {open && <span>{item.name}</span>}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t p-4">
        {open ? (
          <div className="space-y-2">
            <Link to={ROUTES.PROFILE} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
              <User className="h-4 w-4" />
              <span className="text-sm">Profile</span>
            </Link>
            <Link to="/help" className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm">Help</span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Link to={ROUTES.PROFILE} className="p-2 rounded-md hover:bg-muted transition-colors">
              <User className="h-4 w-4" />
            </Link>
            <Link to="/help" className="p-2 rounded-md hover:bg-muted transition-colors">
              <HelpCircle className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
