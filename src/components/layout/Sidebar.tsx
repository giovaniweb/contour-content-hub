
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

  console.log('Sidebar renderizado com dados:', sidebarData); // Debug log

  return (
    <SidebarComponent className="bg-gradient-to-b from-white/80 to-zinc-100/70 backdrop-blur-sm border-r">
      <SidebarHeader className="border-b p-4">
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
      </SidebarHeader>
      
      <SidebarContent className="p-2 overflow-y-auto">
        {/* Display all sidebar groups from our data */}
        {sidebarData.map((group) => (
          <SidebarGroup key={group.name} className="mb-4">
            <SidebarGroupLabel className={cn(!open && "sr-only", "flex items-center text-xs text-muted-foreground")}>
              {group.icon && <group.icon className="mr-2 h-4 w-4" />}
              {group.name}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.links.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
                    className={item.highlight ? "relative before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-gradient-to-b before:from-[#0094fb] before:to-[#f300fc] before:rounded-r-sm z-10" : ""}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                      {item.highlight && open && (
                        <span className="absolute right-2 top-1 h-2 w-2 rounded-full bg-[#f300fc] animate-pulse" />
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
                  >
                    <Link to={ROUTES.VIDEOS.CREATE} className="text-blue-500 hover:text-blue-600">
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
            <SidebarGroupLabel className={cn(!open && "sr-only", "flex items-center text-xs text-muted-foreground")}>
              Administração
            </SidebarGroupLabel>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
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
      
      <SidebarFooter className="border-t p-4">
        {open ? (
          <div className="space-y-2">
            <Link to={ROUTES.PROFILE} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
              <User className="h-4 w-4" />
              <span className="text-sm">Perfil</span>
            </Link>
            <Link to="/help" className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm">Ajuda</span>
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
      </SidebarFooter>
    </SidebarComponent>
  );
}
