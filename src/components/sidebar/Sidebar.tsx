
import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Sidebar as SidebarContainer,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Home,
  FileText,
  Settings,
  Users,
  Calendar,
  BrainCircuit,
  Video,
  ArrowLeftToLine,
  ArrowRightToLine,
  ListChecks,
  Package,
  BookOpen,
  Laptop,
  CheckCircle,
  ListTodo,
  LayoutDashboard,
  Film,
  Link
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/use-permissions";
import { cn } from "@/lib/utils";

export const AppSidebar = ({ 
  sidebarCollapsed, 
  setSidebarCollapsed 
}: {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
}) => {
  const location = useLocation();
  const { open, setOpen } = useSidebar();
  const { user } = useAuth();
  const { isAdmin, isSeller } = usePermissions();

  // Sincronizar o estado do sidebar contexts com os props
  useEffect(() => {
    if (open !== !sidebarCollapsed) {
      setOpen(!sidebarCollapsed);
    }
  }, [sidebarCollapsed, open, setOpen]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Decidir quais itens mostrar com base nas permissões
  const hasAdminAccess = isAdmin();
  const hasSellerAccess = isSeller();
  
  return (
    <SidebarContainer>
      <SidebarHeader className="flex justify-end">
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto" 
          onClick={toggleSidebar}
          aria-label={open ? "Colapsar menu" : "Expandir menu"}
        >
          {open ? <ArrowLeftToLine className="h-5 w-5" /> : <ArrowRightToLine className="h-5 w-5" />}
        </Button>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Menu principal do cliente */}
        <SidebarGroup>
          {open && <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>}
          <SidebarMenu>
            <SidebarMenuItem active={location.pathname === '/dashboard'}>
              <SidebarMenuButton asChild variant={location.pathname === '/dashboard' ? "active" : "default"}>
                <NavLink to="/dashboard" className="flex items-center">
                  <Home className={cn("h-5 w-5", open ? "mr-2" : "mx-auto")} />
                  {open && <span>Início</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem active={location.pathname === '/custom-gpt'}>
              <SidebarMenuButton asChild variant={location.pathname === '/custom-gpt' ? "active" : "default"}>
                <NavLink to="/custom-gpt" className="flex items-center">
                  <FileText className={cn("h-5 w-5", open ? "mr-2" : "mx-auto")} />
                  {open && <span>Roteiros</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem active={location.pathname === '/validate-script'}>
              <SidebarMenuButton asChild variant={location.pathname === '/validate-script' ? "active" : "default"}>
                <NavLink to="/validate-script" className="flex items-center">
                  <CheckCircle className={cn("h-5 w-5", open ? "mr-2" : "mx-auto")} />
                  {open && <span>Validador</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem active={location.pathname === '/media'}>
              <SidebarMenuButton asChild variant={location.pathname === '/media' ? "active" : "default"}>
                <NavLink to="/media" className="flex items-center">
                  <Video className={cn("h-5 w-5", open ? "mr-2" : "mx-auto")} />
                  {open && <span>Mídia</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem active={location.pathname === '/documents'}>
              <SidebarMenuButton asChild variant={location.pathname === '/documents' ? "active" : "default"}>
                <NavLink to="/documents" className="flex items-center">
                  <BookOpen className={cn("h-5 w-5", open ? "mr-2" : "mx-auto")} />
                  {open && <span>Artigos</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem active={location.pathname === '/content-strategy'}>
              <SidebarMenuButton asChild variant={location.pathname === '/content-strategy' ? "active" : "default"}>
                <NavLink to="/content-strategy" className="flex items-center">
                  <ListTodo className={cn("h-5 w-5", open ? "mr-2" : "mx-auto")} />
                  {open && <span>Estratégia</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem active={location.pathname.startsWith('/equipments') && !location.pathname.startsWith('/admin')}>
              <SidebarMenuButton asChild variant={location.pathname.startsWith('/equipments') && !location.pathname.startsWith('/admin') ? "active" : "default"}>
                <NavLink to="/equipments" className="flex items-center">
                  <Package className={cn("h-5 w-5", open ? "mr-2" : "mx-auto")} />
                  {open && <span>Equipamentos</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        {/* Menu do Admin */}
        {hasAdminAccess && (
          <SidebarGroup className="mt-6 pt-6 border-t border-border">
            {open && <SidebarGroupLabel>Administração</SidebarGroupLabel>}
            <SidebarMenu>
              <SidebarMenuItem active={location.pathname === '/admin/dashboard'}>
                <SidebarMenuButton asChild variant={location.pathname === '/admin/dashboard' ? "active" : "default"}>
                  <NavLink to="/admin/dashboard" className="flex items-center">
                    <LayoutDashboard className={cn("h-5 w-5", open ? "mr-2" : "mx-auto")} />
                    {open && <span>Painel Admin</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem active={location.pathname.startsWith('/admin/equipments')}>
                <SidebarMenuButton asChild variant={location.pathname.startsWith('/admin/equipments') ? "active" : "default"}>
                  <NavLink to="/admin/equipments" className="flex items-center">
                    <Settings className={cn("h-5 w-5", open ? "mr-2" : "mx-auto")} />
                    {open && <span>Equipamentos</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem active={location.pathname === '/admin/integrations'}>
                <SidebarMenuButton asChild variant={location.pathname === '/admin/integrations' ? "active" : "default"}>
                  <NavLink to="/admin/integrations" className="flex items-center">
                    <Link className={cn("h-5 w-5", open ? "mr-2" : "mx-auto")} />
                    {open && <span>Integrações</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
        
        {/* Menu do Vendedor */}
        {hasSellerAccess && (
          <SidebarGroup className="mt-6 pt-6 border-t border-border">
            {open && <SidebarGroupLabel>Vendas</SidebarGroupLabel>}
            <SidebarMenu>
              <SidebarMenuItem active={location.pathname.includes('/seller')}>
                <SidebarMenuButton asChild variant={location.pathname.includes('/seller') ? "active" : "default"}>
                  <NavLink to="/seller/dashboard" className="flex items-center">
                    <Users className={cn("h-5 w-5", open ? "mr-2" : "mx-auto")} />
                    {open && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        {open && <div className="text-xs text-gray-500">Fluida v1.0</div>}
      </SidebarFooter>
    </SidebarContainer>
  );
};
