
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
  Menu,
  Cog,
  User,
  HelpCircle
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
    if (path === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard')) {
      return true;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <SidebarComponent collapsible="icon">
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
        {sidebarData.map((group) => (
          <SidebarGroup key={group.name} className="mb-4">
            <SidebarGroupLabel className={cn(!open && "sr-only", "flex items-center")}>
              {group.icon && <group.icon className="mr-2 h-4 w-4" />}
              {group.name}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.links.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    active={isActive(item.path)}
                    collapsible
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
            </SidebarMenu>
          </SidebarGroup>
        ))}
        
        {isAdmin && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className={cn(!open && "sr-only", "flex items-center")}>
              <Cog className="mr-2 h-4 w-4" /> Admin
            </SidebarGroupLabel>
            <SidebarMenu>
              {adminItems.map((item) => (
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
        )}
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        {open ? (
          <div className="space-y-2">
            <Link to="/profile" className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
              <User className="h-4 w-4" />
              <span className="text-sm">Profile</span>
            </Link>
            <Link to="/help" className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm">Help</span>
            </Link>
          </div>
        ) : null}
      </SidebarFooter>
    </SidebarComponent>
  );
}
