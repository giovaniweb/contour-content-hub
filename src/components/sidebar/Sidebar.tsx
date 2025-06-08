
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
  Cog,
  User,
  HelpCircle,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { sidebarData, adminItems } from "./SidebarData";

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
    <SidebarComponent>
      <SidebarHeader className="border-b p-3">
        <div className="flex items-center justify-between">
          {open && (
            <div className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#0094fb] to-[#f300fc]">
              Fluida
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto h-8 w-8"
            onClick={() => setOpen(!open)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-1 overflow-y-auto">
        {sidebarData.map((group) => (
          <SidebarGroup key={group.name} className="mb-2">
            <SidebarGroupLabel className={cn(!open && "sr-only", "flex items-center text-xs px-2 py-1")}>
              {group.icon && <group.icon className="mr-2 h-3 w-3" />}
              {group.name}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.links.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
                    className={cn(
                      "h-8 text-sm",
                      item.highlight ? "relative before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-gradient-to-b before:from-[#0094fb] before:to-[#f300fc] before:rounded-r-sm z-10" : ""
                    )}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                      {item.highlight && open && (
                        <span className="absolute right-2 top-1 h-1.5 w-1.5 rounded-full bg-[#f300fc] animate-pulse" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Link para criar vídeo quando estiver no grupo de vídeos */}
              {group.name === "Downloads" && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive("/videos/create")}
                    className="h-8 text-sm"
                  >
                    <Link to="/videos/create" className="text-blue-500 hover:text-blue-600">
                      <PlusCircle className="h-4 w-4" />
                      <span>Criar Vídeo</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroup>
        ))}
        
        {isAdmin && (
          <SidebarGroup className="mt-2">
            <SidebarGroupLabel className={cn(!open && "sr-only", "flex items-center text-xs px-2 py-1")}>
              <Cog className="mr-2 h-3 w-3" /> Admin
            </SidebarGroupLabel>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
                    className="h-8 text-sm"
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter className="border-t p-3">
        {open ? (
          <div className="space-y-1">
            <Link to={ROUTES.PROFILE} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors text-sm">
              <User className="h-3 w-3" />
              <span>Profile</span>
            </Link>
            <Link to="/help" className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors text-sm">
              <HelpCircle className="h-3 w-3" />
              <span>Help</span>
            </Link>
          </div>
        ) : null}
      </SidebarFooter>
    </SidebarComponent>
  );
}
