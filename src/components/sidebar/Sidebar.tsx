
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar as UISidebar,
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter, 
  SidebarGroupLabel, 
  SidebarGroup, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { usePermissions } from "@/hooks/use-permissions";
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  FileSearch,
  Home,
  Calendar,
  Film,
  Settings,
  LayoutDashboard,
  User,
  Users,
  Settings2,
  CheckCircle,
  BookOpen,
  Brain,
  ListTodo,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const AppSidebar: React.FC<SidebarProps> = ({ 
  sidebarCollapsed, 
  setSidebarCollapsed 
}) => {
  const location = useLocation();
  const { isAdmin, isOperator } = usePermissions();

  // Verifica se o link está ativo (corresponde à rota atual)
  const isLinkActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <UISidebar collapsible="icon">
      <SidebarHeader className="border-b pb-2">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center">
            <Home className="h-5 w-5 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
            <span className="font-medium">Menu Principal</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 rounded-full"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Menu principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem active={isLinkActive('/') || isLinkActive('/dashboard')}>
              <SidebarMenuButton asChild>
                <Link to="/" className="flex items-center">
                  <LayoutDashboard className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem active={isLinkActive('/custom-gpt')}>
              <SidebarMenuButton asChild>
                <Link to="/custom-gpt" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                  <span>Criar Roteiro</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem active={isLinkActive('/scripts') || isLinkActive('/script-history')}>
              <SidebarMenuButton asChild>
                <Link to="/scripts" className="flex items-center">
                  <History className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                  <span>Histórico de Roteiros</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem active={isLinkActive('/validate-script')}>
              <SidebarMenuButton asChild>
                <Link to="/validate-script" className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                  <span>Validador de Roteiros</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem active={isLinkActive('/documents')}>
              <SidebarMenuButton asChild>
                <Link to="/documents" className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                  <span>Artigos Científicos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem active={isLinkActive('/media') || isLinkActive('/media-library')}>
              <SidebarMenuButton asChild>
                <Link to="/media" className="flex items-center">
                  <Film className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                  <span>Biblioteca de Mídia</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem active={isLinkActive('/content-strategy')}>
              <SidebarMenuButton asChild>
                <Link to="/content-strategy" className="flex items-center">
                  <ListTodo className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                  <span>Estratégia de Conteúdo</span>
                  <span className="ml-1.5 px-1.5 py-0.5 text-[0.6rem] font-medium bg-blue-100 text-blue-800 rounded-full">Novo</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem active={isLinkActive('/calendar')}>
              <SidebarMenuButton asChild>
                <Link to="/calendar" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                  <span>Agenda Inteligente</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem active={isLinkActive('/equipment-details')}>
              <SidebarMenuButton asChild>
                <Link to="/admin/equipments" className="flex items-center">
                  <FileSearch className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                  <span>Equipamentos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {(isAdmin() || isOperator()) && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Administração</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem active={isLinkActive('/admin/dashboard')}>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/dashboard" className="flex items-center">
                      <LayoutDashboard className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                      <span>Painel Admin</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem active={isLinkActive('/admin/equipments')}>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/equipments" className="flex items-center">
                      <Settings2 className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                      <span>Gerenciar Equipamentos</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem active={isLinkActive('/admin/content')}>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/content" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                      <span>Gerenciar Conteúdo</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem active={isLinkActive('/admin/integrations')}>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/integrations" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                      <span>Integrações</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem active={isLinkActive('/admin/system-diagnostics')}>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/system-diagnostics" className="flex items-center">
                      <Brain className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                      <span>Diagnóstico do Sistema</span>
                      <span className="ml-1.5 px-1.5 py-0.5 text-[0.6rem] font-medium bg-blue-100 text-blue-800 rounded-full">Novo</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {isAdmin() && (
                  <>
                    <SidebarMenuItem active={isLinkActive('/seller/clients')}>
                      <SidebarMenuButton asChild>
                        <Link to="/seller/clients" className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                          <span>Gerenciar Clientes</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem active={isLinkActive('/seller/dashboard')}>
                      <SidebarMenuButton asChild>
                        <Link to="/seller/dashboard" className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                          <span>Painel de Vendedor</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                )}
              </SidebarMenu>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t pt-2">
        <div className="text-xs text-muted-foreground p-2 text-center">
          Fluida © {new Date().getFullYear()}
        </div>
      </SidebarFooter>
    </UISidebar>
  );
};
