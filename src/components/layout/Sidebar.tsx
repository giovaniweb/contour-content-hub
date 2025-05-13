
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
  Home,
  FileText,
  Check,
  Film,
  Book,
  BarChart3,
  Box,
  LayoutDashboard,
  Settings,
  File,
  Upload,
  Link as LinkIcon,
  Video,
  Brain,
  TestTube,
  User,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Main menu structure - Updated with correct routes
  const mainMenu = [
    { name: "Início", icon: Home, path: ROUTES.DASHBOARD },
    { name: "Roteiros", icon: FileText, path: ROUTES.CONTENT.SCRIPTS.ROOT },
    { name: "Validador", icon: Check, path: ROUTES.CONTENT.IDEAS },
    { name: "Mídia", icon: Film, path: ROUTES.VIDEOS.ROOT },
    { name: "Artigos", icon: Book, path: ROUTES.SCIENTIFIC_ARTICLES },
    { name: "Estratégia", icon: BarChart3, path: ROUTES.CONTENT.STRATEGY },
    { name: "Equipamentos", icon: Box, path: ROUTES.EQUIPMENT.LIST }
  ];

  // Admin menu structure - Updated with correct routes
  const adminMenu = [
    { name: "Painel Admin", icon: LayoutDashboard, path: ROUTES.ADMIN.ROOT },
    { name: "Equipamentos", icon: Settings, path: ROUTES.ADMIN.EQUIPMENT },
    { name: "Conteúdo", icon: File, path: ROUTES.ADMIN.CONTENT },
    { name: "Importar Vídeos", icon: Upload, path: ROUTES.VIDEOS.IMPORT },
    { name: "Integrações", icon: LinkIcon, path: ROUTES.ADMIN.SYSTEM.INTELLIGENCE },
    { name: "Config. Vimeo", icon: Video, path: ROUTES.ADMIN.VIMEO.SETTINGS },
    { name: "IA do Sistema", icon: Brain, path: ROUTES.ADMIN.AI },
    { name: "Diagnóstico", icon: TestTube, path: ROUTES.ADMIN.SYSTEM.DIAGNOSTICS }
  ];
  
  // Check if the current path is active
  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD && (location.pathname === '/' || location.pathname === ROUTES.DASHBOARD)) {
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
        {/* Main Menu */}
        <SidebarGroup className="mb-4">
          <SidebarGroupLabel className={cn(!open && "sr-only", "flex items-center")}>
            Menu Principal
          </SidebarGroupLabel>
          <SidebarMenu>
            {mainMenu.map((item) => (
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
        
        {/* Admin Menu */}
        {isAdmin && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className={cn(!open && "sr-only", "flex items-center")}>
              Administração
            </SidebarGroupLabel>
            <SidebarMenu>
              {adminMenu.map((item) => (
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
