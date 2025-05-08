
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { 
  Home, 
  Kanban, 
  CalendarPlus, 
  FileText, 
  Youtube, 
  Settings, 
  Menu 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  
  // Navigation items
  const navigationItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: Home 
    },
    { 
      name: 'Planner', 
      path: '/content-planner', 
      icon: Kanban 
    },
    { 
      name: 'Calendário', 
      path: '/calendar', 
      icon: CalendarPlus 
    },
    { 
      name: 'Documentos', 
      path: '/documents', 
      icon: FileText 
    },
    { 
      name: 'Vídeos', 
      path: '/videos', 
      icon: Youtube 
    },
  ];
  
  // Check if the current path is active
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarComponent collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          {open && (
            <div className="font-semibold text-xl fluida-gradient-text">
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
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(!open && "sr-only")}>
            Principal
          </SidebarGroupLabel>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  active={isActive(item.path)}
                  collapsible
                >
                  <Link to={item.path}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        
        {user?.role === 'admin' && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className={cn(!open && "sr-only")}>
              Administração
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  active={isActive('/settings')}
                  collapsible
                >
                  <Link to="/settings">
                    <Settings className="h-5 w-5" />
                    <span>Configurações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        {open ? (
          <div className="text-xs text-muted-foreground">
            Fluida © {new Date().getFullYear()}
          </div>
        ) : null}
      </SidebarFooter>
    </SidebarComponent>
  );
}
