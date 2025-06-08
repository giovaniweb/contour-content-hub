
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
  PlusCircle,
  Sparkles
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
    <div className="h-screen aurora-glass border-r border-white/10 flex flex-col relative overflow-hidden">
      {/* Aurora background effects for sidebar */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-900/50 to-slate-900">
        <div 
          className="absolute top-1/4 left-0 w-32 h-32 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-0 w-24 h-24 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
      </div>

      <SidebarComponent className="bg-transparent border-none relative z-10">
        <SidebarHeader className="border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            {open && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="font-semibold text-xl text-white">
                  Fluida
                </div>
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
        
        <SidebarContent className="p-4 overflow-y-auto">
          {/* Display all sidebar groups from our data */}
          {sidebarData.map((group) => (
            <SidebarGroup key={group.name} className="mb-6">
              <SidebarGroupLabel className={cn(!open && "sr-only", "text-xs font-medium text-gray-400 uppercase tracking-wider mb-3")}>
                {group.name}
              </SidebarGroupLabel>
              <SidebarMenu className="space-y-1">
                {group.links.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.path)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                        "text-gray-300 hover:text-white hover:bg-white/10",
                        isActive(item.path) && "bg-white/15 text-white",
                        item.highlight && "relative"
                      )}
                    >
                      <Link to={item.path}>
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="flex-1">{item.name}</span>
                        {item.highlight && open && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
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
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                        "text-blue-400 hover:text-blue-300 hover:bg-white/10",
                        isActive(ROUTES.VIDEOS.CREATE) && "bg-white/15 text-blue-300"
                      )}
                    >
                      <Link to={ROUTES.VIDEOS.CREATE}>
                        <PlusCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="flex-1">Criar Vídeo</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroup>
          ))}
          
          {/* Admin menu */}
          {isAdmin && (
            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className={cn(!open && "sr-only", "text-xs font-medium text-gray-400 uppercase tracking-wider mb-3")}>
                Administração
              </SidebarGroupLabel>
              <SidebarMenu className="space-y-1">
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.path)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                        "text-gray-300 hover:text-white hover:bg-white/10",
                        isActive(item.path) && "bg-white/15 text-white"
                      )}
                    >
                      <Link to={item.path}>
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="flex-1">{item.name}</span>
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
            <div className="space-y-1">
              <Link to={ROUTES.PROFILE} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                <User className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">Perfil</span>
              </Link>
              <Link to="/help" className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                <HelpCircle className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">Ajuda</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <Link to={ROUTES.PROFILE} className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                <User className="h-5 w-5" />
              </Link>
              <Link to="/help" className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                <HelpCircle className="h-5 w-5" />
              </Link>
            </div>
          )}
        </SidebarFooter>
      </SidebarComponent>
    </div>
  );
}
