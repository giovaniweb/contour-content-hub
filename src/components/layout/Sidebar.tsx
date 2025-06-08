
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from '@/routes';
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
  Menu,
  User,
  HelpCircle,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { sidebarData, adminItems } from "../sidebar/SidebarData";

export default function Sidebar() {
  const { open, setOpen } = useSidebar();
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
    <SidebarComponent className="aurora-glass border-r border-white/10">
      <SidebarHeader className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          {open && (
            <div className="font-semibold text-xl aurora-text-gradient">
              Fluida
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto text-white hover:bg-white/10"
            onClick={() => setOpen(!open)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2 overflow-y-auto">
        {/* Display all sidebar groups from our data */}
        {sidebarData.map((group) => (
          <SidebarGroup key={group.name} className="mb-4">
            <SidebarGroupLabel className={cn(!open && "sr-only", "flex items-center text-xs text-white/60")}>
              {group.icon && <group.icon className="mr-2 h-4 w-4" />}
              {group.name}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.links.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
                    className={cn(
                      "text-white/80 hover:text-white hover:bg-white/10",
                      item.highlight && "relative before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-gradient-to-b before:from-aurora-electric-purple before:to-aurora-neon-blue before:rounded-r-sm"
                    )}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                      {item.highlight && open && (
                        <span className="absolute right-2 top-1 h-2 w-2 rounded-full bg-aurora-neon-blue animate-pulse" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Only add Create Video button to the Videos group */}
              {group.name === "Vídeos" && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(ROUTES.VIDEOS.CREATE)}
                    className="text-aurora-cyan hover:text-aurora-electric-blue hover:bg-white/10"
                  >
                    <Link to={ROUTES.VIDEOS.CREATE}>
                      <PlusCircle className="h-5 w-5" />
                      <span>Criar Vídeo</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroup>
        ))}
        
        {/* Admin menu */}
        {isAdmin && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className={cn(!open && "sr-only", "flex items-center text-xs text-white/60")}>
              Administração
            </SidebarGroupLabel>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
                    className="text-white/80 hover:text-white hover:bg-white/10"
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
        )}
      </SidebarContent>
      
      <SidebarFooter className="border-t border-white/10 p-4">
        {open ? (
          <div className="space-y-2">
            <Link to={ROUTES.PROFILE} className="flex items-center space-x-2 p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors">
              <User className="h-4 w-4" />
              <span className="text-sm">Perfil</span>
            </Link>
            <Link to="/help" className="flex items-center space-x-2 p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors">
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm">Ajuda</span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Link to={ROUTES.PROFILE} className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors">
              <User className="h-4 w-4" />
            </Link>
            <Link to="/help" className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors">
              <HelpCircle className="h-4 w-4" />
            </Link>
          </div>
        )}
      </SidebarFooter>
    </SidebarComponent>
  );
}
